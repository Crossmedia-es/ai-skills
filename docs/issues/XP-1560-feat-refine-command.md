---
id: 869ek4ad2
custom_id: XP-1560
title: feat-refine command
status: backlog
type:
url: https://app.clickup.com/t/869ek4ad2
date_updated: 1787006588503
parent: XP-1558 - AI Skills tools @in progress
blocked_by:
blocks:
subtasks:
---

## Specification

feat-refine replaces issue-refine as the refine command of the Issue family and takes its name:
one Issue becomes a Specification, an Implementation checklist and a Testing checklist through
rounds of questions, each numbered with a recommended answer. It reads the Issue file and its
relations, delegates tracker work to `/issue-pull`, and writes per TEMPLATE.md under ceilings of
80 lines, a 6-line Specification, 10 Implementation items and 10 tests. `## Testing` replaces
`## Testing Decisions` everywhere. The old issue-refine text is deleted, not ported.

## Implementation

- ✅ skills/feat-refine replaces issue-refine — its text takes over skills/issue-refine/SKILL.md, changed to call /issue-pull instead of cup and stop on no id or an unknown id
- ✅ Delete skills/issue-refine/SLICES.md and skills/feat-refine/
- ✅ Rename `## Testing Decisions` to `## Testing` in issue-implement, issue-verify, issue-done SKILL.md and the issue-setup template — found mid-build, covered by "everywhere"
- ✅ Rename the section heading in docs/issues/XP-1559-project-rules-command.md
- ✅ Ship it: drop metadata.internal from issue-refine, run mise sync-plugin, bump the plugin version, mise validate green

## Testing

No automated seam covers Skill behaviour — mise validate checks layout and frontmatter only.
Verification is static checks and manual runs.

- ✅ integration: `mise validate` exits 0 after all edits — layout, frontmatter and plugin coherent
- ⬜ manual: `/issue-refine XP-1561` end to end — rounds of ≤5 numbered questions with a recommended answer each; the file follows TEMPLATE.md and stays under the ceilings
- ⬜ manual: the Testing step proposes ≤10 tests; refuse half; `## Testing` holds exactly the chosen subset
- ✅ static: grep shows no `cup` call in issue-refine, zero `Testing Decisions` in skills/, none in docs/issues/ but XP-1560's own record, zero `SLICES.md`, no feat-refine in plugin.json, no Claude-only syntax
- ✅ static: the diff of XP-1559's file shows exactly one changed line — the section heading
- ⬜ manual, edge: a refine whose answers want 11 checklist items — the Skill names the ceiling and offers a cut, and writes no eleventh line
- ⬜ manual, error: `/issue-refine` with no argument and `/issue-refine 9999` both stop and write nothing
- ✅ integration: `mise sync-plugin` lists ./skills/issue-refine and not ./skills/feat-refine; metadata.internal gone; plugin version bumped

## Out of Scope

- The issue family's behaviour over the new `## Testing` checklist — issue-implement runs the tests, issue-verify and issue-done follow — XP-1561.
- ClickUp's copy of XP-1559 keeps the old heading until someone runs `/issue-push XP-1559`.
- Dropped with the old issue-refine on purpose, not ported: the status gate, finding labels, the report, and tick protection.
