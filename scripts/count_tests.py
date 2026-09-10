"""Count generated test cases: Gherkin scenarios and Cypress it() blocks.

Scans outputs/autouat recursively so the per-UC folders (UC1..UC14) are included.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "outputs" / "autouat"

SCENARIO = re.compile(r"(?im)^\s*Scenario\s*:")
SCENARIO_OUTLINE = re.compile(r"(?im)^\s*Scenario Outline\s*:")
IT = re.compile(r"\bit\(\s*['\"`]")


def spec_of(feature: Path) -> Path:
    """Sibling .spec.ts for a .feature file."""
    return feature.with_suffix(".spec.ts")


feat_files = sorted(DIR.rglob("*.feature"))
spec_files = sorted(DIR.rglob("*.spec.ts"))

total_sc = total_outline = total_it = 0
rows = []
for f in feat_files:
    text = f.read_text(encoding="utf-8")
    sc = len(SCENARIO.findall(text))
    so = len(SCENARIO_OUTLINE.findall(text))
    spec = spec_of(f)
    its = len(IT.findall(spec.read_text(encoding="utf-8"))) if spec.exists() else 0
    rows.append((f, sc, so, its))
    total_sc += sc
    total_outline += so
    total_it += its

print(f"feature files : {len(feat_files)}")
print(f"cypress files : {len(spec_files)}")
print(f"Scenario      : {total_sc}")
print(f"Scenario Outl.: {total_outline}")
print(f"TOTAL Gherkin test cases (scenarios): {total_sc + total_outline}")
print(f"TOTAL Cypress it() blocks           : {total_it}")
print()
print(f"{'UC':5} {'story (slug)':44} {'scen':>4} {'it()':>5}  flag")
print("-" * 72)
for f, sc, so, its in rows:
    flag = "" if (sc + so) == its else "  <-- MISMATCH"
    print(f"{f.parent.name:5} {f.stem:44} {sc + so:4} {its:5}{flag}")
