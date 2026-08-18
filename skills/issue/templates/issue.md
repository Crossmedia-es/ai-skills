---
id: {{id}}
custom_id: {{custom_id}}
title: {{title}}
status: {{status}}
type: {{type}}
url: {{url}}
date_updated: {{date_updated}}
parent: {{parent}}
blocked_by:
  - {{id}} - {{title}} @{{status}}
blocks:
  - {{id}} - {{title}} @{{status}}
subtasks:
  - {{id}} - {{title}} @{{status}}
---

<!--
The shape of an Issue file in this project. Edit it to change how Issues are written locally.

Every key stays, filled or blank. Every `##` section below is sent to ClickUp as the Issue's
description, in the order written here. Drop this comment when filling the template.

`## Implementation` is last and stays last: `get` splits the description on that heading, so a
section placed below it is swallowed into the checklist. A section with nothing true to say in it
is left out rather than left empty.

Implementation items read `- ✅ done thing` or `- ⬜ pending thing`, one short line each.
-->

## Description

{{description}}

## Testing Decisions

## Out of Scope

## Implementation
