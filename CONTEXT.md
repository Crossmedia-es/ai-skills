# Cross-Media AI Skills

Cross-Media's catalogue of agent skills, published as one repo and installed per-skill,
per-agent by `npx skills`. Also shipped as a Claude Code plugin.

## Language

**Skill**:
One unit of agent instruction — a directory holding a `SKILL.md` whose frontmatter carries
`name` and `description`. Installable on its own, independent of every other Skill.
_Avoid_: plugin, command, prompt, rule

**Agent target**:
A coding agent that a Skill can be installed to, named by its `npx skills` agent id —
`claude-code`, `codex`, `opencode`, `pi`.
_Avoid_: runtime, harness, model, client, editor

**Install channel**:
A route by which a Skill reaches a machine — either `npx skills` (editable copies, every
Agent target) or the Claude Code plugin (managed read-only bundle, `claude-code` only).
_Avoid_: installer, distribution, delivery

**Internal skill**:
A Skill carrying `metadata.internal: true`, hidden from the picker unless
`INSTALL_INTERNAL_SKILLS=1` is set. Where unfinished Skills live.
_Avoid_: in-progress, draft, WIP, experimental

### project-rules

**Rule**:
One imperative line in `RULES.md` constraining how an agent works in a repo.
_Avoid_: instruction, guideline, constraint, convention, standard

## Relationships

- This library holds many **Skills**; each **Skill** installs to one or more **Agent targets**
- Each **Install channel** exposes a subset of the **Skills** — `npx skills` exposes all
  non-**Internal** ones; the plugin exposes those named in `.claude-plugin/plugin.json`

## Flagged ambiguities

- "skill" previously meant two different things: the `SKILL.md` unit and the `ai-skill-*`
  repo-name prefix. Resolved: the unit is a **Skill**; the prefix is just a repo name and carries
  no meaning.
- "install" conflated *which skills* with *which agents* and *project vs user scope*. Resolved:
  those are three independent axes of one **Install channel**, all chosen in the `npx skills` picker.
