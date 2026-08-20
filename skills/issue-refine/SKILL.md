---
name: issue-refine
description: Interview the user about one Issue, then write its Specification and its Implementation checklist — the steps an agent builds from. Refines only; never implements, never pushes.
disable-model-invocation: true
metadata:
  internal: true
---

# issue-refine

`/issue-refine <id>` turns one **Issue** into an Issue file someone else could build from without
inventing a spec: a `## Specification` that decides the approach, and an **Implementation checklist**
of steps short enough to follow and specific enough to be wrong.

**Document only.** The only file this Skill changes is the target's Issue file. Write no project
code, run no build.

This Skill knows nothing about the tracker. Call `/issue read`, `/issue-pull` and `/issue-push`
rather than any tracker command, and where `issue` is not installed, say so and stop.

## Output

A round is numbered questions and nothing else. The closing report is the file path, a table of the
sections written, and the findings that need a decision. No account of what the Skill did, and no
summary of the Issue back to the person who just answered questions about it.

## Not this Skill's work

Each of these is a finding with a command attached, never an action taken here:

| Found | Say |
| --- | --- |
| The Issue is too big for one build | Name the slices you would cut. `/issue-new` raises them. |
| A sibling Issue conflicts | Name it by id. `/issue-refine <other-id>` fixes it there. |
| A term belongs in the glossary | Name it. Writing it is the user's call. |
| The refined Issue is ready to leave the laptop | `/issue-push <id>` |

Edit one Issue file: the target's. The other Issue may be the correct one, and this Skill only heard
one side.

## 1. Resolve the Issue

One Issue per run. Refinement is a conversation, and five at once is five interleaved conversations
whose answers contaminate each other. A parent whose subtasks all need refining is that many runs.

- **No id given** — stop, and say which Issue you need. A **Draft** with no id is `/issue-new`'s to
  raise first. Never guess an Issue from the branch name.
- **No Issue file for that id** — run `/issue-pull <id>` and refine the file it writes.

## 2. Read before asking

Never ask what a document already answers. Read:

- The Issue file whole, and every related Issue — `parent`, `subtasks`, `blocked_by`, `blocks`. One
  already in `docs/issues/` is read from disk; the rest come from `/issue read <id>`, which prints
  without leaving a file behind.
- `CONTEXT.md` for the project's vocabulary, and `RULES.md` for how work is done here. The Issue is
  written in the project's language or it is written wrong.
- The code the Issue touches. Dispatch this as background exploration and carry on — only the
  questions that depend on it wait.

Read what this step names, and stop there. The repo at large is not a source of scope.

Done when every related Issue has been read and you can name what you scanned for.

## 3. Gate on status

`/issue read <id>` reports whether the Issue's status closes it. Status names are per-list, so take
that verdict rather than reading the name.

- **Closed** — the Issue is built. Say so, and refine it only if the user asks for the built Issue to
  change. Otherwise offer a new Issue.
- **Open, with ✅ items already in the checklist** — work is under way. Warn that refining mid-flight
  can invalidate work already done, and confirm before going on.
- **Otherwise** — proceed.

## 4. Analyse

Read-only. Bring findings and open questions, not homework.

- **Readiness** — could someone build this without inventing a spec? Name what is undecided:
  approach, scope, data shape, the files it touches.
- **The simpler solution** — look for it, and propose it. A refined Issue that quietly doubles the
  work is a worse Issue, however specific it is.
- **The seam** — where is this proven? Prefer a seam the codebase already has, and the highest one
  that covers the behaviour. An Issue whose only honest check is "look at it" is not a defect: say so
  now, because finding it out after the build costs more.
- **Order** — work this Issue assumes already exists. Name the Issue it rests on, by id and status.
- **Conflicts** — among the Issues read in step 2: two Issues changing the same file or identifier,
  a contradiction with something already built, duplicated work.
- **Size** — could one agent build this in one pass, in twelve steps or fewer? If not, that is the
  finding, and the checklist waits until the Issue is split.
- **Doubts** — anything you would otherwise settle by assuming.

## 5. Ask

Ask in rounds. Each round is the questions whose answers do not depend on another question still
open — a question that does belongs to the next round, not this one.

Number each question, state it in one line, and give the answer you would pick:

```
1. <question> — I would <recommended answer>, because <one line>.
```

Then wait. Write nothing until the answers are in.

**The floor: a Specification.** Most Issues arrive as a title and nothing else. That is normal, and
it is why this Skill asks before it writes. Keep asking until you can state, in your own words and
without hedging, what the problem is and what the solution does. Until then the next round is never
optional — a checklist written over a vague Specification is a plan for work nobody agreed to.

**The ceiling.** Stop asking when the next round would only confirm detail you can settle yourself.
An Issue whose Specification is already clear takes no rounds at all: say it is ready and go to step
6. Never manufacture a question to look thorough.

## 6. Write

Once, at the end, from everything heard. Write the sections `docs/issues/TEMPLATE.md` defines and no
others — a new section is a change to that file, not to this run.

| Section | Holds |
| --- | --- |
| `## Specification` | The problem, the solution, and the decisions taken. Name modules and behaviour; no file paths — this section outlives the build and a path goes stale first. |
| `## Implementation` | The checklist. Unticked steps, in build order. |
| `## Testing Decisions` | The seam from step 4, what passing there proves, and prior art for the test. Or, plainly, that no automated check settles it. |
| `## Out of Scope` | What this Issue does not cover. This is what stops a build sprawling. |

Leave out a section with nothing true to say in it. `## Specification` is the one exception: an Issue
without one is not refined, so go back to step 5.

**Write for a human in a hurry.** Use ASD-STE100 Simplified Technical English: one idea per sentence,
active voice, present tense, and the same word for the same thing every time. Short beats complete —
a section nobody finishes is a section nobody read.

**Show every change before making it.** Where a section already holds text, show what changes and
confirm. Someone wrote it, and what they wrote is evidence about what they meant.

### The two ceilings

Both are tests of the Issue, not budgets for the document.

| Ceiling | First response |
| --- | --- |
| 85 lines, frontmatter included | Tighten the wording. Plain sentences cut most drafts by a third and lose nothing true. |
| 12 checklist items | None. A thirteenth step is more work than one Issue holds. |

Still over: the number is **evidence**. Stop writing, name the slices you would cut, and offer
`/issue-new` for each. Padding to reach a ceiling and deleting a decision to get under one are the
two wrong answers.

### The checklist

One `- ⬜ ` line per step, imperative, naming the file or symbol it touches —
`- ⬜ Add read mode to skills/issue/SKILL.md, printing instead of writing`. Paths belong here: this
is a build order consumed within days by an agent that needs to know where to type. A step that will
not fit on one line is two steps, and the tracker mangles a wrapped line anyway.

The checklist is the sequence. The reasoning is in `## Specification`.

**Ticks survive.** A `- ✅ ` line records work that happened and code that exists. Carry it through
untouched and place new steps around it. Where the new plan makes a ticked line wrong, say so in the
report — deleting the audit record is not this Skill's call.

### Out of scope

A line moved out of scope disappears from the plan, so give every item a home. Per item:

1. Search the Issues read in step 2 for one that already covers it. Found: name it by id in
   `## Out of Scope` — "covered by XP-1560" is a home.
2. Not found: offer `/issue-new "<title>"` and say what that Issue would hold.
3. The user declines, or the item is not worth an Issue: leave it in `## Out of Scope` and say it has
   no home yet.

The user places these. `/issue-new` is their command to run.

## 7. Report

The file path, and the line count against the 85-line ceiling. A table of the sections written. Then,
and only where there is something to say: conflicts by id, ordering findings, the slices you would
cut, a ticked line the new plan contradicts, the questions left unanswered, and what you scanned for.

Close with `/issue-push <id>`. Nothing was built and nothing was sent, so no status changes here.

## Done when

The Issue file holds a Specification you could hand to a stranger, a checklist of twelve steps or
fewer, a home for every out-of-scope item, and 85 lines or fewer in total — or the report names which
of those the Issue cannot yet satisfy, and why.
