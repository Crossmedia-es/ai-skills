---
name: issue-setup
description: Prepare a project for the ClickUp Issue skills — authenticate the CLI, pick the list, and write the Issue template and the ClickUp contract.
disable-model-invocation: true
---

# issue-setup

`/issue-setup` takes no argument and leaves behind two files. Given an argument, ignore it and say so.

| File | Holds | On a re-run |
| --- | --- | --- |
| `docs/issues/TEMPLATE.md` | The `space_id`, the `list_id`, the `assignee_id`, and the shape of an **Issue file**. | Merged — the project edits the shape. |
| `.issue/clickup.md` | The ClickUp contract every Skill that calls `cup` reads. | Overwritten — nobody edits it. |

Re-running this Skill is how a project catches up with a newer version of the family, so it is safe
to run again at any time.

Read [`CLICKUP-CLI.md`](CLICKUP-CLI.md). That file and this one are the whole brief — read no third.

## Steps

1. `cup --version`. Not on PATH, offer `pnpm add -g @krodak/clickup-cli` and run it only if the user
   says yes — a global install changes their machine, not this repo. Refused, print the command and
   stop.
2. `cup auth --json`. Keep `user.id` for step 5. Authenticated, go to step 4.
3. Run `cup init` and let the user complete it, or `cup init --token <pk_…> --team <id>` where they
   hand over both. The token comes from https://app.clickup.com/settings/apps. It goes to
   `~/.config/cup/config.json` — never into the repo.
4. `cup spaces --json`, then `cup lists <spaceId> --json`, which reaches lists inside folders too and
   names the folder on each row. Ask which list this project files its Issues in — never infer one
   from the repo name, the branch or an existing file. Keep the space id of the space you listed: it
   is the one that holds the chosen list, not whichever space was asked about first.
5. Copy [`templates/issue.md`](templates/issue.md) to `docs/issues/TEMPLATE.md`. Write step 4's space
   id into `space_id`, the list id into `list_id`, and step 2's `user.id` into `assignee_id`. Where
   the file already exists, write those three keys, add any that is absent, and leave the rest
   alone — the block between the `template` markers is the project's to edit.
6. Copy [`CLICKUP-CLI.md`](CLICKUP-CLI.md) to `.issue/clickup.md`, replacing it whole. This copy is
   the Skill's, not the project's: an edit here is lost on the next run, and belongs in the Skill.
7. Print the workspace, space and list names you resolved, and both paths written.

## Done when

`docs/issues/TEMPLATE.md` holds a `space_id`, a `list_id` and an `assignee_id`, and the space id is
the one the chosen list sits in. `.issue/clickup.md` matches the Skill's copy byte for byte, neither
file holds a token, and `cup auth` succeeds. No other file changed.
