---
name: issue-refine 
description: Refine one Issue into a Specification and an Implementation checklist by reaching a shared understanding with the user. 
metadata:
  internal: true
---

# Input
- `/issue-refine <custom id or just the custom id issue number>` 

# Steps

## 1. The issue file

Find the issue .md file inside `docs/issues`. If does not exists, Run `/issue-pull <id>` and check if the task exists and the file was created. If it doesn't, say to the user and stop.

## 2. The context 

Read the whole file. Relevant to the issue are: 
  - the title and ## Specification if exists.
  - `parent`, `subtasks`, `blocked_by` and `blocks` are relevant files to the current. Read in this files any parts that is relevant to refine the current issue, specially the `Out of scope` parts that can be implemented on this issue if it's in this issue scope.

## 3. The questionare

Each issue is a small slice of a feature (e.g. "Login form", "User API integration") — keep it scoped to that slice; any questions beyond the scope of the issue can be added to `Out of scope`.

Interview the user in **rounds** (max 5 questions per round). Each round, ask every question whose prerequisites are settled — number them, use the `/domain-modeling` skill if available, give a little bit of context on each question, talk in ASD-STE100 Simplified Technical English, and use the ubiquitous language from `CONTEXT.md`. Give your recommended answer:

```md
❓ **Q1** - **<title>**: <body, options if useful>

➡️ <recommended answer>
```

Dependent questions wait for a later round. Wait for answers before the next round.

**Facts are your job, decisions are the user's.** Look up anything in the environment (codebase, related issues, APIs) yourself — never ask the user for it, and never block a round on a lookup.

This step is done when no open questions remain and nothing is silently assumed. Confirm with the user before marking the issue refined and moving to the next.

## 4. Testing checklist

Propose a numbered list of test implementations for the current checklist. Each item is a test that validates the behavior of one or many items of the implementation checklist (max 10 test items). Check for the seams that can be tested.

Each item states: the **kind of test** (unit / integration / e2e / manual), **what to verify** and the expected outcome — concrete enough that could execute it without asking questions. Use the implementation checklist template.

Order: happy path first, then edge cases, then error/failure paths. Stay inside the issue's boundaries — behaviors marked out of scope get no tests here.

If a behavior can't be tested at this issue's level (e.g. needs another slice first), ask the user if it should be moved to the out of scope section.

At the end the user will decide which tests will be added to the checklist.

An Implementation item with no test is an unconfirmed decision — you need at least one.

## 5. Writing the issue

Use the `docs/issues/TEMPLATE.md` template format. Add the issue result in this order:

## Specification 

- If there is no specification in the issue file, write one. What the issue delivers and its boundaries. No more than 6 lines.

## Implementation 

The checklist. Ordered, imperative, concrete steps, that the user can understand and can implement by itself, each independently verifiable. The order of the items is the implementation sequence. Think that each line could be a commit message. No more than 10 items per issue. The template for the checklist is
```md
`- ✅ Done task
`- ⬜ Todo task `
```

## Testing

Add the testing checklist here.

## Out of scope

Add any work tasks that are gathered in this form but either belong to another issue (mention the id of the issue), or needs a requires it's own issue file.

# Gotchas

- The file cannot be more than 80 lines.
