# ai-skills

Cross-Media's agent skills. One repo, one directory per skill, installed per-skill and per-agent.

## Install

Works on Claude Code, Codex, OpenCode, Pi and every other agent the installer supports. Pick the
skills and the agents you want from the picker:

```bash
npx skills@latest add Crossmedia-es/ai-skills
```

The repo is private — the installer uses your existing Git credentials, falling back to `gh repo
clone` and then SSH, so no extra setup is needed if you can already clone it.

Add `-g` to install for yourself rather than into the current project, and `-y` for CI.

### As a Claude Code plugin

For a managed, read-only bundle that updates when we ship, rather than editable copies you own:

```bash
claude plugin marketplace add Crossmedia-es/ai-skills
claude plugin install crossmedia-skills
```

Pick one route or the other — installing both leaves you with every skill twice.

## Skills

- **[project-rules](skills/project-rules/SKILL.md)** — set up and maintain a repo's agent rules as a
  failure log, where every rule names the failure that caused it. Scaffolds `AGENTS.md` and
  `RULES.md`, adds rules while catching duplicates and contradictions, and prunes the ones that have
  stopped earning their place.
- **[xtheme](skills/xtheme/SKILL.md)** — apply the Crossmedia design system to a project. Detects
  the project's UI libraries, writes a design and a browser preview for approval, then builds the
  tokens, logo, components and screens on top of those libraries.

## Working on this repo

```bash
mise validate      # what CI runs: skill layout, frontmatter, manifest drift
mise sync-plugin   # regenerate the plugin's skills array after adding a skill
mise link-skills   # symlink these skills into .claude/.agents/.pi so edits are live
mise clear         # remove those links, back to zero
```

`mise link-skills` is the fast loop for developing a skill: no installer, no copies, so an edit to
`skills/<name>/SKILL.md` takes effect in the next session with nothing to re-run.

See [AGENTS.md](AGENTS.md) for conventions and [CONTEXT.md](CONTEXT.md) for vocabulary.
