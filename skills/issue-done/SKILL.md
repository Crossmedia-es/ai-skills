---
name: issue-done
description: Finish one Issue — verify it is built, condense it for the record, push its description, move its status, delete the local file. Confirms before each act, and stops on a drift.
disable-model-invocation: true
---

# issue-done

Close the loop on one **Issue**: check it is built, cut the file down to what outlives the build,
send it up, move the board, delete the file.

Read `.issue/clickup.md`, this project's copy of the ClickUp contract. That file and this one are the
whole brief — read no third. Missing, say `/issue-setup` and stop.

**This is the one Skill that writes a status.** Everywhere else the board is ClickUp's, changed in
the UI. Here it moves because the user answered a question naming the status they want, in the run
they started. It never moves on an inference.

## Input

One id per run. Finishing is four irreversible acts on one Issue, and a batch hides which one failed.

| Argument | Do |
| --- | --- |
| An id with a file in `docs/issues/` | Run the five steps. |
| An id with no such file | Stop. Nothing to push and nothing to delete. |
| Several ids | Stop. Name them and say one run each. |
| Nothing given | List `docs/issues/`. Stop. |

## Steps

Each step ends in an answer from the user. Read it before starting the next one.

1. **Verify the build.** Run `/issue-verify <id>` and take its verdict. Counting ticks is not
   checking: a `- ✅ ` line is a claim about code, and this step is where the claim gets tested.

   | Verdict | Do |
   | --- | --- |
   | **Complete** | Say so in one line and go on. |
   | **Incomplete** | Name every Missing and Different item, then ask whether to close the Issue over them. |

   A yes closes an Issue that is not built, and the report says which items it closed over. A no ends
   the run here — the Issue stays open and no file changes. Build nothing either way: an Issue closed
   over pending steps is a lie the board keeps telling, and so is one quietly finished mid-close.
2. **Condense the Issue.** The file is about to become the board's only copy, so it keeps what
   outlives the build and drops what does not. Show every change and confirm before writing.

   | Section | Do |
   | --- | --- |
   | `## Specification` | Summarise to five lines or fewer: the problem, and what was built. |
   | `## Implementation` | Nothing at all. The ticked checklist is the record of what happened. |
   | `## Testing` | Delete it. It instructed a build that is over. |
   | `## Out of Scope` | Give every homeless item a home, below. |

   **The summary says only what the Specification already said.** Drop the detail the checklist
   carries and the decisions the build settled. Add nothing: a sentence that was not in the section
   before is a new requirement on a closed Issue. Where you cannot shorten it without losing a
   decision, say so and leave the section as it is.

   **Out of Scope, per item.** An item naming another Issue's id is already homed — leave the line
   alone. An item with no id disappears with this file, so offer one **Draft** at
   `docs/issues/<slug>.md` from `docs/issues/TEMPLATE.md`, carrying a `title`, `linked: <this id>`,
   and a Specification of five lines or fewer restating what the item said. Name the path in the
   line. Three Drafts at most. Write them and raise none — close with `/issue-new <paths>`, which is
   the user's command to run. On a no, say the item has no home and goes with the file.

3. **Push.** Run `/issue-push <id>` and let it do the work. A **drift** stops this run: resolve it
   there and start again. Confirm ClickUp holds the description before step 4.
4. **Move the status.** Run `cup tasks --list <list_id> --all --json` and collect the distinct
   `status` values. Offer them, marking which read as review and which as closed, plus
   **leave it alone**. On an answer, run
   `cup update <id> --status "<name>"`, then `cup task <id> --json` and report the status ClickUp
   actually holds. A fuzzy match can land somewhere other than the name you passed.
5. **Delete the file.** Show the path and confirm. On yes, delete it. On no, say the file stays and
   why that is fine — ClickUp holds the record, so the file is a copy either way.

## Limits

- Verify before condensing. A gap the user accepts is still a gap, and it is named in the report.
- Build nothing. This Skill writes no project code, whatever `/issue-verify` finds missing.
- Condense before pushing, never after. The board takes one description per run.
- Summarising is not refining. No new decision, no new requirement, no section the template does not
  name.
- Move the status the user named. Never infer one from the checklist, the branch or the diff.
- Delete after ClickUp holds the description, never before.
- Push, move and delete this Issue. A parent's status is the parent's own run.

## Output

Five lines, one per step: the verify verdict and any gap closed over, sections condensed with the
Specification's line count before and after, description sent, status before → after, file deleted or
kept. Then every Draft you wrote by path, every out-of-scope item left without a home, and then the
failures.

## Done when

`/issue-verify` has run and its verdict is Complete, or the user answered that the named gaps close
anyway. The description ClickUp holds carries a Specification of five lines or fewer saying nothing
new, the checklist untouched, no `## Testing`, and every out-of-scope item either naming
an Issue or named in the report as going with the file. The status is the one the user named,
confirmed by a fetch, or unchanged because they said so. The Issue file is deleted or kept by their
answer.
