---
name: issue-verify
description: Check that an Issue was built completely and as described — every checklist item against the code, the Specification against the behaviour, and the Out of Scope against what shipped.
disable-model-invocation: true
---

# issue-verify

Judge one **Issue** against the repo: is it built, all of it, and the way the Issue said?

Read the Issue file and the code. The `issue` Skill's contract is not needed — this Skill never calls
`cup`, and reads no other Skill.

**Report only.** Write no project code and fix nothing. A gap is a finding with a command attached,
not work to do here.

## Input

| Argument | Do |
| --- | --- |
| An id with a file in `docs/issues/` | Verify it. |
| Several ids | Verify each, one at a time, one table each. |
| An id with no such file | Stop. Say `/issue-pull <id>`. |
| Nothing given | List `docs/issues/`. Stop. |

## Steps

1. Read the Issue file whole — `## Specification`, `## Implementation`, `## Testing Decisions`,
   `## Out of Scope`.
2. **Every checklist item gets a verdict**, ticked or not. Find the file, symbol or command that
   proves it, and name it. A `- ✅ ` line is a claim, not evidence: verify it like the rest.

   | Verdict | Means |
   | --- | --- |
   | **Built** | Named the file and symbol that does it. |
   | **Missing** | Searched and found nothing. Say where you looked. |
   | **Different** | Built, but not the way the item says. Say both. |

3. **Check the Specification against the behaviour.** The checklist is the sequence; the
   Specification is the promise. Code can satisfy every item and still not do what was described.
4. **Run the check named in `## Testing Decisions`.** Report the command and its result. Where the
   Issue said no automated check settles it, say what you inspected instead.
5. **Check `## Out of Scope` against what shipped.** Anything built that the Issue excluded is scope
   creep, and it is a finding whether or not it works.

## The verdict

**Complete** — every item Built, the Specification satisfied, the named check run and passing,
nothing out of scope shipped. Say `/issue-done <id>`.

**Incomplete** — anything else. Name what is Missing or Different, and stop there. Building it is a
build; `/issue-refine <id>` reopens the plan if the plan was wrong.

Then offer to tick the `- ⬜ ` items you verified as Built. That is the only file this Skill changes,
and only on a yes.

## Limits

- Verify what the Issue names. The rest of the repo is not this Issue's scope.
- Evidence is a file, a symbol or a command's output. "It looks implemented" is Missing.
- Report a gap. Closing it is `/issue-refine` or a build.

## Output

One table — item, verdict, evidence — then the Specification check, the test result, the out-of-scope
findings, and the verdict. Nothing else.

## Done when

Every checklist item carries a verdict backed by a named file, symbol or command, or a stated
absence; the `## Testing Decisions` check has been run or its absence explained; and every
out-of-scope breach is named.
