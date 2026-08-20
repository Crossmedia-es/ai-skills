# One job per Issue Skill, and the Draft that precedes the tracker

`issue` began as one Skill with seven modes: `setup`, `add`, `get`, `read`, `pull`, `push`, `me`. Two
of those modes wrote an Issue file by different rules, two created an Issue in ClickUp, and every one
of them dragged the whole CLI protocol into context to do it. The family is now five Skills of one
job each — `/issue-setup`, `/issue-new`, `/issue-pull`, `/issue-push`, `/issue-refine` — over a shared
contract in `skills/issue/CLICKUP-CLI.md`, with `issue` reduced to a router that names them and a
`read` mode that fetches without writing.

The second change is the order of creation. The old rule was that every Issue exists in ClickUp
first: `add` raised it there and the file was written from what came back. The new rule is that a
**Draft** — an Issue file carrying no `id` — is a legitimate state, and `/issue-new` is the single
door from a Draft to an Issue. You write the spec where writing is comfortable, then publish it.

## Considered options

**Keep the modes, split only `pull` and `push`.** Rejected once `pull` learned to create a missing
file. That made `get` and `pull` two implementations of "write an Issue file", which is the exact
duplication that ADR 0002's file format exists to prevent. `get` was deleted rather than reconciled.

**Let `/issue-push` create as well as update.** Tried, and reverted within a day. A Skill that both
creates and updates must first decide which it is doing, and that decision is made from the presence
of an `id` in a file the user may have hand-edited. Guessing wrong forks the record: a second ClickUp
task holding the same work, with no way to tell which is canonical. `/issue-new` refuses a file that
has an id and `/issue-push` refuses one that has none, so neither ever guesses.

**Point at the contract from `AGENTS.md`, read once per session.** Rejected. `AGENTS.md` is loaded in
every session in this repo, and most of them never touch ClickUp, so the pointer's cost is paid where
it buys nothing. Worse, "once per session" has no mechanism behind it: nothing keeps the contract in
context across a summary, and a Skill running without it fails silently. A pointer inside each Skill
fires exactly when that Skill runs, and costs nothing otherwise.

**Nest the spec sections under `## Description`.** Rejected in favour of renaming that section to
`## Specification`. ClickUp calls the whole field the description, so a section of the same name
inside it read as a part standing for the whole. A rename removes the collision and leaves the file
flat, where nesting would have added a heading level for every Skill to preserve.

## Consequences

- **`docs/issues/TEMPLATE.md` is the project's ClickUp config**, and it is committed. Its frontmatter
  holds `list_id`; the block between its `template` markers is the Issue file's shape. `.clickup.toml`
  is obsolete — a list id is not a secret, and the API token was never in the repo to begin with.
  A fresh clone therefore needs `cup init` and nothing else.
- **The description is one blob, compared whole.** ClickUp stores one description per Issue, so the
  Skills no longer split it at `## Implementation`; `## Implementation` is free to come first, where
  the work is what an Agent reads first. A difference is reported and the user chooses a side —
  neither Skill picks for them, because the local side may be an afternoon of refinement and
  ClickUp's may be a colleague's correction.
- **Comparison is on meaning, never bytes.** ClickUp re-renders markdown on the way back, so both
  sides are normalised first. This is the one rule that cannot be simplified away.
- **A Draft has no id, so no Skill but `/issue-new` will touch it.** ADR 0002's claim that an Issue
  file is a projection of a ClickUp task still holds for every file that has an id; a Draft is the
  state before the projection exists.
- **Five descriptions instead of one is no context cost here**, since every Skill in the family is
  user-invoked and carries no model-facing description. It is cognitive load instead: `issue` is the
  router that exists so there is one name to remember.
