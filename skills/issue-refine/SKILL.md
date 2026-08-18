---
name: issue-refine
description: Interview the user about one issue, then write its spec and its implementation checklist — the steps an agent builds from. Refines only; never implements, never pushes.
disable-model-invocation: true
metadata:
  internal: true
---

# issue-refine

`/issue-refine <id>` turns one **Issue** into an Issue file someone else could build from without
inventing a spec: a `## Description` that decides the approach, and an **Implementation checklist**
of steps short enough to follow and specific enough to be wrong.

Most Issues arrive as a title and nothing else. That is normal, and it is why this skill asks
questions before it writes any.

**Document only.** Write no project code, run no build, change no code. The only file this skill
changes is the target's Issue file.

This skill knows nothing about the tracker. Fetching, writing and pushing Issue files is the `issue`
skill's job — call `/issue read`, `/issue get` and `/issue push` rather than any tracker command, and
where `issue` is not installed, say so and stop. `docs/adr/0002-the-issue-file-belongs-to-the-tracker.md`
records why the line sits there.

## Output

The questions, then the file, then the findings. No account of what the skill did, no summary of the
Issue back to the person who just answered questions about it. A round is numbered questions and
nothing else; the closing report is the file path, a table of the sections written, and the findings
that need a decision.

## Not this skill's work

Each of these is a finding with a command attached, never an action taken here:

| Found | Say |
| --- | --- |
| The Issue is too big for one build | Name the slices you would cut. `/issue add --parent <id>` raises them. |
| A sibling Issue conflicts | Name it by id. `/issue-refine <other-id>` fixes it there. |
| A term belongs in the glossary, or a decision in an ADR | Name it. Writing it is the user's call. |
| The refined Issue is ready to leave the laptop | `/issue push <id>` |

Never edit another Issue's file. The other Issue may be the correct one, and this skill only heard
one side.

## 1. Resolve the Issue

One Issue per run. Refinement is a conversation, and five at once is five interleaved conversations
whose answers contaminate each other. A parent whose subtasks all need refining is that many runs.

- **No id given** — stop. An Issue exists in the tracker before it exists here, so say
  `/issue add "<title>"` first, then refine the id it returns. Do not guess at an Issue from the
  branch name.
- **No Issue file for that id** — run `/issue get <id>` and refine the file it writes.

## 2. Read before asking

Never ask what a document already answers. Read:

- The Issue file whole, and every related Issue — `parent`, `subtasks`, `blocked_by`, `blocks`. One
  already in `docs/issues/` is read from disk; the rest come from `/issue read <id>`, which prints
  without leaving a file behind.
- `CONTEXT.md` for the project's vocabulary, and `RULES.md` for how work is done here. The Issue is
  written in the project's language or it is written wrong.
- The code the Issue touches. Dispatch this as background exploration and carry on — only the
  questions that depend on it wait.

Report what you scanned for at the end, so a gap is visible rather than silent.

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
- **Size** — could one agent build this in one pass? If not, that is the finding, and the checklist
  waits until the Issue is split.
- **Doubts** — anything you would otherwise settle by assuming.

## 5. Ask

Ask in rounds. Each round is the questions whose answers do not depend on another question still
open — a question that does belongs to the next round, not this one.

Number each question, state it in one line, and give the answer you would pick:

```
1. <question> — I would <recommended answer>, because <one line>.
```

Then wait. Do not write anything until the answers are in.

Stop asking when the next round would only confirm detail you can settle yourself. An Issue that is
already clear takes no rounds at all: say it is ready and go to step 6. Never manufacture a question
to look thorough.

## 6. Write

Once, at the end, from everything heard. Write the sections
[the Issue template](../issue/templates/issue.md) defines, and no others — the template decides what
an Issue file holds, and adding a section is a change to the `issue` skill.

| Section | Holds |
| --- | --- |
| `## Description` | The problem, the solution, and the decisions taken. Name modules and behaviour; no file paths — this section outlives the build and a path goes stale first. |
| `## Testing Decisions` | The seam from step 4, what passing there proves, and prior art for the test. Or, plainly, that no automated check settles it. |
| `## Out of Scope` | What this Issue does not cover. This is what stops a build sprawling. |
| `## Implementation` | The checklist. Unticked steps, in build order. |

A section with nothing true to say in it is left out, not left empty.

**The checklist.** One `- ⬜ ` line per step, imperative, naming the file or symbol it touches —
`- ⬜ Add read mode to skills/issue/SKILL.md, printing instead of writing`. Paths belong here,
because this is a build order consumed within days by an agent that needs to know where to type. A
step that will not fit on one line is two steps; and a wrapped line is mangled by the tracker anyway.

The checklist is the sequence, not the argument. The reasoning is in `## Description`.

**Ticks survive.** A `- ✅ ` line records work that happened and code that exists. Carry it through
untouched, and place new steps around it. Where the new plan makes a ticked line wrong, say so in the
report — deleting the audit record is not this skill's call.

**Nothing is overwritten silently.** Where a section already holds text, show what changes and
confirm before writing. Someone wrote it, and what they wrote is evidence about what they meant.

**Out-of-scope items are yours to place.** Show each one and ask: does it stay out of scope, or does
it become its own Issue? Never decide that alone — a line moved out of scope disappears from the plan.

## 7. Report

The file path. A table of the sections written. Then, and only where there is something to say:
conflicts by id, ordering findings, an Issue too big with the slices you would cut, a ticked line the
new plan contradicts, the questions left unanswered, and what you scanned for.

Close with `/issue push <id>`. Nothing was built and nothing was sent, so no status changes here.
