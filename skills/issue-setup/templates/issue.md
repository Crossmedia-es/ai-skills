---
space_id: ""
list_id: ""
assignee_id: ""
---

# Issues in this project

The frontmatter above is this project's ClickUp config. `list_id` is the list Issues are filed in,
`space_id` is the space that holds it — what `cup lists <spaceId>` takes — and `assignee_id` is the
ClickUp user every new Issue is assigned to. None of the three is a secret — the API token lives in
`~/.config/cup/config.json` — so this file is committed.

Everything between the markers below is the shape of an **Issue file**. `/issue-pull` copies it when
it writes one. Edit it to change how Issues are written locally.

Every key stays, filled or blank. Every `##` section is one part of the Issue's description, in the
order written here. A section with nothing true to say in it is left out, not left empty.

An Issue file is **85 lines or fewer**, frontmatter included. A longer one is a longer Issue, not a
longer document.

Implementation items read `- ✅ done thing` or `- ⬜ pending thing`, one short line each.

`linked` holds plain references — the Issue this one was sliced out of, or one it merely relates to.
It implies no order and no ownership, unlike `parent` and `blocked_by`.

Relation entries carry a markdown link to the related Issue file, so an editor can open it:
`"[XP-1559](XP-1559-project-rules-command.md) - Project rules command @open"`. Keep the quotes — an
unquoted `[` breaks the frontmatter.

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
linked:
---

## Specification

## Implementation

## Testing Decisions

## Out of Scope
<!-- template:end -->
