---
name: bump-ver
description: Bump a semver version number in a manifest file (plugin.json, package.json, pyproject.toml, Cargo.toml). Defaults to a patch bump.
disable-model-invocation: false
---

Raise the `version` field in a project by one semver step.

## Input

`/bump-ver [segment: patch|minor|major|<explicit version>] <optional: which-project-file>`

No argument means `patch`.

## Steps

1. **Find the file** that holds the version of this project. Or look for the one passed as `which-project-file` argument. If none found say so and stop. if no `which-project-file` arg and more than one plausible file is found, list them and ask which one.
2. **Read the current version** and parse it as `MAJOR.MINOR.PATCH`. If it does not parse as
   semver, say so and stop — do not guess.
3. **Compute the new version:**: if no `<explicit version>`, bump version up +1 of the segment. Any segment to the right of the one named resets to 0. If `<explicit version>` arg, replace the version as is.
4. **Edit only the `version` field.** Leave every other line in the file untouched.
5. **Report** the file changed and the old → new version, e.g. `plugin.json: 0.1.5 → 0.1.6`.

## Limits

- Ignore package folder not related to project: `node_modules`,`vendor`, etc..
- Change the version field only — no other edits, no changelog entry, unless the user asks.
- Never git add or git commit.
- If the manifest's version does not look like semver, or the argument doesn't parse as one of
  the forms above, stop and ask rather than guessing.

Done when the manifest's `version` field reads the computed value and the old → new value has
been reported.
