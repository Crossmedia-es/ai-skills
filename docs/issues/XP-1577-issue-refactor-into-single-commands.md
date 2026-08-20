---
id: 869emntfu
custom_id: XP-1577
title: Issue refactor into single commands
status: backlog
type:
url: https://app.clickup.com/t/869emntfu
date_updated: 1787236402172
parent: XP-1558 - AI Skills tools @in progress
blocked_by:
blocks:
subtasks:
---

## Description

The `issue` Skill began as one Skill with seven modes; two of them wrote an Issue file by
different rules and two created an Issue in ClickUp. This work splits it into five Skills of one
job each — `/issue-setup`, `/issue-new`, `/issue-pull`, `/issue-push`, `/issue-refine` — over a
shared contract in `skills/issue/CLICKUP-CLI.md`, with `issue` reduced to a router. A Draft, an
Issue file carrying no `id`, becomes a legitimate state, and `/issue-new` is the single door from
Draft to ClickUp.

## Implementation

- ✅ skills/issue/CLICKUP-CLI.md — the shared contract every Skill reads first
- ✅ skills/issue/SKILL.md — router that names the family, read-only `read` mode
- ✅ skills/issue-setup/SKILL.md — writes TEMPLATE.md, list_id plus the file shape
- ✅ skills/issue-new/SKILL.md — the only door from Draft to ClickUp
- ✅ skills/issue-pull/SKILL.md — downloads, creates or refreshes the Issue file
- ✅ skills/issue-push/SKILL.md — uploads the Issue file's description
- ✅ skills/issue-refine/SKILL.md — interview, writes spec and checklist, no tracker
- ✅ list_id moves from .clickup.toml into docs/issues/TEMPLATE.md frontmatter
- ✅ mise validate green and the family committed
