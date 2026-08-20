#!/usr/bin/env python3
"""Repo checks, plugin-manifest generation, and local linking for ai-skills.

`validate` is read-only and fails on drift. `sync` and `link` write.
Keeping validate separate is deliberate: a check that repairs its own input can never fail,
and would pass in CI against a tree that disagrees with the commit.
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILLS_DIR = ROOT / "skills"
PLUGIN_JSON = ROOT / ".claude-plugin" / "plugin.json"

# Where each Agent target looks for project-scoped skills. `codex` and `opencode` both read
# `.agents/skills`, so one link serves them.
AGENT_DIRS = {
    ".claude/skills": "claude-code",
    ".agents/skills": "codex, opencode",
    ".pi/skills": "pi",
}


class Skill:
    def __init__(self, directory: Path):
        self.dir = directory
        self.path = directory / "SKILL.md"
        front = read_frontmatter(self.path)
        self.name = front.get("name", "")
        self.description = front.get("description", "")
        self.internal = front.get("metadata.internal", "").lower() == "true"

    @property
    def rel(self) -> str:
        return "./" + self.dir.relative_to(ROOT).as_posix()


def read_frontmatter(path: Path) -> dict[str, str]:
    """Parse the leading `---` block. Flat keys, plus `metadata.<key>` for one nesting level."""
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    out: dict[str, str] = {}
    section = ""
    for line in text[3:end].splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        indented = line[0] in " \t"
        match = re.match(r"\s*([A-Za-z0-9_.-]+)\s*:\s*(.*)$", line)
        if not match:
            continue
        key, value = match.group(1), match.group(2).strip()
        value = value.strip('"').strip("'")
        if not value:
            section = key
            continue
        out[f"{section}.{key}" if indented and section else key] = value
    return out


LINK = re.compile(r"\]\(([^)\s]+)\)")
CODE_SPAN = re.compile(r"`[^`]*`")
FENCE = re.compile(r"^\s*(```|~~~)")


def prose(text: str) -> list[tuple[int, str]]:
    """Numbered lines with the code stripped out.

    A link inside a fence or a backtick span is a sample of what a file looks like, not a
    pointer to one, so it is not ours to resolve.
    """
    out: list[tuple[int, str]] = []
    fenced = False
    for number, line in enumerate(text.splitlines(), 1):
        if FENCE.match(line):
            fenced = not fenced
            continue
        if not fenced:
            out.append((number, CODE_SPAN.sub("", line)))
    return out


def check_links(skill: Skill) -> list[str]:
    """Every relative link in a Skill must resolve, and must stay inside the Skill.

    Both failures look identical on disk and only bite after install: `npx skills` copies one
    Skill directory at a time, so a link out to a sibling points at a file that never landed.
    Shared material is carried by the Skill that needs it, or written into the project by
    `/issue-setup` — never reached across a directory boundary.
    """
    errors: list[str] = []
    home = skill.dir.resolve()
    for md in sorted(skill.dir.rglob("*.md")):
        for number, line in prose(md.read_text(encoding="utf-8")):
            for target in LINK.findall(line):
                if "://" in target or target.startswith(("#", "mailto:")):
                    continue
                path = target.split("#", 1)[0]
                if not path:
                    continue
                where = f"{rel(md)}:{number}"
                resolved = (md.parent / path).resolve()
                if not resolved.exists():
                    errors.append(f"{where}: `{target}` resolves to nothing")
                elif home != resolved and home not in resolved.parents:
                    errors.append(
                        f"{where}: `{target}` leaves `{skill.dir.name}` — installed on its own, "
                        f"that Skill points at a file nobody copied"
                    )
    return errors


def find_skills() -> tuple[list[Skill], list[str]]:
    """Walk `skills/`, stopping at any directory holding a SKILL.md.

    A directory that is neither a skill nor an ancestor of one is an error: it either lost
    its SKILL.md or was never finished, and both ship nothing while looking fine.
    """
    skills: list[Skill] = []
    errors: list[str] = []

    def walk(directory: Path) -> bool:
        if (directory / "SKILL.md").is_file():
            skills.append(Skill(directory))
            return True
        found = False
        for child in sorted(directory.iterdir()):
            if child.is_dir() and not child.name.startswith("."):
                found |= walk(child)
        if not found:
            errors.append(f"{rel(directory)}: no SKILL.md, and no skill beneath it")
        return found

    if not SKILLS_DIR.is_dir():
        return [], [f"{rel(SKILLS_DIR)}: missing"]
    for child in sorted(SKILLS_DIR.iterdir()):
        if child.is_dir() and not child.name.startswith("."):
            walk(child)
    return skills, errors


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def shipped(skills: list[Skill]) -> list[str]:
    return sorted(s.rel for s in skills if not s.internal)


def cmd_validate() -> int:
    skills, errors = find_skills()

    for skill in skills:
        if not skill.name:
            errors.append(f"{rel(skill.path)}: frontmatter has no `name`")
        elif skill.name != skill.dir.name:
            errors.append(
                f"{rel(skill.path)}: `name: {skill.name}` does not match directory "
                f"`{skill.dir.name}` — it would install under a name nobody expects"
            )
        if not skill.description:
            errors.append(f"{rel(skill.path)}: frontmatter has no `description` — it can never trigger")
        errors.extend(check_links(skill))

    if not PLUGIN_JSON.is_file():
        errors.append(f"{rel(PLUGIN_JSON)}: missing")
    else:
        listed = json.loads(PLUGIN_JSON.read_text(encoding="utf-8")).get("skills", [])
        expected = shipped(skills)
        if sorted(listed) != expected:
            for missing in sorted(set(expected) - set(listed)):
                errors.append(f"{rel(PLUGIN_JSON)}: {missing} is on disk but ships to nobody")
            for extra in sorted(set(listed) - set(expected)):
                errors.append(f"{rel(PLUGIN_JSON)}: {extra} is listed but is absent or internal")
            if sorted(listed) == expected:
                errors.append(f"{rel(PLUGIN_JSON)}: skills array is out of order")
            errors.append("run `mise sync-plugin` to rewrite the skills array")

    if errors:
        for error in errors:
            print(f"FAIL {error}", file=sys.stderr)
        return 1

    internal = sum(1 for s in skills if s.internal)
    print(
        f"OK {len(skills)} skills ({internal} internal), every link inside its Skill, "
        f"plugin manifest in step"
    )
    return 0


def cmd_sync() -> int:
    skills, errors = find_skills()
    if errors:
        for error in errors:
            print(f"FAIL {error}", file=sys.stderr)
        return 1

    manifest = json.loads(PLUGIN_JSON.read_text(encoding="utf-8"))
    before = manifest.get("skills", [])
    manifest["skills"] = shipped(skills)
    if before == manifest["skills"]:
        print("OK skills array already in step")
        return 0
    PLUGIN_JSON.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"WROTE {rel(PLUGIN_JSON)}: {len(manifest['skills'])} skills")
    return 0


def cmd_link() -> int:
    """Symlink every Skill into this project's agent directories.

    Symlinks rather than copies, so an edit under `skills/` is live immediately with nothing
    to re-run. Only ever writes a symlink, and never replaces a real directory — a real
    directory there is somebody else's copy, and deleting it is how sources get lost.
    """
    skills, errors = find_skills()
    if errors:
        for error in errors:
            print(f"FAIL {error}", file=sys.stderr)
        return 1

    failed = False
    for agent_dir, targets in AGENT_DIRS.items():
        directory = ROOT / agent_dir
        directory.mkdir(parents=True, exist_ok=True)
        for skill in skills:
            link = directory / skill.name
            want = os.path.relpath(skill.dir, directory)
            if link.is_symlink():
                if os.readlink(link) == want:
                    print(f"OK   {rel(link)} -> {want}  ({targets})")
                    continue
                link.unlink()
            elif link.exists():
                print(
                    f"FAIL {rel(link)} exists and is not a symlink — left alone. "
                    f"Run `mise clear` first.",
                    file=sys.stderr,
                )
                failed = True
                continue
            link.symlink_to(want)
            print(f"LINK {rel(link)} -> {want}  ({targets})")

    return 1 if failed else 0


if __name__ == "__main__":
    commands = {"validate": cmd_validate, "sync": cmd_sync, "link": cmd_link}
    if len(sys.argv) != 2 or sys.argv[1] not in commands:
        print(f"usage: skills.py {{{'|'.join(commands)}}}", file=sys.stderr)
        sys.exit(2)
    sys.exit(commands[sys.argv[1]]())
