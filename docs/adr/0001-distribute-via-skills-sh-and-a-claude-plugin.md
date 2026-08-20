# Distribute skills via `npx skills`, plus a Claude Code plugin — no bespoke installer

Cross-Media's previous agent tooling, [`ai-skill-feat-workflow`](https://github.com/Crossmedia-es/ai-skill-feat-workflow),
carried its own installer: `install.sh`, `verify.sh`, a `skill-tree.md` copy whitelist, per-version
`migration.md` instructions, and a sandboxed install/update test suite. This repo deliberately
carries none of that. Skills here are published by conforming to the
[Agent Skills spec](https://agentskills.io) and installed with `npx skills add Crossmedia-es/ai-skills`,
which already resolves every agent target we care about — `claude-code`, `codex`, `opencode`, `pi` —
and offers an interactive picker over skills, agents, and project-vs-user scope. We additionally ship
`.claude-plugin/plugin.json` and `marketplace.json` so Claude Code users can subscribe to a managed
bundle instead of copying editable files.

## Considered options

**A bespoke installer, as `feat` has.** Rejected. It would mean re-implementing 40+ agent path
mappings, symlink-vs-copy, lockfile content hashing, and private-repo authentication — all of which
`npx skills` already does, including the Git-credentials → `gh repo clone` → SSH fallback chain that
makes a private `Crossmedia-es` repo work with no extra setup. The `feat` machinery was written when
no standard existed; it now duplicates one.

**Skills.sh only, without the plugin.** Rejected, though it remains the stronger default for a
private repo with few consumers. The plugin's benefit is automatic updates for subscribers, which
matters less internally — but `claude-code` is our primary agent target and the manifest is cheap.

**A native Codex plugin as well.** Not pursued. `.codex-plugin/plugin.json` accepts `skills` only as
a single path string, so it cannot express a curated subset, and Codex drops symlinks when it copies
a plugin into its cache. `npx skills` already serves Codex, so no user is left without a route.

## Consequences

- **Versioning exists only for the plugin channel.** `npx skills` detects updates from
  `skillFolderHash`, not version numbers, so `plugin.json`'s `version` is what tells Claude Code that
  installed users have an update waiting. It is hand-bumped; there is no `package.json`, no
  changesets, and no `CHANGELOG.md` until an audience exists that reads one.
- **`plugin.json`'s `skills` array is generated, not hand-written.** A skill present on disk but
  missing from the array ships to nobody, silently. `mise sync-plugin` writes it; `mise validate`
  fails on drift and never repairs it, so the check cannot pass against a tree that disagrees with
  the commit.
- **Unfinished skills are hidden with `metadata.internal: true`** rather than parked in an
  `in-progress/` directory, because `npx skills` discovers directories regardless of name and would
  otherwise offer drafts in the picker.
