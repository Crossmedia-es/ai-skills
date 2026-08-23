---
name: project-rules
description: Set up and maintain a repo's RULES.md, the rules agents follow when they work in it.
disable-model-invocation: true
---

# RULES.md 

RULES.md holds the rules agents must follow on every task in this repo.
It's written as a flat list — one -  bullet per rule, no nesting.
Grouping lines by topic headings must be asked by the user.
The file must stay short. Max. 100 lines.

## 4 types of arguments and how to behave.

| Mode | Does |
| --- | --- |
| `setup` | Create `RULES.md` and point `AGENTS.md` at it. |
| `propose` | Propose rules from this session's corrections, and ask which to keep. |
| `audit` | Report conflicts, overlaps, and rules to drop. |

An argument that is not one of these three is a new rule. Add the prompt as a rule into the RULES.md file and enforce it immediately.
For deambiguation, a new rule can be surrounded by "", '' or ``. `/project-rules "Propose how to reduce typos"` it's a new rule.

## When adding rules

A user explicitly asking for a rule counts as the approval decision itself.

1. Read `RULES.md`.
2. If the new rule repeats, contradicts, or fits inside an existing rule, propose an edit and wait for the user's answer instead of just adding it.
3. Otherwise append it to the list as a single `- ` item.

Done when the rule exists in `RULES.md` as exactly one list item, and no other item duplicates or contradicts it.

## setup

1. Write `RULES.md` from [`templates/rules.md`](templates/rules.md), leaving an existing file alone.
2. Create `AGENTS.md` if it is absent.
3. Add to `AGENTS.md` once. Put it as on top of the file as posible. Do the same to `CLAUDE.md` if exists and is not a symlink: 
```md
<!-- project-rules:start -->
## Rules

Read `RULES.md` now.
<!-- project-rules:end -->
```
4. List any rules already sitting in `AGENTS.md`, and ask which to move into `RULES.md`.

Done when: `RULES.md` exists and `AGENTS.md` (and `CLAUDE.md`) holds one `project-rules` block.

## propose

This mode only runs when the user explicitly asks for it — never automatically.
It always ends by asking a question; it never silently edits the file.

1. Read `RULES.md`.
2. Scan back through the whole session for corrections — times the user redirected the agent, and times the agent caught its own mistake — and turn each one into a short candidate rule.
3. Drop any candidate that's already covered by an existing rule, and say which rule covers it.
4. List the surviving candidates as a numbered list and the reason to add it, ask which to keep, then add the approved ones using this skill.

If the session had zero corrections, propose nothing. Say so plainly and stop.
Done when: every correction from the session is on the `RULES.md`, marked as already covered, or explicitly declined by the user.

## audit

1. Read `RULES.md`.
2. Test every rule against all three categories,  and report each list with the rules it caught:
   - **Contradicts** — two rules that cannot both be followed.
   - **Overlaps** — one rule said across several items. Name the item that should survive.
   - **Drop** — a **no-op**: a rule the agent already follows without being told, a rule about a
     tool this repo no longer uses, or a rule so vague it fits any behaviour. Give the reason.
3. Print how many rules exist now versus how many the file started with.
4. Edit only what the user approves.

Done when  every rule has been checked against all three categories, and every flagged rule
has either been edited or explicitly left alone per the user's decision.
