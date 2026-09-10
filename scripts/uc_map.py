"""Map a user story slug to its use case (UC1..UC14) using user_stories.md sections.

`user_stories.md` groups stories under section headers like "## UC1 — User Functionality",
so the mapping is derived from the source of truth instead of being hard-coded.
"""

from __future__ import annotations

import re
from pathlib import Path

MD = Path(__file__).resolve().parent.parent / "user_stories.md"

_SECTION = re.compile(r"^##\s+(UC\d+)\b")
_STORY = re.compile(r"^\s*(\d+)\.\s+\*\*(.+?)\*\*")


def slugify(title: str) -> str:
    """Same slug rule as scripts/run_all_user_stories.py."""
    return re.sub(r"[^A-Za-z0-9]+", "-", title).strip("-").lower()


def uc_by_slug() -> dict[str, str]:
    """Return {slug: 'UCn'} for every numbered user story in user_stories.md."""
    mapping: dict[str, str] = {}
    current = ""
    for raw in MD.read_text(encoding="utf-8").splitlines():
        section = _SECTION.match(raw)
        if section:
            current = section.group(1)
            continue
        story = _STORY.match(raw)
        if story and current:
            mapping[slugify(story.group(2).strip())] = current
    return mapping


def uc_of(slug: str, default: str = "") -> str:
    """Return the UC folder name for a slug, or `default` when unmapped."""
    return uc_by_slug().get(slug, default)
