---
name: issue
description: The ClickUp Issue family — which Skill does what, plus the shared contract they all read. Prints one Issue to the terminal with `read`.
disable-model-invocation: true
---

# issue

An **Issue** is one work item, tracked in ClickUp. Its local copy is an **Issue file** under
`docs/issues/`. ClickUp's API calls an Issue a task, which is why every command reads `cup task …`.

An Issue file is disposable. ClickUp holds the record — description, **Implementation checklist**,
status — so a finished Issue file is deleted, and `/issue-pull` builds the same file again whenever
the work reopens.

## The family

One job each. The four that call `cup` — setup, new, pull, push — read
[`CLICKUP-CLI.md`](CLICKUP-CLI.md) before their first step. `/issue-done` reads it too, since it
pushes. `/issue-refine` and `/issue-verify` touch no tracker and need none of it.

| Skill | Job |
| --- | --- |
| `/issue-setup` | Write `docs/issues/TEMPLATE.md`, which holds the `list_id` and the Issue file's shape. |
| `/issue-new <title\|file>…` | Raise a Draft in ClickUp, then rename its file with the id ClickUp assigns. |
| `/issue-pull [id]…` | Download. Writes the Issue file for an Issue that has none, refreshes one that has. |
| `/issue-push <id>…` | Upload. Sends an existing Issue file's description to an existing Issue. |
| `/issue-refine <id>` | Interview the user, then write the Issue file's spec and checklist. Talks to no tracker. |
| `/issue-verify <id>` | Check the Issue was built completely and as described. Reports; builds nothing. |
| `/issue-done <id>` | Push, move the status, delete the file. The only Skill that writes a status. |

Nothing else creates an Issue in ClickUp. `/issue-new` is the only one, which is why `/issue-push`
refuses a file with no id and `/issue-pull` refuses to invent one. Nothing else moves a status:
`/issue-done` is the only one, and only to a status the user named in that run.

## read

`/issue read <id>` fetches one Issue and writes nothing — for a question about an Issue this project
has no reason to keep on disk, and for a Skill that needs one fact rather than a file.

Given no id, say so and stop. Never resolve one from the branch.

1. Run `cup task <id> --json`. Read `markdown_description` and the `Task Type` custom field. Write no
   file.
2. Report the status name **and whether it closes an Issue**, reading `status.type`. A caller asking
   "is this built?" cannot answer it from a status name, since the names are per-list.
3. Print the frontmatter fields as a table, then the description as it came.

Where an Issue file for this id already exists, say so, print from ClickUp anyway, and leave the file
alone. Resolving a difference is `/issue-pull`'s job.

Done when the Issue is on screen and `docs/issues/` is unchanged.
