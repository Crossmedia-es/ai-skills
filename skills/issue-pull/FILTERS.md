# Pulling more than an id

Reference for `/issue-pull`'s two filters. Read it when the run passes one of them.

## `--status <name>`

Run `cup tasks --list <list_id> --status "<name>" --all --json`, then `/issue-pull`'s steps on every
id that comes back. `--all` means every assignee, not paging. Leave `--include-closed` off: naming a
status returns its Issues whether or not that status closes one.

Nothing came back is not an empty status. `--status` is matched exactly and never validated, so a
typo and an empty status give the same answer. Run the procedure under **Statuses** in the contract
and print what you learn.

A listing returns subtasks alongside top-level Issues, so the table is the whole of the status.

## `--with-subtasks`

Run `cup subtasks <id> --json`, take the ids, run the steps on each. They land flat in
`docs/issues/`, carrying `parent`.

One level only. A subtask's own subtasks come from `/issue-pull <subtask> --with-subtasks`.

## Both together

`--status` with `--with-subtasks` descends into every match. That matters only for a subtask whose
own status is not the one swept — the sweep already returns the rest.
