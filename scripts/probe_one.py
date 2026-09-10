"""Probe a single iTrust2 route: python scripts/probe_one.py <path> <role>"""

import sys
import re
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from atg.itrust2 import fetch_page_html_authenticated

path = sys.argv[1]
role = sys.argv[2] if len(sys.argv) > 2 else "admin"
h = fetch_page_html_authenticated(f"http://localhost:8080/iTrust2/{path}", username=role, password="123456")
title = re.search(r"<title>(.*?)</title>", h, re.I | re.S)
text = " ".join(re.sub(r"<[^>]+>", " ", h).split())
print(f"path={path} role={role} len={len(h)}")
print("title:", (title.group(1).strip() if title else "(none)"))
print("text :", text[:200])
