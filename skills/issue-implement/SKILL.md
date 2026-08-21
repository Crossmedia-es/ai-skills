---
name: issue-implement
description: Build one Issue from its Implementation checklist, ticking each step as the code lands, then report what shipped and how to check it by hand.
disable-model-invocation: true
---

# issue-implement

`/issue-implement <id>` builds the plan `/issue-refine` wrote. The **Implementation checklist** is the
build order, and this Skill works down it.

Two things change: the project's code, and the target Issue file's `## Implementation`. Leave the work
in the working tree — committing is the user's call.

This Skill touches no tracker and calls no `cup`.

## Not this Skill's work

Each of these is a finding with a command attached, never an action taken here:

| Found | Say |
| --- | --- |
| The Issue carries no plan | `/issue-refine <id>` writes one. This Skill only builds one. |
| A step is wrong or impossible | Name it, and stop at it. The plan changes in `/issue-refine <id>`. |
| Work the checklist does not name | Name it. `/issue-refine <id>` adds it, or `/issue-new` slices it out. |
| The build is finished | `/issue-verify <id>` judges it; `/issue-done <id>` closes it. |
| ClickUp should hold the ticks | `/issue-push <id>` |

## 1. Resolve the Issue

One Issue per run. A parent whose subtasks all need building is that many runs.

- **No id given** — stop, and say which Issue you need. Never guess one from the branch name.
- **No Issue file for that id** — run `/issue-pull <id>` and build from the file it writes.

## 2. Gate on the plan

Read the Issue file whole. The checklist is only a build order where the Specification says what the
build is for.

| The file | Do |
| --- | --- |
| No `## Specification`, or no `## Implementation` | Stop. Say `/issue-refine <id>`. |
| Every step already `- ✅ ` | Stop. Say so, and offer `/issue-verify <id>`. |
| Some steps `- ✅ ` | Build the rest. Trust no tick — read the code each one claims. |

## 3. Read before building

- `CONTEXT.md` for the project's vocabulary, and `RULES.md` for how work is done here. Where the repo
  holds more than one `CONTEXT.md`, follow `CONTEXT-MAP.md` to the one covering this Issue.
- `## Testing Decisions` for the **seam** the Issue chose, and the code around it.
- The files and symbols the checklist names.

Done when you can say, per step, which file you will change.

## 4. Build

Where `/implement` is installed, hand it one step at a time and let it work. Where it is not, build
each step yourself.

**One step at a time, in the checklist's order.** A step is done when the code that satisfies it
exists and the project still builds. Then tick it — `- ⬜ ` becomes `- ✅ `, and nothing else on the
line changes.

**The smallest change that satisfies the step.** Satisfied, not served well. Leave out the
abstraction the step does not name, the option nobody asked for, and the error path the Specification
does not describe. Where you want one anyway, it is a finding for step 5, not a line of code.

**Change the code that is there.** Match the file's own naming, structure and comment density. A file
restructured on the way past is a change the plan does not hold, however much better it reads.

**Test at the seam `## Testing Decisions` chose, and nowhere else.** Tests underneath it are work the
Issue never agreed to.

**A tick is a claim `/issue-verify` will test.** So tick a step whose code you can point at. A step
that looks handled, or that another step covered in passing, gets read before it gets ticked.

**`## Out of Scope` is a boundary.** Build what the checklist names. A change the build genuinely
needs and the checklist does not name is a finding for step 5, and the build stops there rather than
growing past its plan.

Done when every `- ⬜ ` step is ticked, or named in the report as not built with the reason.

## 5. Report

Two halves: what happened, then what the user runs.

**What shipped.** One row per step — the step, its verdict, and the file and symbol that satisfies it.

| Verdict | Means |
| --- | --- |
| **Built** | The code exists, and the step is ticked. |
| **Partial** | Some of it exists. Name the missing part. The step stays unticked. |
| **Not built** | Name why, and what would unblock it. The step stays unticked. |

Then the code you wanted to write and did not: the abstraction, the option, the extra test. One line
each. That list is `/issue-refine`'s next input, and it is the only place restraint is visible.

Then the check named in `## Testing Decisions`: the command, and the output it actually gave.

**The hand-check.** The commands the user runs to watch this work, in the order they run them. Per
line: the command, then what they should see.

```
pnpm dev, then open /settings — the new toggle sits under Notifications
```

Take these from the behaviour the Issue describes, not from the code you wrote. Where a step can only
be checked by reading a file, say that and name the file — an honest "no command proves this" beats a
command that proves nothing.

Close with the findings, then `/issue-verify <id>`.

## Done when

Every step carries a tick backed by a named file and symbol, or a stated reason it is not built. No
file holds code no step asked for. The
check in `## Testing Decisions` has been run and its real output reported. Every behaviour the
Specification describes has a hand-check, or a stated reason it has none.
