# The Issue file belongs to the tracker, so refinement is a separate Skill

`issue` talks to ClickUp. `issue-refine` interviews the user and writes the Issue file's spec and
Implementation checklist. They are always installed together, which invites the question of why they
are two Skills — and, once split, invites the wrong split: an `issue` Skill owning the local Issue
file and a `sync` Skill owning the ClickUp API. We rejected that. The Issue file is a projection of a
ClickUp task, not a tracker-neutral document that happens to sync, so the file format sits on the
tracker's side of the line. The cut is between transport and thought: `issue` moves bytes, and
`issue-refine` decides what to build.

## Considered options

**Split local file from remote API** — `issue` owning `docs/issues/`, a `sync` Skill owning
`clickup-cli`. Rejected. Every frontmatter key is a ClickUp field, `date_updated` exists solely as
`push`'s drift guard, an Implementation checklist item is one line because ClickUp orphans a wrapped
bullet from its marker, and there is a single `## Implementation` heading because ClickUp stores one
description blob. A "local" Skill would carry all of that anyway, with the coupling no longer visible.
The test that settles it: swapping ClickUp for another tracker would rewrite both Skills under this
split, and only `issue` under the one we chose.

**One Skill, `refine` as a sixth mode.** Defensible — they are never installed apart — but `issue` is
already a long CLI protocol, and every `/issue get` would drag an interview procedure into context.

## Consequences

- **`issue` owns `templates/issue.md`.** The template decides which sections an Issue file has, and
  every one of them is bounded by what ClickUp stores and returns. `issue-refine` fills sections; it
  never defines them, so a new section is a change to `issue`.
- **`issue-refine` contains no ClickUp knowledge at all** — no `clickup-cli`, no `.clickup.toml`, no
  custom-id rules. Where it needs a fact from the tracker it calls `/issue read`, which is why that
  mode reports whether a status closes an Issue rather than leaving the caller to look it up.
- **`issue-refine` is useless alone**, and `npx skills` installs each Skill independently. It states
  the dependency in its own text; nothing enforces it.
