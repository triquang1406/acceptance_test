"""Kiem tra nhanh chat luong cac .spec.ts sinh ra tu Step 2."""

from __future__ import annotations

import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "outputs" / "autouat"

ALLOWED_CUSTOM = {
    "login",
    "logout",
    "loginAsAdmin",
    "loginAsHCP",
    "loginAsPatient",
    "loginAsRegisteredPatient",
}
BUILTIN = {
    "get", "visit", "contains", "wrap", "wait", "intercept", "url", "on", "window", "then",
    "should", "click", "type", "select", "check", "uncheck", "within", "eq", "find", "its",
    "invoke", "log", "reload", "clearCookies", "clearAllCookies", "clearLocalStorage",
    "clearAllLocalStorage", "clearSessionStorage", "clearAllSessionStorage", "task",
    "fixture", "request", "route", "clock", "tick", "trigger", "focus", "blur", "scrollTo",
    "scrollIntoView", "each", "first", "last", "filter", "parent", "parents", "children",
    "siblings", "next", "prev", "closest", "as", "spread", "screenshot", "viewport", "title",
    "hash", "location", "document", "state", "readFile", "writeFile", "exec", "origin",
    "session", "env", "expose", "getCookie", "getCookies", "setCookie", "clearCookie",
    "intercept", "stub", "server", "fixture", "visit", "type",
}

files = sorted(OUT.rglob("*.spec.ts"))
with_dtid = []
no_visit = []
bad_visit: list[tuple[str, list[str]]] = []
unknown_cmds: Counter[str] = Counter()

for path in files:
    text = path.read_text(encoding="utf-8")
    if "data-test-id" in text or "data-testid" in text:
        with_dtid.append(path.name)
    visits = re.findall(r"""cy\.visit\(\s*['"]([^'"]*)['"]""", text)
    if not visits:
        no_visit.append(path.name)
    else:
        wrong = [v for v in visits if not v.startswith("/iTrust2/")]
        if wrong:
            bad_visit.append((f"{path.parent.name}/{path.name}", wrong))
    for cmd in re.findall(r"cy\.([A-Za-z_][A-Za-z0-9_]*)\s*\(", text):
        if cmd not in BUILTIN and cmd not in ALLOWED_CUSTOM:
            unknown_cmds[cmd] += 1

print(f"Tong spec                 : {len(files)}")
print(f"Con data-test-id          : {len(with_dtid)}")
for name in with_dtid:
    print(f"    - {name}")
print(f"Khong co cy.visit         : {len(no_visit)}")
for name in no_visit:
    print(f"    - {name}")
print(f"cy.visit sai tien to      : {len(bad_visit)}")
for name, wrong in bad_visit:
    print(f"    - {name}: {wrong}")
print("Lenh cy.* khong nam trong danh sach cho phep:")
if not unknown_cmds:
    print("    (khong co)")
for cmd, count in unknown_cmds.most_common():
    print(f"    - cy.{cmd} x{count}")
