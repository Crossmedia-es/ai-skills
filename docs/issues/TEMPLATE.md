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

Every key stays, filled or blank. `## Description` and `## Implementation` are both sent to ClickUp
as the Issue's description, in that order. Drop this comment when filling the template.

Implementation items read `- ✅ done thing` or `- ⬜ pending thing`, one short line each.
-->

## Description

{{description}}

## Implementation
