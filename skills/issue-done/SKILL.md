---
name: issue-done
description: Finish one Issue — push its description, move its status, delete the local file. Confirms before each of the three, and stops on a drift.
disable-model-invocation: true
---

# issue-done

Close the loop on one **Issue**: send the file up, move the board, delete the file.

Read `.issue/clickup.md`, this project's copy of the ClickUp contract. That file and this one are the
whole brief — read no third. Missing, say `/issue-setup` and stop.

**This is the one Skill that writes a status.** Everywhere else the board is ClickUp's, changed in
the UI. Here it moves because the user answered a question naming the status they want, in the run
they started. It never moves on an inference.

## Input

One id per run. Finishing is three irreversible acts on one Issue, and a batch hides which one failed.

| Argument | Do |
| --- | --- |
| An id with a file in `docs/issues/` | Run the three steps. |
| An id with no such file | Stop. Nothing to push and nothing to delete. |
| Several ids | Stop. Name them and say one run each. |
| Nothing given | List `docs/issues/`. Stop. |

## Steps

Each step ends in an answer from the user. Read it before starting the next one.

1. **Check the checklist.** Count the `- ⬜ ` items. One or more: say how many, name them, and say
   `/issue-implement <id>` builds them or `/issue-verify <id>` judges what is there. Confirm before
   going on — an Issue closed over pending steps is a lie the board keeps telling.
2. **Push.** Run `/issue-push <id>` and let it do the work. A **drift** stops this run: resolve it
   there and start again. Confirm ClickUp holds the description before step 3.
3. **Move the status.** Run `cup tasks --list <list_id> --all --json` and collect the distinct
   `status` values. Offer them, marking which read as review and which as closed, plus
   **leave it alone**. On an answer, run
   `cup update <id> --status "<name>"`, then `cup task <id> --json` and report the status ClickUp
   actually holds. A fuzzy match can land somewhere other than the name you passed.
4. **Delete the file.** Show the path and confirm. On yes, delete it. On no, say the file stays and
   why that is fine — ClickUp holds the record, so the file is a copy either way.

## Limits

- Move the status the user named. Never infer one from the checklist, the branch or the diff.
- Delete after ClickUp holds the description, never before.
- Push, move and delete this Issue. A parent's status is the parent's own run.

## Output

Four lines, one per step: items pending, description sent, status before → after, file deleted or
kept. Then the failures.

## Done when

ClickUp holds the file's description; the status is the one the user named, confirmed by a fetch, or
unchanged because they said so; and the Issue file is deleted or kept by their answer.
