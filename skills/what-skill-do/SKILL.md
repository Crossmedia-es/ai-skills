---
name: what-skill-do
description: Break down any Skill currently loaded by the harness into a paragraph-by-paragraph list of the decisions it makes. Use to debug or understand a Skill, wherever it lives, decision by decision, rather than read its prose.
disable-model-invocation: true
---

# what-skill-do

Turn one Skill's prose into a checklist of decisions, in the file's own order.

## Context
- Skill folder: In order, the project's own skills folders (`.claude/skills/`,`.agents/skills/`, `.pi/skills/`) or the same ones at the `~/` folder.
- Element: Any block of instruction. A paragraph, prose, table or step-list. "done when" counts...

## Input

One argument: a Skill name.

| Check | Do |
| --- | --- |
| Skill name | Find its `SKILL.md`. Check and read the first that exists in the "Skill folder". |
| Found in none of those | Say so and stop |

## Steps

1. Read the file top to bottom, in the order it's written — frontmatter excluded, everything included.
2. Walk it one element at a time. For each one, write a heading naming what
   it is (include its line number, quote opening words, or name the section it sits under).
3. Under that heading, write one bullet per decision that paragraph makes. A decision is a rule,
   a choice, a condition-and-response, or a stated reason — not a description of what something is.
4. Where a single sentence carries more than one decision, split it: one bullet per decision, not
   one bullet per sentence.
5. Take every decision from the file's own words, adding nothing the file didn't say. Give a bullet
   to every decision found, however minor it looks — a table row and a "done when" line are
   decisions too.
6. Keep the bullets in the file's own order, section by section, top to bottom.
7. At the end show a report where decisions are too verbose, unnedeed, can be compacted, contradicts or are duplicated based on the section they are declared.

Done when every element in the Skill's file has a heading, and every decision
in it appears underneath as its own bullet.
