---
name: issue-push
description: Send existing Issue files up to ClickUp as the Issue's description. Takes several ids at once, writes no other field, and stops on someone else's edit.
disable-model-invocation: true
metadata:
  internal: true
---

# issue-push

Send an **Issue file**'s `##` sections to ClickUp as the Issue's description. Write no other field:
the one flag this Skill passes is `--description-file`.

Read [`../issue/CLICKUP-CLI.md`](../issue/CLICKUP-CLI.md). Read nothing else — no ADR, no source
file, no other Skill. Where the `issue` Skill is missing, say so and stop.

## Input

Several ids. `/issue-push 154 155 XP-1554` is one run.

| Argument | Do |
| --- | --- |
| An id with a file in `docs/issues/` | Push it. |
| An id with no such file | Skip it. Print the id. |
| A path with no `id` in its frontmatter | Skip it. Say `/issue-new <path>`. |
| Nothing given | List `docs/issues/`. Stop. |

One failure never stops the rest.

## Steps

Per id:

1. Read the file's frontmatter and every `##` section.
2. Run `cup task <id> --json`. Compare `date_updated` with the frontmatter's. Newer means someone
   edited the Issue in ClickUp: show what differs and ask. Read the answer before step 3 — batched
   into one command, the guard reports an edit the update has already overwritten.
3. Write the sections to a temp file outside the repo, in the file's own order. Skip a section whose
   body is empty. Run `cup update <id> --description-file <tmp>`. Delete `<tmp>`.
4. Run `cup task <id> --json` again. Write `date_updated` and `status` into the frontmatter.

## Limits

- Send the description. Where `status`, title, `type`, `parent` or relations differ from step 2, say
  so and change neither side.
- Update an Issue that exists. Creating one is `/issue-new`.

## Output

One table — id, path, sent or skipped — then the failures, then one line naming each pushed file as
safe to delete.

## Done when

ClickUp holds every section of every file pushed, in the file's order; each file's `date_updated`
matches its Issue's; and no field but the description was written.
