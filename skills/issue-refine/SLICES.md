# Slices

A **slice** is work cut out of an Issue — because the Issue is too big for one build, or because an
out-of-scope item earned an Issue of its own. Read this when `/issue-refine` reaches either.

Name the slices and wait. On a yes, per slice:

1. Write a **Draft** at `docs/issues/<slug>.md` from `docs/issues/TEMPLATE.md`, carrying a `title`, a
   `## Specification` saying what the slice holds, and `linked: <this Issue's id>` in its frontmatter.
   That reference is how a slice reads back to the Issue it came out of.
2. Where the slice belongs *under* the Issue rather than beside it, set `parent` instead and say so.
   `parent` claims ownership; `linked` only points.
3. Name the paths and close with `/issue-new <paths>`.

Write Drafts. Raise none — `/issue-new` is the only door to ClickUp, and the user opens it.

A Draft is a new file, not an edit to another Issue: the rule against touching a sibling's Issue file
stands, and a slice never existed before this run.
