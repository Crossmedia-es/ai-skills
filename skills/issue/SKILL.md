---
name: issue
description: Work a ClickUp issue from a local markdown file — download one, list mine, push edits back. Modes — get, me, push, setup.
disable-model-invocation: true
metadata:
  internal: true
---

# issue

An **Issue** is one work item. Its local copy is an **Issue file** under `docs/issues/`. ClickUp's API
calls an Issue a task, which is why every command here reads `clickup-cli task …`.

An Issue file is disposable. ClickUp holds the record — description, implementation, status — so a
finished Issue file is deleted, and `get` builds the same file again whenever the work reopens. Every
Issue exists in ClickUp first: `add` raises it there and takes the id back, so an Issue file never
carries work ClickUp has no record of.

`clickup-cli --help` documents the commands. What follows is what it does not say.

## Output

Print the file path, then one table of what the Issue holds. Nothing else — no account of what the
skill did, no remarks on fields that came back empty, no explanation of a decision this file already
made. A blank `type` and an empty `## Description` are ordinary. Speak outside the table for a
question, a drift, or a failure.

## Project config

`.clickup.toml` at the repo root holds the ids:

```toml
[defaults]
workspace_id = "..."
list_id = "..."
```

`workspace_id` is the CLI's own key, read with no flag. `list_id` is this skill's — the CLI always
wants `--list` on the command line, so read `list_id` from here and pass it. Keep the token out of
this file; it lives in the CLI's own config, written once by `clickup-cli setup`.

## Ids

`XP-1557` — letters, dash, digits — is a custom id, and a `task` command needs `--custom-task-id` to
accept it. `869ejp1uk` is a native id and takes no flag. Given no id, the CLI resolves one from the
current git branch.

## Modes

Given no mode, list these and stop.

| Mode | Does |
| --- | --- |
| `setup` | Write `.clickup.toml` and `docs/issues/TEMPLATE.md`. |
| `add <title> [--parent id]` | Raise a new Issue in ClickUp and write its Issue file. |
| `get [id] [--with-subtasks]` | Download one Issue into an Issue file. |
| `me` | List my open Issues in this project's list, and download the ones I pick. |
| `push [id]` | Send an Issue file's status, description and implementation to ClickUp. |

## The Issue file

The title lives in the frontmatter and nowhere else — no heading repeats it, since the filename, the
drift check and every diff read the frontmatter.

Frontmatter carries every key in [`templates/issue.md`](templates/issue.md), filled or left blank —
`type` blank where the list has no `Task Type` field or the Issue leaves it unset, `parent` blank on a
top-level Issue, the three relation keys empty where the Issue has no such relation.

Two sections, both sent to ClickUp as the Issue's description, in this order:

- `## Description` — the spec, written by whoever raised the Issue.
- `## Implementation` — a checklist of the work, written and ticked off by whichever skill implements
  the Issue. It is the audit record, which is why it goes to ClickUp rather than staying local.

### Implementation format

```md
- ✅ get --with-subtasks verified on XP-1558
- ⬜ setup run end to end
```

One item per line, done or pending, and each line short enough to stay one line. ClickUp renders a
wrapped list item as a loose paragraph of its own, orphaned from its bullet, and renders a ticked
`- [x]` struck through until the record it exists to preserve is the hardest part to read.

## What ClickUp rewrites

A pushed description comes back changed, every time. ClickUp turns `- ` bullets into `*   `, escapes
underscores as `\_`, and turns a bare filename into a link — `CONTEXT.md` becomes
`[CONTEXT.md](http://CONTEXT.md)`. Name a file by its path, `docs/CONTEXT.md`, and it stays text.

So compare descriptions on their meaning, not their bytes: normalise both sides — bullet markers,
backslash escapes, autolinks — before deciding that `get` has found a real difference. Byte equality
would report a change after every single push.

## Relations

Every relation line reads `<id> - <title> @<status>`, using the `custom_id` where the related Issue
has one. Titles and statuses cost one `task get` each, so read them from the Issue file in
`docs/issues/` where that Issue is already downloaded, and fetch only the rest.

A dependency object holds ids alone — `{task_id, depends_on, type}` — so take the direction from the
ids rather than the `type`: an entry whose `task_id` is this Issue puts its `depends_on` under
`blocked_by`, and an entry whose `depends_on` is this Issue puts its `task_id` under `blocks`.

Relations are read-only. `push` reports a difference and changes nothing — dependencies are a graph,
and a half-applied graph edit is worse than none.

## setup

1. `clickup-cli agent-config init`, which writes `.clickup.toml` with every key commented out.
2. Set `workspace_id` from `clickup-cli status`.
3. Find the list with `clickup-cli space list`, then `clickup-cli list list --space <id>` — passing
   `--folder <id>` from `clickup-cli folder list --space <id>` where the lists sit in folders. Ask
   which list this project files its Issues in, and write it as `list_id`.
4. Copy [`templates/issue.md`](templates/issue.md) to `docs/issues/TEMPLATE.md`, leaving an existing
   file alone.
5. Print the workspace, space and list names you resolved.

Done when `.clickup.toml` holds a `workspace_id` and a `list_id` and no token, and
`docs/issues/TEMPLATE.md` exists.

## add

1. `clickup-cli task create --list <list_id> --name "<title>" --assignee <my id>`, adding
   `--parent <native id>` where a parent was named — the API takes the native id there, so resolve a
   custom id with `task get <id> --custom-task-id` first. Pass no `--status`: the list's own default
   applies.
2. Run `get` on the id that came back, so the Issue file is written by the same path as any other.
   `## Description` and `## Implementation` start empty; fill them in the file and `push`.
3. Where a parent was named, refresh that parent's Issue file too, so its `subtasks` list carries the
   new Issue.

Done when the Issue exists in ClickUp and its Issue file holds the id ClickUp assigned.

## get

1. `clickup-cli task get <id> --markdown --output json`. Read `markdown_description`: the flattened
   `description` and `text_content` fields drop inline link URLs.
2. Split that description on its `## Implementation` heading — above it is `## Description`, below it
   is `## Implementation`. No such heading means the whole description is the spec.
3. Read the `Task Type` custom field out of `custom_fields` by name, since its id is a per-list uuid.
   Match its `value` against its own `type_config.options` and take that option's `name`.
4. Name the file `docs/issues/<id>-<slug>.md`, where `<id>` is the `custom_id` when the Issue has one
   and the native id otherwise, and `<slug>` is the title lowercased and hyphenated. An existing file
   whose name starts `<id>-` is this same Issue: rewrite that file, renaming it where the title
   changed, so one Issue never has two files.
5. Fill `docs/issues/TEMPLATE.md`, or [`templates/issue.md`](templates/issue.md) where the project has
   no template of its own.
6. Rewriting an existing file, show any difference in `## Description` or `## Implementation` and ask
   before overwriting. Identical, refresh silently.

`--with-subtasks` adds one step: read the `subtasks` array from `clickup-cli task get <id> --subtasks
--output json`, take the ids alone, and run `get` on each so every subtask lands as an Issue file of
its own, flat in `docs/issues/`, carrying `parent`. One level down — a subtask's own subtasks come
with `get <subtask> --with-subtasks`.

Done when the file holds the fetched description and implementation, its `date_updated` matches what
ClickUp just returned, and every subtask asked for has its own file.

## me

1. `clickup-cli auth whoami --output json` for my user id.
2. `clickup-cli task list --list <list_id> --assignee <my id> --output json`. Closed Issues are out by
   default, so leave `--include-closed` off.
3. Print a numbered table — number, id, status, type, title.
4. Ask which numbers to download, `all` for every one, then run `get` on each.

`task list` and `task search` cannot filter subtasks in, so `me` lists top-level Issues only. Reach a
subtask through `get <parent> --with-subtasks`.

Done when every Issue the user named has an Issue file.

## push

Status first, description second, so a status ClickUp rejects costs nothing.

1. Read the Issue file's frontmatter, `## Description` and `## Implementation`.
2. `clickup-cli task get <id> --markdown --output json`, and compare its `date_updated` with the
   frontmatter's. A changed value means someone edited the Issue in ClickUp since the download: show
   what differs and ask before going on. Read this answer before running any later step — batched
   into one command, the guard reports a drift the update has already overwritten.
3. Compare the fetched `name` and status against the frontmatter's too. ClickUp leaves `date_updated`
   untouched when either changes, so the timestamp alone misses a rename or a status someone moved in
   the web UI. Adopt the fetched title, renaming the file to match, and ask before pushing a status
   that would move the Issue backwards.
3. `clickup-cli list get <list_id> --output json` lists the statuses this list accepts as
   `statuses[].status`. Match the frontmatter's `status` against them case-insensitively. No match,
   stop and print the accepted names — a wrong status leaves ClickUp untouched.
4. Where the status being pushed has `type` `done` or `closed` on that list and `## Implementation`
   holds nothing, say so and ask once before going on.
5. Where the frontmatter's `type`, `parent` or relations differ from what ClickUp just returned, say
   so and leave them alone. They change in the ClickUp UI.
6. `clickup-cli task update <id> --status <status>`, then `clickup-cli task update <id> --description
   @<file>`. `<file>` is a temp file outside the repo holding the body under `## Description` — that
   heading stays behind — followed by the `## Implementation` heading and its checklist, which is the
   heading `get` splits on. `@path` makes the CLI read the description
   from it. Delete the temp file afterwards.
7. `clickup-cli task get <id> --output json` once more, write its `date_updated` into the frontmatter,
   and finish with one line naming the file as safe to delete.

Done when ClickUp shows the file's status, description and implementation, and the file's
`date_updated` matches ClickUp's.
