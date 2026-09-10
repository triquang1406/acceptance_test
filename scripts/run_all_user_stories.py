"""Run AutoUAT over every user story in user_stories.md (Step 1 of the paper).

Each user story -> AutoUAT -> Gherkin acceptance test scenarios.
Outputs: outputs/autouat/<slug>.feature

Usage:
    python scripts/run_all_user_stories.py            # all stories
    python scripts/run_all_user_stories.py Add-User   # subset by slug/title
"""

from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from atg.autouat import AutoUAT
from atg.models import UserStory
from scripts.uc_map import uc_by_slug

MD = Path(__file__).resolve().parent.parent / "user_stories.md"
OUT = Path(__file__).resolve().parent.parent / "outputs" / "autouat"

_HEAD_RE = re.compile(r"^\s*(\d+)\.\s+\*\*(.+?)\*\*")
_BULLET_RE = re.compile(r"^\s*[-*]\s+(.+)")


def parse_user_stories(text: str) -> list[tuple[str, str]]:
    """Return [(title, description)] for each numbered user story."""
    stories: list[tuple[str, str]] = []
    cur: dict | None = None
    for raw in text.splitlines():
        head = _HEAD_RE.match(raw)
        if head:
            if cur:
                stories.append((cur["title"], cur["desc"].strip()))
            cur = {"title": head.group(2).strip(), "desc": ""}
            continue
        bullet = _BULLET_RE.match(raw)
        if cur is not None and bullet:
            cur["desc"] += bullet.group(1).strip() + "\n"
            continue
        # Stop at a section header (## / #) after the first story.
        if cur is not None and raw.lstrip().startswith(("#", "##")):
            if cur["title"] or cur["desc"]:
                stories.append((cur["title"], cur["desc"].strip()))
            cur = None
    if cur and (cur["title"] or cur["desc"]):
        stories.append((cur["title"], cur["desc"].strip()))
    return stories


def _slug(title: str) -> str:
    return re.sub(r"[^A-Za-z0-9]+", "-", title).strip("-").lower()


def main() -> int:
    stories = parse_user_stories(MD.read_text(encoding="utf-8"))
    if not stories:
        print("No user stories found.")
        return 1

    wanted = {s.lower() for s in sys.argv[1:]}
    # Fresh run only when regenerating everything; a subset run must not wipe others.
    if not wanted and OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True, exist_ok=True)
    autouat = AutoUAT()
    uc_map = uc_by_slug()
    done = 0
    for title, desc in stories:
        slug = _slug(title)
        if wanted and slug not in wanted and title.lower() not in wanted:
            continue
        try:
            res = autouat.generate(UserStory(title=title, description=desc))
            out_dir = OUT / uc_map[slug] if slug in uc_map else OUT
            out_dir.mkdir(parents=True, exist_ok=True)
            (out_dir / f"{slug}.feature").write_text(res.gherkin_text, encoding="utf-8")
            n = res.gherkin_text.count("Scenario:")
            print(f"[OK] {title} -> {n} scenarios ({uc_map.get(slug, '')}/{slug}.feature)")
            done += 1
        except Exception as exc:  # noqa: BLE001
            print(f"[FAIL] {title}: {type(exc).__name__}: {exc}")
    print(f"\nDone: {done} user stories -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
