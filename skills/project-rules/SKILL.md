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
| `add` | Put a rule the user asks for into force. |
| `propose` | Propose rules from this session's corrections, and ask which to keep. |
| `audit` | Report conflicts, overlaps, and rules to drop. |

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

The user asking for a rule *is* the decision that puts it into force, so `add` writes straight into
the list. A rule the agent thought of itself goes through `propose`, which asks first.

1. Read `RULES.md`.
2. Where the new rule repeats an existing rule, contradicts one, or belongs inside one, propose that
   edit and wait for an answer.
3. Otherwise append it to the list as a single `- ` item.

Done when the rule is one item in `RULES.md`'s list, and no other item says the same thing or the
opposite.

## propose

Runs when the user asks for it, and only then. `RULES.md` gains a rule when the user says so, so this
mode ends in a question, never in a silent edit.

1. Read `RULES.md`.
2. Go back over this session and collect every correction — each point where the user redirected you,
   and each mistake you caught yourself. Phrase one candidate rule per correction, as an imperative
   short enough to sit on one line.
3. Drop every candidate an in-force rule already covers, naming the rule that covers it.
4. List what survives, numbered, and ask which to put into force. Add those and no others, following
   `add`.

A session with no corrections proposes nothing. Say so and stop, rather than inventing a rule to have
something to show.

Done when every correction in this session is a rule in `RULES.md`, named as already covered, or
declined by the user.

## audit

1. Read `RULES.md`.
2. Report three lists — rules that contradict each other, rules saying one thing across several
   lines, and rules to drop.
3. Edit only what the user approves.

Done when every rule is either listed in that report or left alone.
