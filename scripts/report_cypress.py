"""Doc cypress-results.json (reporter json) va in thong ke.

Chay: python scripts/report_cypress.py [duong_dan_json]
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT = ROOT / "cypress-results.json"


def _uc_from_path(path: str) -> str:
    m = re.search(r"UC\d+", path.replace("\\", "/"))
    return m.group(0) if m else ""


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT
    if not path.exists():
        print(f"Khong tim thay {path}")
        return 1
    data = json.loads(path.read_text(encoding="utf-8"))
    stats = data.get("stats", {})
    tests = data.get("tests", [])

    tests = [t for t in tests if t.get("state") in {"passed", "failed", "pending", "skipped"}]
    passed = sum(1 for t in tests if t["state"] == "passed")
    failed = sum(1 for t in tests if t["state"] == "failed")

    print("=== TONG QUAN ===")
    print(f"Tong spec          : {stats.get('suites', '?')}")
    print(f"Tong test (it)     : {len(tests)}")
    print(f"Pass               : {passed}")
    print(f"Fail               : {failed}")
    if tests:
        print(f"Ti le pass         : {passed / len(tests) * 100:.1f}%")
    dur = stats.get("duration") or 0
    print(f"Thoi gian          : {dur / 1000:.0f}s ({dur / 60000:.1f} phut)")

    # --- theo UC (map tu file .spec.ts: describe title -> UC) ---
    desc_to_uc: dict[str, str] = {}
    for spec in sorted((ROOT / "outputs" / "autouat").rglob("*.spec.ts")):
        m = re.search(r"describe\(\s*['\"]([^'\"]+)", spec.read_text(encoding="utf-8"))
        if m:
            desc_to_uc[m.group(1)] = spec.parent.name

    per_uc = Counter()
    per_uc_pass = Counter()
    unknown = Counter()
    for t in tests:
        title = t.get("fullTitle", "") or t.get("title", "")
        desc = re.split(r"\s*[>›]\s*", title)[0]
        uc = (t.get("file") and _uc_from_path(t["file"])) or desc_to_uc.get(desc, "")
        if not uc:
            unknown[desc] += 1
            continue
        per_uc[uc] += 1
        if t["state"] == "passed":
            per_uc_pass[uc] += 1
    if per_uc:
        print("\n=== THEO USE CASE ===")
        print(f"{'UC':6s} {'test':>5s} {'pass':>5s} {'fail':>5s}")
        for uc in sorted(per_uc, key=lambda u: int(u[2:]) if u[2:].isdigit() else 99):
            total = per_uc[uc]
            ok = per_uc_pass[uc]
            print(f"{uc:6s} {total:5d} {ok:5d} {total - ok:5d}")
    if unknown:
        print(f"\n(Khong map duoc UC cho {sum(unknown.values())} test)")

    # --- ly do fail ---
    reasons: Counter[str] = Counter()
    for t in tests:
        if t["state"] != "failed":
            continue
        msg = ((t.get("err") or {}).get("message") or "").strip()
        first = msg.splitlines()[0] if msg else "(khong ro)"
        first = re.sub(r"\s+", " ", first)[:110]
        reasons[first] += 1
    if reasons:
        print("\n=== LY DO FAIL (nhom) ===")
        for reason, count in reasons.most_common(12):
            print(f"{count:5d}  {reason}")

    # --- theo spec ---
    per_spec: Counter[str] = Counter()
    per_spec_pass: Counter[str] = Counter()
    for t in tests:
        title = t.get("fullTitle", "") or t.get("title", "")
        parts = re.split(r"\s*[>›]\s*", title)
        spec = parts[0] if parts else "?"
        per_spec[spec] += 1
        if t["state"] == "passed":
            per_spec_pass[spec] += 1
    print("\n=== THEO SPEC (fail nhieu nhat) ===")
    for spec, total in per_spec.most_common():
        ok = per_spec_pass[spec]
        print(f"  {spec:60s} {ok}/{total} pass")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
