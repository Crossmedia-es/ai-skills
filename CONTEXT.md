# Cross-Media AI Skills

Cross-Media's catalogue of agent skills, published as one repo and installed per-skill,
per-agent by `npx skills`. Also shipped as a Claude Code plugin.

## Language

**Skill**:
One unit of agent instruction — a directory holding a `SKILL.md` whose frontmatter carries
`name` and `description`. Installable on its own, independent of every other Skill.
_Avoid_: plugin, command, prompt, rule

**Agent target**:
A coding agent that a Skill can be installed to, named by its `npx skills` agent id —
`claude-code`, `codex`, `opencode`, `pi`.
_Avoid_: runtime, harness, model, client, editor

**Framework**:
A project-installed system carrying its own version and migration lifecycle, which *ships* a
Skill as a thin entry point rather than being one. `ai-skill-feat-workflow` is a Framework.
_Avoid_: skill, scaffold, template

**Install channel**:
A route by which a Skill reaches a machine — either `npx skills` (editable copies, every
Agent target) or the Claude Code plugin (managed read-only bundle, `claude-code` only).
_Avoid_: installer, distribution, delivery

**Internal skill**:
A Skill carrying `metadata.internal: true`, hidden from the picker unless
`INSTALL_INTERNAL_SKILLS=1` is set. Where unfinished Skills live.
_Avoid_: in-progress, draft, WIP, experimental

### project-rules

**Rule**:
One imperative line in `RULES.md` constraining how an agent works in a repo.
_Avoid_: instruction, guideline, constraint, convention, standard

### issue

**Issue**:
One work item tracked in ClickUp. ClickUp's own API calls it a task, which is why the commands read
`cup task …`.
_Avoid_: ticket, story, card, task

**Draft**:
An Issue file carrying no `id` — written locally, not yet in ClickUp. `/issue-new` raises it there
and takes the id back; every other Skill in the family refuses to touch it.
_Avoid_: new issue, unsaved issue, local-only

**Issue file**:
An Issue's local markdown copy, `docs/issues/<id>-<slug>.md`. Disposable — everything in it
round-trips to ClickUp, so a finished one is deleted and rebuilt by `/issue-pull` when the work
reopens.
_Avoid_: issue doc, local task, markdown ticket

**Implementation checklist**:
The `## Implementation` section of an Issue file, and the first section in it. One artifact with a lifecycle: written before the
build as unticked steps, ticked off by whichever skill implements the Issue, and pushed to ClickUp as
part of the description, where it stands as the audit record.
_Avoid_: notes, log, todo list

## Relationships

- This library holds many **Skills**; each **Skill** installs to one or more **Agent targets**
- Each **Install channel** exposes a subset of the **Skills** — `npx skills` exposes all
  non-**Internal** ones; the plugin exposes those named in `.claude-plugin/plugin.json`
- A **Framework** may ship a **Skill**; a **Skill** never ships a **Framework**
- An **Issue file** is a **Draft** until `/issue-new` gives it an id; after that ClickUp owns the
  record and the file is a copy of it

## Flagged ambiguities

- "skill" previously meant three different things: the `SKILL.md` unit, the `feat` **Framework**
  that merely wraps one, and the `ai-skill-*` repo-name prefix. Resolved: the unit is a
  **Skill**; `feat` is a **Framework**; the prefix is just a repo name and carries no meaning.
- "install" conflated *which skills* with *which agents* and *project vs user scope*. Resolved:
  those are three independent axes of one **Install channel**, all chosen in the `npx skills` picker.
