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

Implement the work described by the user in the Implementation checklist step by step. Check the Testing checklist for the corresponded test.

Tick `- ✅ Done task` once is completed and test passes.

Follow the Testing checklist and implement each test. There should be a test per implementation step. Implement tests using tdd. Once test passes and implemention step is done, tick the implemented tests and update the test list according to results, like this template:

```md
- ✅ Implementation step
  > *[path/to/edit/file.ts] +[new/file.ts] -[delete/file.ts]

  - ✅ [PASS] Done test 
    > *[path/to/edited/test_file.ts] +[new/test_file.ts] -[deleted/test_file.ts]

- ⬜ Unimplemented or failing implementation step
  > *[path/to/edit/file.ts] +[new/file.ts] -[delete/file.ts]

  - ⛔️ [FAIL] Failed test 
    > *[path/to/edited/test_file.ts] +[new/test_file.ts] -[deleted/test_file.ts]
```

Run typechecking regularly, single test files regularly, and the validation commands and full test suite once at the end.
