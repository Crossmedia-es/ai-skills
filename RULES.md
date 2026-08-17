# Rules

Rules for agents working in this repo. One flat list, one rule per item.

- Run the `mise` task for a job when one exists, rather than the command it wraps.
- Use `mise clear` to remove skills installed into this repo. `npx skills remove` follows the
  lockfile back to the source and deletes `skills/`.
- Commit before running any command that deletes files in this repo.
- Use `pnpm`, never `npm`. `npx skills` is the install channel's own command — leave it as `npx`.

## Proposed

Rules an agent proposed after being corrected. **Nothing in this section is in force.** Promote a
rule into the list above to make it a rule, or delete it.
