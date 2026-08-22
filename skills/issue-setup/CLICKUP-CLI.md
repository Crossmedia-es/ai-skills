# The ClickUp contract

What `cup` and ClickUp do that `--help` does not say. The binary is `cup`, from
[`@krodak/clickup-cli`](https://github.com/krodak/clickup-cli).

This file has two homes. It ships inside `/issue-setup`, which copies it to `.issue/clickup.md` in the
project it sets up. Every other Skill that calls `cup` reads that project copy before its first step,
and re-running `/issue-setup` is how the copy catches up with a newer Skill.

## JSON

`cup` prints Markdown when piped and a picker in a terminal, so always pass `--json`. Two shapes come
back:

- `cup task <id>` — the **raw task**: `custom_id`, `markdown_description`, `custom_fields`,
  `dependencies`, `linked_tasks`, `date_updated`, and `status` as an object.
- `cup tasks`, `cup search`, `cup subtasks` — a **flat row**: `id`, `name`, `status` as a string,
  `task_type`, `parent`, `list`, `url`. No `custom_id`, no description.

Read a description from `markdown_description`. `description` and `text_content` have stripped the
checkboxes and link URLs out.

## Writing

`cup update` and `cup create` write the fields their flags name and nothing else, so
`--description-file` alone changes the description alone. Always the file, never `--description`: an
argument is at the shell's mercy.

## Config

`docs/issues/TEMPLATE.md` is this project's ClickUp config and the **Issue file**'s shape at once. Its
frontmatter holds `space_id`, `list_id` and `assignee_id`, its `template` markers wrap the file
shape, and it names the `##` sections — adding one is a change to that file. `/issue-setup` writes it,
and it is committed: not one of the three ids is a secret.

`cup` never reads it. Take `list_id` from it and pass `--list`; take `assignee_id` and pass
`--assignee`; take `space_id` where a command wants a space, as `cup lists <spaceId>` does. A space is
never re-picked from `cup spaces` while the file holds one.

`cup auth --json` returns the signed-in user's id as `user.id`, and `cup members --json` lists the
rest, for a project filed under someone else.

The token is the CLI's own, in `~/.config/cup/config.json`. So is the workspace:
`cup config get teamId`.

## Ids

`XP-1557` is a custom id and `869ejp1uk` a native one. `cup` takes either anywhere an id is taken,
`--parent` included, with no flag to say which. It does not read the git branch: every id is given,
never guessed.

## Who owns what

| Field | Owner |
| --- | --- |
| title, `type`, `parent`, relations | ClickUp. Reported here, changed in the UI. |
| `status` | ClickUp, with one exception: `/issue-done` moves it to a status the user named in that run. |
| the description | The Issue file. `/issue-push` sends it. |

`cup update` will set a title and a parent too, and no Skill here passes those flags. A status pushed
from a file is a status moved by whoever last ran a command — which is why the one exception asks
first and reports the status ClickUp ended up with.

Two acts have exactly one door each. `/issue-new` is the only Skill that creates an Issue, which is
why `/issue-push` refuses a file with no id and `/issue-pull` refuses to invent one. `/issue-done` is
the only Skill that moves a status, and only to one the user named in that run.

ClickUp stores **one** description per Issue, and an Issue file's `##` sections in the file's own
order are that description. There is no per-section API and no split to maintain.

## Comparing

ClickUp stores rich text and renders markdown back, so what comes down is not what went up. Bullet
markers change, underscores become `\_`, and a bare filename becomes `[CONTEXT.md](http://CONTEXT.md)`
— write `docs/CONTEXT.md` and it stays text.

Normalise both sides — bullets, escapes, autolinks — before calling a difference real. Byte equality
reports a change after every push.

## Statuses

`--status` is matched exactly and never validated. `--status "in prog"` against a list holding
`in progress` returns nothing and exits 0 — the same answer as a status holding no Issues.

So a filter returning nothing is not an empty status. Run the listing again with no `--status`,
collect the distinct `status` values off the rows, and print those: that names the typo, or proves the
status empty. Nothing else enumerates a list's statuses.

Whether a status *closes* an Issue is `status.type` on the raw task — `done` or `closed`, against
`open` or `custom`. Never read the name; the names are per-list.

## Relations

Each entry is a quoted markdown link to the related Issue file, then its title and status:

```yaml
parent: "[XP-1558](XP-1558-ai-skills-tools.md) - AI Skills tools @open"
subtasks:
  - "[XP-1559](XP-1559-project-rules-command.md) - Project rules command @in progress"
  - "XP-1560 - Refine command @open"
```

**Quote every entry.** Unquoted, a leading `[` opens a YAML flow sequence and the frontmatter stops
parsing.

Link the path relative to `docs/issues/`, so it resolves from the Issue file's own directory. Where
the related Issue has no file on disk, write the bare id — a link to a missing file opens nothing.
`/issue-pull <id>` creates it, and the next pull links it.

Use the `custom_id` where the related Issue has one. Titles and statuses cost one `cup task` each, so
read them from `docs/issues/` where that Issue is already downloaded, and fetch only the rest.

A dependency holds ids alone — `{task_id, depends_on, type}` — so take the direction from the ids
rather than the `type`. `task_id` is this Issue: `depends_on` goes under `blocked_by`. `depends_on` is
this Issue: `task_id` goes under `blocks`.

`linked` is the plain reference — ClickUp's `linked_tasks`, written with `cup link <id> <other>`. It
carries no order and no ownership.

**Add, never remove.** `/issue-new` runs `cup link` for each entry a Draft's `linked` carries, and
`--parent` for a `parent`. Nothing else writes a relation: `cup depend`, `cup link --remove` and every
edit to an existing edge stay unused, because a dependency is one edge shared by two Issues and a
half-applied graph edit is worse than none. Adding an edge destroys nothing, which is why that one is
allowed.

## The Implementation checklist

`- ✅ done thing` and `- ⬜ pending thing`, one short line each. ClickUp orphans a wrapped bullet from
its marker, and renders `- [x]` struck through.
