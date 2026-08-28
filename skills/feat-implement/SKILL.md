---
name: feat-implement
description: Implements a feature, based on the spec set on the issue file.
disable-model-invocation: false
---

# Input
- `/feat-implement <custom id or just the custom id issue number>`

# Steps

## 1. The issue file

Find the issue .md file inside `docs/issues`. If does not exists, Run `/issue-pull <id>` and check if the task exists and the file was created. If it doesn't, say to the user and stop.

## 2. The implementation.

Implement the work described by the user in the Implementation checklist step by step. 

Use /tdd where possible, at pre-agreed seams.

Tick `- ✅ Done task` that is comple

Follow the Testing checklist and implement each test, validating that the Implementation checklist is done. Tick the implemented tests and prefix each test item with `- ✅ (PASS) Done test` or `- ✅ (FAIL) Done test` according the the test result.

Run typechecking regularly, single test files regularly, and the validation commands and full test suite once at the end.

Once done, use /code-review to review the work.
