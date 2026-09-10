"""Audit every Step-2 mapping: fetch each mapped page with a per-role session
and flag any that return 404/500 or have no <title> (i.e. not a real page)."""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import requests  # noqa: E402

from atg.itrust2 import _login  # noqa: E402
from scripts.run_step2_testflow import BASE, MAP  # noqa: E402

_sessions: dict[str, requests.Session] = {}


def session_for(role: str) -> requests.Session:
    if role not in _sessions:
        s = requests.Session()
        _login(s, BASE, username=role, password="123456")
        _sessions[role] = s
    return _sessions[role]


print(f"{'story (slug)':44} {'role':8} {'code':4} {'len':>6}  title")
print("-" * 100)
bad_count = 0
for slug, (rel, role) in MAP.items():
    url = f"{BASE}/{rel}"
    s = session_for(role)
    r = s.get(url, timeout=20)
    h = r.text
    title = re.search(r"<title>(.*?)</title>", h, re.I | re.S)
    t = title.group(1).strip() if title else ""
    is_err = (
        '"status":500' in h
        or '"status":404' in h
        or "Internal Server Error" in h
        or not t
    )
    if is_err:
        bad_count += 1
    print(
        f"{slug:44} {role:8} {r.status_code:4} {len(h):6}  {t[:34]}"
        + ("  <-- BAD" if is_err else "")
    )
print(f"\nBAD mappings: {bad_count}/{len(MAP)}")
