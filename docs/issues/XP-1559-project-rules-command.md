---
id: 869ek4acw
custom_id: XP-1559
title: project-rules command
status: in progress
type:
url: https://app.clickup.com/t/869ek4acw
date_updated: 1787050380926
parent: XP-1558 - AI Skills tools @in progress
blocked_by:
blocks:
subtasks:
---

## Implementation

- ✅ skills/project-rules/SKILL.md — modes setup, add, propose, audit
- ✅ skills/project-rules/templates/rules.md — the shape a new RULES.md starts in
- ✅ skills/project-rules/templates/agents-block.md — the block AGENTS.md gains
- ✅ CONTEXT.md — Rule
- ✅ RULES.md is one flat list, no topic headings — headings turn rules into islands agents skim
- ✅ Short file by design — it works by being read, and a long one stops being read
- ✅ AGENTS.md pointer reads "Read RULES.md now", never "see RULES.md for details"
- ✅ project-rules:start / :end markers, so the block is findable and other tools' blocks stay safe
- ✅ setup writes RULES.md, appends the block once, symlinks CLAUDE.md to AGENTS.md
- ✅ setup leaves an existing RULES.md alone and asks before touching a CLAUDE.md with content
- ✅ setup lists rules already sitting in AGENTS.md and asks which to move across
- ✅ add writes straight into the list — the user asking is the decision that puts a rule in force
- ✅ add proposes the edit first where a rule repeats, contradicts, or belongs inside an existing one
- ✅ propose collects this session's corrections, one imperative line each, and ends in a question
- ✅ propose drops candidates an in-force rule already covers, naming the rule that covers it
- ✅ A session with no corrections proposes nothing, rather than inventing a rule to show
- ✅ audit reports contradictions, rules spread over several lines, and rules to drop
- ✅ audit edits only what the user approves
- ✅ Dropped the ## Proposed section from RULES.md — propose replaces it, so nothing lands unapproved
- ✅ Dropped the mode command and its self-proposal lines — AskUserQuestion is Claude-only
- ✅ disable-model-invocation: true — the skill runs when the user asks for it and not otherwise
- ✅ Dogfooded here: RULES.md, the AGENTS.md block, and the CLAUDE.md symlink are all in place
- ✅ Shipped — no metadata.internal, and .claude-plugin/plugin.json lists ./skills/project-rules

## Specification

Repos in this catalogue had no consistent, low-overhead way to record and enforce the rules an
agent should follow while working in them, so conventions got restated ad hoc or forgotten.

`project-rules` is a Skill that manages one `RULES.md` per repo — a flat list, one rule per line,
no topic headings, because headings would turn rules into islands an agent skims past rather than
reads whole. `AGENTS.md` carries one pointer block, "Read RULES.md now", and `CLAUDE.md` symlinks
to `AGENTS.md` so both agents follow the same file.

Four modes: `setup` creates the file and wiring; `add` puts a user-requested rule straight into
force, since the user asking is the decision; `propose` turns this session's corrections into
candidate rules and asks before adding any; `audit` reports contradictions, overlaps, and no-ops,
and edits only what the user approves. No mode command and no self-proposing behaviour, because
`AskUserQuestion` is Claude Code-only and this Skill runs on every Agent target.

## Testing

No automated seam exists for this: the repo's only check, `mise validate`, verifies Skill layout
and frontmatter, not behaviour. Verification is manual and unticked below. No prior art — this is
the first Skill in the catalogue to carry this section.

- ⬜ Run `setup` end to end on a repo that is not this one.
- ⬜ Run `propose` and `audit` on a repo with a RULES.md long enough to conflict.
- ⬜ Verify on an Agent target other than claude-code — codex, opencode, pi.
