---
name: test-plan
description: Design and write the tests that validate an Issue's Implementation checklist, before implementation starts.
disable-model-invocation: false
---

# Context

- A seam is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.
- Kind of test: ui | unit | e2e | smoke | manual

# Input
- `/test-plan <custom id | the custom id issue number>`

# Steps

## 1. The issue file

Find the issue .md file inside `docs/issues`. If does not exists, Run `/issue-pull <id>` and check if the task exists and the file was created. If it doesn't, say to the user and stop.

The issue must have a `## Specification` and a `## Implementation` checklist. If not, say to the user to run `/issue-refine <id>` first and stop.

## 2. The test proposal

Propose a numbered list of test implementations for the Implementation checklist. Each item is a test that validates the behavior of one or many items of the implementation checklist. This steps need to be build as TDD. Check for the seams that can be tested.

Each item states: the **kind of test**, **what to verify** and the expected outcome — concrete enough that could execute it without asking questions.

Order: happy path first, then edge cases, then error/failure paths. Stay inside the issue's boundaries — behaviors marked out of scope get no tests here.

If a behavior can't be tested at this issue's level (e.g. needs another slice first), ask the user if it should be moved to the out of scope section.

The user decides which tests are added to the checklist.

## 3. Writing the test 

Add the approved each test under the correspondent `## Implementation` step in the issue file, following the template:

```md
- ⬜ Implementation step
  - ⬜ Test implementation step (kind of test)   
    > *[path/to/edit/test_file.ts] +[to/create/test_file.ts] -[to/delete/test_file.ts]
```

Group test by kind of test.

## 5. The gate

Done when every Implementation item has at least one covering test, or the user gives an explicit waiver (note the waiver next to the item). An Implementation item with no test is an unconfirmed decision.

Tell the user the next step is `/feat-implement <id>`.

## Gotchas

- `## Testing` section must have 1 test per implementation step.
