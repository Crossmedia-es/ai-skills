---
name: issue-new
description: Raise a Draft in ClickUp and rename its file with the assigned id. Takes titles or paths, several at once.
disable-model-invocation: false 
---

# issue-new

Give a **Draft** an id. This is the only Skill that creates an Issue in ClickUp.

Read `.issue/clickup.md`, this project's copy of the ClickUp contract. That file and this one are the
whole brief — read no third. Missing, say `/issue-setup` and stop.

## Input

Several arguments. Classify each one, then act on it.

| Argument | Is |
| --- | --- |
| Ends `.md`, or holds `/` | A path. Start at step 2. |
| Anything else | A title. Its slug matches a **Draft** on disk: raise that one. No match: write one at step 1. |
| Nothing given | Nothing to raise. List the Drafts in `docs/issues/` and stop. |

Then, per file:

| The file | Do |
| --- | --- |
| Carries no `id` | Raise it. |
| Carries an `id` | Skip it. Say `/issue-push <id>`. |
| Does not exist | Skip it. Print the path. |

One failure never stops the rest.

## Steps

1. **A title with no Draft to match.** Copy the block between the `template` markers in
   `docs/issues/TEMPLATE.md` to `docs/issues/<slug>.md`. Write the title into the frontmatter. Leave
   every section empty.
2. Read the file's frontmatter and every `##` section.
3. Write the sections to a temp file outside the repo, in the file's own order. Skip a section whose
   body is empty.
4. Run `cup create --list <list_id> --name "<title>" --assignee <assignee_id> --description-file
   <tmp>`. Add `--parent <id>` only where the frontmatter carries one. Pass no `--status`. Delete
   `<tmp>`.
5. Run `cup task <newId> --json`. Write `id`, `custom_id`, `url`, `status` and `date_updated` into
   the frontmatter.
6. Rename the file to `docs/issues/<id>-<slug>.md` — `custom_id` where ClickUp assigned one, the
   native id otherwise, and the title lowercased and hyphenated.
7. Run `cup link <newId> <other>` for each id the frontmatter's `linked` carries.
8. Refresh the parent's Issue file once at the end, where any file named a parent.

## Limits

- Take the title from frontmatter `title`. Blank, use the filename. Nothing else supplies a title.
- Take the parent from frontmatter `parent`. Blank means top-level. Never pick one.
- Take the references from frontmatter `linked`. Add each one. Remove none.
- Send the sections as the file holds them. `/issue-refine <id>` writes content; this Skill does not.

## Output

One table — argument, id, new path — then the failures. Nothing else.

## Done when

Every argument has an Issue in ClickUp; every file carries the assigned id and is named to match; and
every `parent` and `linked` the Draft carried is a relation on the board.
