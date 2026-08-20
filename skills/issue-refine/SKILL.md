---
name: issue-refine
description: Refine one Issue into a Specification and an Implementation checklist an agent can build from. Use when an Issue needs a spec, its scope is undecided, or its checklist is missing.
disable-model-invocation: false
---

# issue-refine

`/issue-refine <id>` turns one **Issue** into an Issue file someone else could build from without
inventing a spec: a `## Specification` that decides the approach, and an **Implementation checklist**
of steps short enough to follow and specific enough to be wrong.

**Document only.** The only file this Skill changes is the target's Issue file. Write no project
code, run no build.

This Skill knows nothing about the tracker. Call `/issue-pull` and `/issue-push` rather than any
tracker command, and where neither is installed, say so and stop.

## Not this Skill's work

Each of these is a finding with a command attached, never an action taken here:

| Found | Say |
| --- | --- |
| The Issue is too big for one build | Cut it into slices. Read [`SLICES.md`](SLICES.md). |
| A sibling Issue conflicts | Name it by id. `/issue-refine <other-id>` fixes it there. |
| An open Issue blocks this one | Name it by id and status. The build waits; this refinement does not. |
| This Issue blocks another | Name it by id. A scope change here needs `/issue-refine <that-id>`. |
| A term belongs in the glossary | Name it. Writing it is the user's call. |
| The Specification is a position nobody has argued with | Say so, and offer `/grill-with-docs`. Absent, run one more round of step 5 aimed at the Specification. |
| The refined Issue is ready to leave the laptop | `/issue-push <id>` |

Edit one Issue file: the target's. The other Issue may be the correct one, and this Skill only heard
one side.

## 1. Resolve the Issue

One Issue per run — five at once is five interleaved conversations whose answers contaminate each
other. A parent whose subtasks all need refining is that many runs.

- **No id given** — stop, and say which Issue you need. A **Draft** with no id is `/issue-new`'s to
  raise first. Never guess an Issue from the branch name.
- **No Issue file for that id** — run `/issue-pull <id>` and refine the file it writes.

## 2. Read before asking

Never ask what a document already answers. Read:

- The Issue file whole, and every related Issue — `parent`, `subtasks`, `blocked_by`, `blocks`. One
  already in `docs/issues/` is read from disk; the rest come from `/issue-pull <id> --print`, which
  prints without leaving a file behind.
- `CONTEXT.md` for the project's vocabulary, and `RULES.md` for how work is done here. Where the repo
  holds more than one `CONTEXT.md`, follow `CONTEXT-MAP.md` to the one covering this Issue. The Issue
  is written in the project's language, and so are the questions, or both are written wrong.
- The code the Issue touches. Dispatch this as background exploration and carry on — only the
  questions that depend on it wait.

Read what this step names, and stop there. The repo at large is not a source of scope.

Done when every related Issue has been read and you can name what you scanned for.

## 3. Gate on status

`/issue-pull <id> --print` reports whether a status closes an Issue. Status names are per-list, so
take that verdict rather than reading the name — here and everywhere below.

- **Closed** — the Issue is built. Say so, and refine it only if the user asks for the built Issue to
  change. Otherwise offer a new Issue.
- **Open, with ✅ items already in the checklist** — work is under way. Warn that refining mid-flight
  can invalidate work already done, and confirm before going on.

## 4. Analyse

Read-only. Bring findings and open questions, not homework.

- **Readiness** — could someone build this without inventing a spec? Name what is undecided:
  approach, scope, data shape, the files it touches.
- **The simpler solution** — look for it, and propose it. A refined Issue that quietly doubles the
  work is a worse Issue, however specific it is.
- **The seam** — where is this proven? Prefer a seam the codebase already has, and the highest one
  that covers the behaviour. An Issue whose only honest check is "look at it" is not a defect: say so
  now, because finding it out after the build costs more.
- **Dependencies** — take `blocked_by` and `blocks` off the frontmatter and resolve every id to a
  status with `/issue-pull <id> --print`. Report each one: an open `blocked_by` means the build waits,
  and
  every `blocks` entry is an Issue whose plan rests on this one. A closed `blocked_by` blocks
  nothing — say so in one line and move on.
- **Order** — work this Issue assumes already exists with no `blocked_by` recording it. Name the Issue
  it rests on, by id and status, and say the edge is added in the ClickUp UI.
- **Conflicts** — among the Issues read in step 2: two Issues changing the same file or identifier,
  a contradiction with something already built, duplicated work.
- **Size** — could one agent build this in one pass, in twelve steps or fewer? If not, that is the
  finding, and the checklist waits until the Issue is split.
- **Doubts** — anything you would otherwise settle by assuming.

## 5. Ask

Ask in rounds. Each round is the questions whose answers do not depend on another question still
open — a question that does belongs to the next round, not this one.

Number each question. Give it a topic, then the question, then the answer you would pick:

```
1. **<topic — three or four words>**
   <the question, one idea, plain words>
   I would <answer>, because <one line>.
```

Then wait. Write nothing until the answers are in.

**The question carries the context.** The user has not read what you just read. A question that only
makes sense with the Issue file open is a question you have to re-ask — so the topic line says what
this is about before the question asks anything.

**One idea per question.** A question holding an "and" is two questions. Split it and number both.

**Plain words** are ASD-STE100 Simplified Technical English: active voice, present tense, one idea
per sentence, one clause where two would do, and the same word for the same thing every time. Use the
project's terms from `CONTEXT.md`. A term that is in neither `CONTEXT.md` nor the Issue gets a
four-word gloss the first time you use it.

The test: read the round back with the Issue file closed. Anything you cannot answer from the page is
not ready to send.

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

**Write for a human in a hurry.** Use the same **plain words** step 5 asked in. Short beats
complete — a section nobody finishes is a section nobody read.

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
not fit on one line is two steps.

The checklist is the sequence. The reasoning is in `## Specification`.

**Ticks survive.** A `- ✅ ` line records work that happened and code that exists. Carry it through
untouched and place new steps around it. Where the new plan makes a ticked line wrong, say so in the
report — deleting the audit record is not this Skill's call.

### Out of scope

A line moved out of scope disappears from the plan, so give every item a home. Per item:

1. Search the Issues read in step 2 for one that already covers it. Found: name it by id in
   `## Out of Scope` — "covered by XP-1560" is a home.
2. Not found: offer a slice. Read [`SLICES.md`](SLICES.md).
3. The user declines, or the item is not worth an Issue: leave it in `## Out of Scope` and say it has
   no home yet.

The user places these. `/issue-new` is their command to run.

## 7. Report

The file path, and the line count against the ceiling. A table of the sections written. Every Draft
you wrote, by path. Every open `blocked_by` and every `blocks`, by id and status. Then, and only
where there is something to say: conflicts by id, ordering findings, a ticked line the new plan
contradicts, the questions left unanswered, and what you scanned for.

That list is the whole report: no account of what the Skill did, and no summary of the Issue back to
the person who just answered questions about it.

Close with `/issue-push <id>`. Nothing was built and nothing was sent, so no status changes here.

## Done when

The Issue file holds a Specification you could hand to a stranger, a checklist of twelve steps or
fewer, a home for every out-of-scope item, and 85 lines or fewer in total. Every `blocked_by` and
`blocks` entry is resolved to a status and reported. Every slice the user agreed to is a Draft on
disk, named in the report. Or the report names which of those the Issue cannot yet satisfy, and why.
