---
id: 869ek4add
custom_id: XP-1562
title: issue command
status: in progress
type:
url: https://app.clickup.com/t/869ek4add
date_updated: 1787008269396
parent: XP-1558 - AI Skills tools @in progress
blocked_by:
blocks:
subtasks:
---

## Description

## Implementation

- ✅ skills/issue/SKILL.md — modes setup, get, me, push
- ✅ skills/issue/templates/issue.md — the Issue file shape
- ✅ CONTEXT.md — Issue, Issue file, Implementation checklist
- ✅ Ids accepted three ways: custom XP-1562, native, git branch
- ✅ Project config in .clickup.toml — workspace_id plus our own list_id
- ✅ get reads markdown_description and resolves Task Type by name
- ✅ get --with-subtasks verified on XP-1558 — 4 subtasks, 5 files
- ✅ Markdown checkboxes round-trip intact
- ✅ Relations read-only: parent, subtasks, blocked_by, blocks
- ✅ push sends Description plus Implementation as the description
- ✅ push guards: date_updated drift, status validated, empty-implementation warning
- ✅ push verified live on XP-1562
- ✅ Implementation lives in the description — ClickUp comments never render markdown
- ✅ Output discipline: path plus one table, no commentary
- ✅ Implementation format: one short line each, ✅ or ⬜, never wrapped
- ✅ ClickUp rewrites bullets, escapes underscores and autolinks bare filenames — compare normalised
- ✅ add title — creates the Issue in ClickUp, then runs get to write the file
- ✅ add --parent for subtasks, resolving a custom id to the native id the API wants
- ✅ push verified on an Issue that already has a description
- ✅ Drift guard also compares title and status — ClickUp bumps date_updated for description only
- ✅ setup run end to end — .clickup.toml holds workspace_id and list_id, no token
- ✅ get --status <name> — downloads every Issue the list holds in one status
- ✅ Status resolved against [0].statuses[] from list get — list get returns an array of one
- ✅ An unknown status stops with the accepted names — the API returns zero, not an error
- ✅ Status filter is case-insensitive, and reaches a closed status with no --include-closed
- ✅ Filter verified live on Work Items — in progress 3, qa/review 1, Closed 2
- ✅ task list and task search both miss subtasks — --with-subtasks is the way under a status
- ⬜ get --status run end to end, writing the files
- ⬜ me run against a real assignee list
- ⬜ add run against the real list
- ⬜ Ship it: drop metadata.internal and run mise sync-plugin

Known limit: task list and task search cannot filter subtasks in, so me shows top-level Issues only.
Subtasks are reached with get <parent> --with-subtasks.
