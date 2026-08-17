---
name: project-rules
description: Set up and maintain a repo's RULES.md, the rules agents follow when they work in it.
disable-model-invocation: true
---

# project-rules

`RULES.md` holds the rules agents follow in this repo, as one flat markdown list — a `- ` item per
rule. `AGENTS.md` points at it, and `CLAUDE.md` is a symlink to `AGENTS.md`.

Keep the list flat and add no topic headings. Sections turn the rules into islands, and an agent that
finds the section matching its task reads that one and skims the rest. Every rule applies to every
task, so every rule stays in one list.

Keep the file short. It works by being read, and a long file stops being read.

## Modes

Given no mode, list these and stop.

| Mode | Does |
| --- | --- |
| `setup` | Create `RULES.md` and point `AGENTS.md` at it. |
| `add` | Add a rule. |
| `audit` | Report conflicts, overlaps, and rules to drop. |
| `mode` | Change what the agent does after a correction. |

## setup

1. Write `RULES.md` from [`templates/rules.md`](templates/rules.md), leaving an existing file alone.
2. Append [`templates/agents-block.md`](templates/agents-block.md) to `AGENTS.md` once, creating
   `AGENTS.md` if it is absent. Where the `project-rules` markers are already present, leave the block
   alone. Leave other tools' blocks alone.
3. Symlink `CLAUDE.md` to `AGENTS.md`, asking first where `CLAUDE.md` already holds content.
4. List any rules already sitting in `AGENTS.md`, and ask which to move into `RULES.md`.

Done when `RULES.md` exists, `AGENTS.md` holds one `project-rules` block, and `CLAUDE.md` resolves to
`AGENTS.md`.

## add

1. Read `RULES.md`.
2. Where the new rule repeats an existing rule, contradicts one, or belongs inside one, propose that
   edit and wait for an answer.
3. Otherwise append it to the list as a single `- ` item.

Done when the rule is one item in `RULES.md`'s list, and no other item says the same thing or the
opposite.

## audit

1. Read `RULES.md`.
2. Report three lists — rules that contradict each other, rules saying one thing across several
   lines, and rules to drop.
3. Ask about each rule under `## Proposed`: promote or delete.
4. Edit only what the user approves.

Done when every rule is listed or kept, and `## Proposed` is empty.

## mode

Ask with `AskUserQuestion`, so the user picks from a selectable control rather than typing a number.
One question, `header: Self-propose`, and these three options with `propose` first as the recommended
one:

| label | description |
| --- | --- |
| `propose` | Recommended. After a correction, append the rule to `## Proposed` in `RULES.md`. |
| `ask` | Name the rule in chat and write nothing. |
| `off` | Do neither. |

Where `AskUserQuestion` is missing — every Agent target other than `claude-code`, and any Claude Code
session that denies the tool — ask the same three as a numbered list.

Then replace the self-proposal line in the `AGENTS.md` block with the matching one from
[`templates/agents-block.md`](templates/agents-block.md).

Done when the block holds one such line, or none for `off`.
