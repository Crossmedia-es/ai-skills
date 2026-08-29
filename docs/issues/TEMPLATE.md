---
space_id: "90127369935"
list_id: "901218547464"
assignee_id: "81735709"
---

# Issues in this project

The frontmatter above is this project's ClickUp config. Every Skill in the `issue` family reads
`list_id` from it. It holds no secret — the API token lives in `~/.config/cup/config.json` — so this
file is committed.

Everything between the markers below is the shape of an **Issue file**. `/issue-pull` copies it when
it writes one. Edit it to change how Issues are written locally.

Every key stays, filled or blank. Every `##` section is one part of the Issue's description, in the
order written here. A section with nothing true to say in it is left out, not left empty.

Implementation items read `- ✅ done thing` or `- ⬜ pending thing`, one short line each.

<!-- template:start -->
---
id:
custom_id:
title:
status:
type:
url:
date_updated:
parent:
blocked_by:
blocks:
subtasks:
---

## Specification

## Implementation

## Out of Scope
<!-- template:end -->
