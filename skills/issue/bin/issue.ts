#!/usr/bin/env node
// Wrapper around the ClickUp CLI (`cup`) for the `issue` skill.
//
// Emits normalised JSON on stdout; the skill decides how to render it.
// Dependency-free by necessity: skill folders ship as plain copied files, so
// there is no `node_modules` and no install step. Node stdlib only.
//
// Built against @krodak/clickup-cli 1.43.0.
//
// Everything above `main` is pure — it takes a task object and returns a
// normalised one, spawning nothing. That is the seam the tests work at, since
// the shaping is where the bugs live and the fetching needs a network.

import { execFileSync } from "node:child_process";

export const CUP_TESTED = "1.43.0";

export interface Section {
  heading: string;
  body: string;
}

export interface Relation {
  id: string;
  title: string | null;
  status: string | null;
}

/** Carries a hint so the CLI boundary can turn it into a useful JSON error. */
export class IssueError extends Error {
  hint?: string;
  constructor(message: string, hint?: string) {
    super(message);
    this.hint = hint;
  }
}

/** `cup` may wrap the task in an envelope; unwrap to the object holding `id`. */
export function unwrapTask(payload: any): any {
  if (payload && typeof payload === "object") {
    if (payload.id) return payload;
    for (const key of ["task", "data", "result"]) {
      if (payload[key]?.id) return payload[key];
    }
    if (Array.isArray(payload) && payload[0]?.id) return payload[0];
  }
  throw new IssueError("Could not find a task object in cup's response.");
}

/**
 * The `Task Type` custom field's id is a per-list uuid, so match it by name and
 * resolve the stored value against the field's own options. An unset field
 * carries no `value` key at all — that is a blank type, not a failure.
 */
export function taskType(fields: any[]): string {
  const field = (fields ?? []).find((f) => String(f?.name).toLowerCase() === "task type");
  if (!field || field.value === undefined || field.value === null) return "";
  const options = field.type_config?.options ?? [];
  const match = options.find((o: any) => o.id === field.value || o.orderindex === field.value);
  return match?.name ?? String(field.value);
}

/**
 * Split a description into `##` sections, preserving order. Text before the
 * first heading becomes `## Specification` — an Issue whose spec carries no
 * heading of its own goes there whole.
 */
export function splitSections(markdown: string): Section[] {
  const text = (markdown ?? "").replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const sections: Section[] = [];
  let heading = "Specification";
  let buffer: string[] = [];

  const flush = () => {
    const body = buffer.join("\n").trim();
    if (body || sections.length) sections.push({ heading, body });
    buffer = [];
  };

  for (const line of text.split("\n")) {
    const match = /^##\s+(.*\S)\s*$/.exec(line);
    if (match) {
      flush();
      heading = match[1];
    } else {
      buffer.push(line);
    }
  }
  flush();
  return sections.filter((s) => s.body || s.heading !== "Description");
}

/**
 * A dependency object holds ids alone, so take the direction from the ids
 * rather than the `type` field: an entry whose `task_id` is this Issue puts its
 * `depends_on` under `blocked_by`, and the reverse puts it under `blocks`.
 */
export function relations(task: any): {
  blocked_by: Relation[];
  blocks: Relation[];
  linked: Relation[];
} {
  const self = new Set([task.id, task.custom_id].filter(Boolean));
  const blocked_by: Relation[] = [];
  const blocks: Relation[] = [];

  for (const dep of task.dependencies ?? []) {
    if (self.has(dep.task_id)) blocked_by.push({ id: dep.depends_on, title: null, status: null });
    else if (self.has(dep.depends_on)) blocks.push({ id: dep.task_id, title: null, status: null });
  }

  const linked: Relation[] = (task.linked_tasks ?? [])
    .map((l: any) => (self.has(l.task_id) ? l.link_id : l.task_id))
    .filter(Boolean)
    .map((id: string) => ({ id, title: null, status: null }));

  return { blocked_by, blocks, linked };
}

/** Pure: a raw `cup` task object in, the skill's normalised shape out. */
export function normaliseTask(raw: any) {
  const task = unwrapTask(raw);
  const description: string = task.markdown_description ?? task.description ?? "";
  const statusType: string = task.status?.type ?? "";

  return {
    id: task.id,
    custom_id: task.custom_id ?? "",
    title: task.name ?? "",
    status: task.status?.status ?? "",
    // Status names are per-list, so whether a status *closes* an Issue can only
    // be read from `status.type`, never inferred from the name.
    status_closes: statusType === "done" || statusType === "closed",
    status_type: statusType,
    type: taskType(task.custom_fields),
    url: task.url ?? "",
    date_updated: task.date_updated ?? "",
    parent: task.parent ?? "",
    ...relations(task),
    sections: splitSections(description),
  };
}

// ── everything below spawns `cup` ────────────────────────────────────────────

export function cup(args: string[]): unknown {
  let raw: string;
  try {
    raw = execFileSync("cup", [...args, "--json"], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      throw new IssueError("`cup` is not on PATH.", "pnpm add -g @krodak/clickup-cli");
    }
    const stderr = String(err?.stderr ?? "").trim();
    if (/not configured|unauthor|401/i.test(stderr)) {
      throw new IssueError("`cup` is not authenticated.", "Run `cup init`.");
    }
    throw new IssueError(stderr || `cup ${args.join(" ")} failed`);
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new IssueError(`cup returned output that is not JSON: ${raw.slice(0, 200)}`);
  }
}

// `cup` accepts a custom id (`XP-1564`) or a native one wherever a task id is
// taken, so no flag distinguishes them. `markdown_description` is on the raw
// task object already; no flag fetches it.
export function read(id: string) {
  return normaliseTask(cup(["task", id]));
}

function main(argv: string[]) {
  const [mode, id] = argv;
  try {
    if (mode !== "read") {
      throw new IssueError(`Unknown mode: ${mode ?? "(none)"}`, "Only `read <id>` is implemented.");
    }
    if (!id) {
      throw new IssueError("`read` needs an Issue id.", "This wrapper never guesses one from the git branch.");
    }
    return { ok: true as const, cup_tested: CUP_TESTED, issue: read(id) };
  } catch (err: any) {
    return { ok: false as const, error: err?.message ?? String(err), hint: err?.hint };
  }
}

// Only run as a CLI when executed directly, so tests can import this file.
if (process.argv[1] && import.meta.filename === process.argv[1]) {
  const result = main(process.argv.slice(2));
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  process.exit(result.ok ? 0 : 1);
}
