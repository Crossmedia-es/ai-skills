# `AGENTS.md` block template

Append this to `AGENTS.md` verbatim, once, including the markers. The markers make the block findable
later and keep other tools' blocks safe.

Include one self-proposal line, or none for `off`.

```md
<!-- project-rules:start -->
## Rules

Read `RULES.md` now and follow every rule in it. Rules under its `## Proposed` heading are not in
force.

<!-- SELF-PROPOSAL LINE GOES HERE -->
<!-- project-rules:end -->
```

## Self-proposal lines

`propose` — the default:

```md
When the user corrects you, append the rule that would have prevented the correction to the
`## Proposed` section of `RULES.md`.
```

`ask`:

```md
When the user corrects you, name the rule that would have prevented the correction and ask whether to
add it to `RULES.md`.
```

`off` — omit the line.

## One note on wording

"Read `RULES.md` now" is followed. "See `RULES.md` for details" is followed sometimes, and no agent
loads `RULES.md` on its own — this pointer is the only thing that reaches it.
