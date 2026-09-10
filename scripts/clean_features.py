"""Lam sach cac file .feature da sinh (bo fence markdown va van xuoi thua).

Dung lai chinh ham `clean_gherkin()` ma AutoUAT dung, nen ket qua giong het viec
chay lai Step 1 nhung khong ton them loi goi LLM.

Chay: python scripts/clean_features.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from atg.autouat import clean_gherkin

OUT = Path(__file__).resolve().parent.parent / "outputs" / "autouat"


def main() -> int:
    changed = 0
    files = sorted(OUT.rglob("*.feature"))
    for path in files:
        before = path.read_text(encoding="utf-8")
        after = clean_gherkin(before) + "\n"
        if after != before:
            path.write_text(after, encoding="utf-8")
            changed += 1
    fence = chr(96) * 3
    left = [p.name for p in files if fence in p.read_text(encoding="utf-8")]
    print(f"[OK] {changed}/{len(files)} file .feature duoc lam sach")
    print(f"    con fence markdown: {len(left)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
