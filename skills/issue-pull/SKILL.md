---
name: issue-pull
description: Download Issues into Issue files — writing the file where none exists, refreshing what ClickUp owns where one does. Takes several at once, and asks before it replaces a local description.
disable-model-invocation: true
metadata:
  internal: true
---

# issue-pull

Bring ClickUp down to `docs/issues/`. Write nothing back.

Read [`../issue/CLICKUP-CLI.md`](../issue/CLICKUP-CLI.md). That file and this one are the whole
brief — read no third. Where the `issue` Skill is missing, say so and stop.

## Input

Several arguments. `/issue-pull 154 155 XP-1554` is one run, and one failure never stops the rest.

| Argument | Act on |
| --- | --- |
| An id | That Issue. |
| A path | The Issue whose id that file's frontmatter carries. |
| A path with no `id` | Skip it. Say `/issue-new <path>`. |
| An id ClickUp does not know | Skip it. Report it. Creating it is `/issue-new`. |
| Nothing given | Every Issue file already in `docs/issues/`. Write no new file. |
| `--status <name>` or `--with-subtasks` | Read [`FILTERS.md`](FILTERS.md) first. |
| An id and `--status` together | Say they ask for two different things. Stop. |

## Steps

Per Issue. Print one table at the end.

1. Run `cup task <id> --json`. Read `markdown_description` and the `Task Type` custom field — match
   the field by name, since its id is a per-list uuid, and resolve its `value` against its own
   `type_config.options`. No `value` key is a blank `type`, not a failure.
2. Name the file `docs/issues/<id>-<slug>.md` — `custom_id` where the Issue has one, the native id
   otherwise, and the title lowercased and hyphenated. An existing file whose name starts `<id>-` is
   this same Issue, whatever the rest of its name says.
3. **No file yet.** Build it from `docs/issues/TEMPLATE.md`. Write the fetched description whole,
   keeping its `##` headings and their order.
4. **A file already.** Write `status`, title, `type`, `parent`, the relations and `date_updated`.
   Rename the file where the title changed. Then check for drift.

## Drift

A **drift** is one Issue whose local description and ClickUp's disagree. Join the file's `##` sections
in the file's order — that is its description — normalise both sides as under **Comparing**, then
compare against `markdown_description`.

No drift: say nothing.

Drift: show the difference and ask.

- **Keep the local description** — change nothing. Offer `/issue-push <id>`.
- **Take ClickUp's** — replace the file's sections with what came down.

The user resolves a drift. The local side may be an afternoon of refinement; ClickUp's may be a
colleague's correction.

## Limits

- Fetch the ids named. An id comes from the argument or a file's frontmatter, never from the git
  branch.
- Write Issue files for Issues that exist. Creating an Issue is `/issue-new`.

## Output

One table — id, status before, status after, drift, path — then the failures. Nothing else.

## Done when

Every Issue named has a file; every file carries ClickUp's `status`, title, `type`, `parent`,
relations and `date_updated`; and every drift was either resolved by an answer or left by one.
