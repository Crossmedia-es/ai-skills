---
name: feat-refine 
description: Refine one Feature issue into multiple smaller tasks with Specification by reaching a shared understand with the user. 
metadata:
  internal: true
---

# Input
- `/feat-refine <custom id or just the custom id issue number>` 

# Steps

## 1. The issue file

Find the issue .md file inside `docs/issues`. If does not exists, Run `/issue-pull <id>` and check if the task exists and the file was created. If it doesn't, say to the user and stop.

## 2. The context 

Read the whole file. Relevant to the issue are: 
  - the title and ## Specification if exists.
  - `parent`, `subtasks`, `blocked_by` and `blocks` are relevant files to the current. Read in this files any parts that is relevant to refine the current issue. 
  - Read the `Out of scope` parts, on the linked issues, that can be implemented on this issue if it's in this issue scope.

## 3. The questionare

The current issue is a full feature (e.g. "User authentication","verify command") — keep it scoped to that feature; any questions beyond the scope of the feature can be added to `Out of scope`. If the issue is too small to split, say to the user to run `/issue-refine` instead.

Interview the user in **rounds** (max 5 questions per round). Each round, ask every question whose prerequisites are settled — number them, use the `/domain-modeling` skill if available. 

Response with this rules:
- give a little bit of context on each question.
- Talk in ASD-STE100 Simplified Technical English
- Always use the ubiquitous language from `CONTEXT.md`. 

Give your recommended answer:

```md
❓ **Q1** - **<title>**: <body, options if useful>

➡️ <recommended answer>
```

Dependent questions wait for a later round. Wait for answers before the next round.

**Facts are your job, decisions are the user's.** Look up anything in the environment (codebase, related issues, APIs) yourself — never ask the user for it, and never block a round on a lookup.

This step is done when no open questions remain and nothing is silently assumed. Confirm with the user before marking the issue refined and moving to the next.

## 4. Writing the issues

Split the feature in multiple issues, that are subtasks of the current feature. Use `/issue-new`. Add the feature issue as parent of the issues.

Use the `docs/issues/TEMPLATE.md` template format. If it does not exists, say to the user. 

Add a `Specification` on each issue with the scope of the task to create. Each new subtask issue will be later refined individually.

## 5. Update the feature issue

Add the new issues as subtask of the current feature issue. Run `/issue-pull` on the feature task to update.

Add an Specification to the feature if there is any, describing the scope of the feature.

Do not add ## Implementation or ## Testing to the feature issue.

Done when the feature have an Specification, at least one subtask issue, and the subtask are linked to the current issue as parent.

# Gotchas

- The feature issue file cannot be more than 80 lines. If so, you broke the scope limit. Ask the user what to move to a new issues or to `Out of scope`
