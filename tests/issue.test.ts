// Tests for the `issue` skill's cup wrapper.
//
// Run with: mise test
//
// Two layers, and only the first runs by default:
//
//   Unit    — the pure shaping functions, against fixtures captured from real
//             `cup` output. No network, no auth, deterministic.
//   Live    — the real CLI against real ClickUp. Needs auth, hits the network,
//             and depends on tickets that people edit. Run with ISSUE_LIVE=1.
//
// The fixtures are real responses, not invented ones. Refresh them with:
//   cup task XP-1564 --json > tests/fixtures/XP-1564-closed-empty.json

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  IssueError,
  normaliseTask,
  relations,
  splitSections,
  taskType,
  unwrapTask,
  read,
} from "../skills/issue/bin/issue.ts";

const fixture = (name: string) =>
  JSON.parse(readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), "utf8"));

describe("splitSections", () => {
  test("empty description yields no sections", () => {
    assert.deepEqual(splitSections(""), []);
    assert.deepEqual(splitSections("   \n  "), []);
  });

  test("text with no heading becomes Specification", () => {
    assert.deepEqual(splitSections("just a spec"), [{ heading: "Specification", body: "just a spec" }]);
  });

  test("keeps heading order", () => {
    const sections = splitSections(
      "## Description\nthe spec\n\n## Out of Scope\nnot this\n\n## Implementation\n- ⬜ a step",
    );
    assert.deepEqual(
      sections.map((s) => s.heading),
      ["Description", "Out of Scope", "Implementation"],
    );
    assert.equal(sections[2].body, "- ⬜ a step");
  });

  test("text before the first heading is kept, not dropped", () => {
    const sections = splitSections("preamble prose\n\n## Implementation\n- ⬜ a step");
    assert.deepEqual(sections, [
      { heading: "Specification", body: "preamble prose" },
      { heading: "Implementation", body: "- ⬜ a step" },
    ]);
  });

  test("### is not a section boundary", () => {
    const sections = splitSections("## Description\nintro\n### Detail\nnested");
    assert.equal(sections.length, 1);
    assert.match(sections[0].body, /### Detail/);
  });

  test("CRLF is normalised", () => {
    assert.deepEqual(splitSections("## A\r\nbody\r\n"), [{ heading: "A", body: "body" }]);
  });
});

describe("taskType", () => {
  const options = [
    { id: "opt-task", name: "Task", orderindex: 0 },
    { id: "opt-bug", name: "Bug", orderindex: 1 },
  ];
  const field = (value?: unknown) => [
    { name: "Task Type", type_config: { options }, ...(value === undefined ? {} : { value }) },
  ];

  test("unset field is a blank type, not a failure", () => {
    assert.equal(taskType(field()), "");
    assert.equal(taskType([]), "");
    assert.equal(taskType(undefined as any), "");
  });

  test("resolves by option id", () => {
    assert.equal(taskType(field("opt-bug")), "Bug");
  });

  test("resolves by orderindex", () => {
    assert.equal(taskType(field(0)), "Task");
  });

  test("matches the field name case-insensitively", () => {
    assert.equal(taskType([{ name: "task type", type_config: { options }, value: "opt-bug" }]), "Bug");
  });
});

describe("relations", () => {
  test("direction comes from the ids, not the type field", () => {
    const task = {
      id: "self",
      custom_id: "XP-1",
      dependencies: [
        { task_id: "self", depends_on: "upstream", type: 1 },
        { task_id: "downstream", depends_on: "self", type: 1 },
      ],
    };
    const r = relations(task);
    assert.deepEqual(r.blocked_by.map((x) => x.id), ["upstream"]);
    assert.deepEqual(r.blocks.map((x) => x.id), ["downstream"]);
  });

  test("a dependency naming this Issue by its custom id still resolves", () => {
    const r = relations({
      id: "self",
      custom_id: "XP-1",
      dependencies: [{ task_id: "XP-1", depends_on: "upstream" }],
    });
    assert.deepEqual(r.blocked_by.map((x) => x.id), ["upstream"]);
  });

  test("linked tasks report the other end of the link", () => {
    const r = relations({
      id: "self",
      linked_tasks: [{ task_id: "self", link_id: "other" }, { task_id: "third", link_id: "self" }],
    });
    assert.deepEqual(r.linked.map((x) => x.id), ["other", "third"]);
  });

  test("no relations yields empty arrays, never undefined", () => {
    assert.deepEqual(relations({ id: "self" }), { blocked_by: [], blocks: [], linked: [] });
  });
});

describe("unwrapTask", () => {
  test("accepts a bare task, an envelope, and an array", () => {
    assert.equal(unwrapTask({ id: "a" }).id, "a");
    assert.equal(unwrapTask({ task: { id: "b" } }).id, "b");
    assert.equal(unwrapTask([{ id: "c" }]).id, "c");
  });

  test("throws an IssueError on a shape it cannot read", () => {
    assert.throws(() => unwrapTask({ nope: true }), IssueError);
  });
});

describe("normaliseTask, against real cup responses", () => {
  test("XP-1564: closed, empty description, unset type", () => {
    const issue = normaliseTask(fixture("XP-1564-closed-empty"));
    assert.equal(issue.custom_id, "XP-1564");
    assert.equal(issue.status_closes, true, "status.type is `closed`, so it closes the Issue");
    assert.equal(issue.type, "", "Task Type carries no value key on this Issue");
    assert.deepEqual(issue.sections, [], "the description really is empty");
  });

  test("XP-1559: open, has an Implementation section and a parent", () => {
    const issue = normaliseTask(fixture("XP-1559-implementation"));
    assert.equal(issue.custom_id, "XP-1559");
    assert.equal(issue.status_closes, false, "status.type is `custom`, which does not close");
    assert.equal(issue.parent, "869ek47nn");
    assert.deepEqual(issue.sections.map((s) => s.heading), ["Implementation"]);
  });

  test("a closing status is read from status.type, never the name", () => {
    const raw = fixture("XP-1564-closed-empty");
    const task = raw.id ? raw : raw.task;
    assert.equal(task.status.status, "Closed");
    assert.equal(task.status.type, "closed");
  });
});

describe("live: the real cup CLI", { skip: !process.env.ISSUE_LIVE && "set ISSUE_LIVE=1 to run" }, () => {
  test("reads XP-1558 from ClickUp", () => {
    const issue = read("XP-1558");
    assert.equal(issue.custom_id, "XP-1558");
    assert.ok(issue.id, "a native id came back");
  });

  test("a deleted Issue throws rather than returning junk", () => {
    assert.throws(() => read("XP-1563"), /404|not found/i);
  });
});
