---
name: issue-setup
description: Prepare a project for the ClickUp Issue skills — authenticate the CLI, pick the list, and write docs/issues/TEMPLATE.md.
disable-model-invocation: true
metadata:
  internal: true
---

# issue-setup

`/issue-setup` runs once per project. It leaves behind one file, `docs/issues/TEMPLATE.md`, holding
the `list_id` and the shape of an **Issue file**.

Read [`../issue/CLICKUP-CLI.md`](../issue/CLICKUP-CLI.md). Read nothing else — no ADR, no source
file, no other Skill. Where the `issue` Skill is missing, say so and stop.

## Input

Takes no argument. Given one, ignore it and say so.

## Steps

1. `cup --version`. Not on PATH, offer `pnpm add -g @krodak/clickup-cli` and run it only if the user
   says yes — a global install changes their machine, not this repo. Refused, print the command and
   stop.
2. `cup auth --json`. Authenticated, go to step 4.
3. Run `cup init` and let the user complete it, or `cup init --token <pk_…> --team <id>` where they
   hand over both. The token comes from https://app.clickup.com/settings/apps. It goes to
   `~/.config/cup/config.json` — never into the repo.
4. `cup spaces --json`, then `cup lists <spaceId> --json`, which reaches lists inside folders too and
   names the folder on each row. Ask which list this project files its Issues in.
5. Copy [`../issue/templates/issue.md`](../issue/templates/issue.md) to `docs/issues/TEMPLATE.md` and
   write the list id into its frontmatter. Where the file already exists, change `list_id` alone —
   the block between the `template` markers is the project's to edit.
6. Print the workspace, space and list names you resolved.

## Limits

- Ask which list. Never infer one from the repo name, the branch or an existing file.
- Write `docs/issues/TEMPLATE.md`. Touch no other file.

## Done when

`docs/issues/TEMPLATE.md` exists, its frontmatter holds a `list_id`, it holds no token, and
`cup auth` succeeds.
