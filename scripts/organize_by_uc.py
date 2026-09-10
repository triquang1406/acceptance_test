"""Move generated outputs into per use case folders: outputs/autouat/UC1 ... UC14.

Each user story slug is mapped to its UC via user_stories.md (see scripts/uc_map.py),
then `<slug>.feature` and `<slug>.spec.ts` are moved into that UC folder.

Usage:
    python scripts/organize_by_uc.py           # move flat files into UC folders
    python scripts/organize_by_uc.py --copy    # copy instead of move
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.uc_map import uc_by_slug

OUT = Path(__file__).resolve().parent.parent / "outputs" / "autouat"


def main() -> int:
    copy_only = "--copy" in sys.argv
    mapping = uc_by_slug()
    moved = skipped = 0

    files = sorted(OUT.glob("*.feature")) + sorted(OUT.glob("*.spec.ts"))
    for src in files:
        if src.name.endswith(".feature"):
            slug = src.name[: -len(".feature")]
        elif src.name.endswith(".spec.ts"):
            slug = src.name[: -len(".spec.ts")]
        else:
            continue
        uc = mapping.get(slug)
        if not uc:
            print(f"[SKIP] {src.name}: no UC mapping")
            skipped += 1
            continue
        dest_dir = OUT / uc
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / src.name
        if copy_only:
            shutil.copy2(src, dest)
        else:
            shutil.move(str(src), str(dest))
        moved += 1

    for uc in sorted(set(mapping.values()), key=lambda u: int(u[2:])):
        folder = OUT / uc
        n_feat = len(list(folder.glob("*.feature")))
        n_spec = len(list(folder.glob("*.spec.ts")))
        print(f"{uc}: {n_feat} feature, {n_spec} spec")

    print(f"\n{'Copied' if copy_only else 'Moved'} {moved} files, skipped {skipped}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
