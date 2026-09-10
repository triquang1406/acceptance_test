"""Dien URL that cua trang dang test vao Cypress script sinh ra.

Paper (Listing 4) in ra script co `const productDetailPageUrl = '';` voi chu thich
"(URL duoc dien tu dong)", tuc URL that duoc tool dien vao sau khi LLM tra ve.
Module nay lam dung viec do, o tang tool, khong them gi vao prompt:

1. Moi `cy.visit('<path>')` tro sai cho -> doi thanh URL that cua trang dang test
   (giu nguyen `/iTrust2/login` vi luong logout can den trang dang nhap).
2. Neu script khong co `cy.visit` nao -> chen `cy.visit('<url that>')` ngay sau
   lenh dang nhap (`cy.login...`) trong `beforeEach` (hoac trong tung `it`).
"""

from __future__ import annotations

import re

APP = "/iTrust2"
LOGIN = f"{APP}/login"

_VISIT = re.compile(r"""cy\.visit\(\s*(['"])(/[^'"]*)\1""")
_MARKER = re.compile(r"\b(beforeEach|it)\s*\(")
_LOGIN_CALL = re.compile(r"cy\.login[A-Za-z]*\([^)]*\)\s*;")


def fill_page_url(script: str, rel_url: str) -> tuple[str, int]:
    """Tra ve (script da dien URL, so lan thay the/chen)."""
    target = f"{APP}/{rel_url.strip('/')}"

    def _sub(match: re.Match[str]) -> str:
        quote, path = match.group(1), match.group(2)
        if path.startswith(LOGIN) or path == target:
            return match.group(0)
        return f"cy.visit({quote}{target}{quote}"

    script, replaced = _VISIT.subn(_sub, script)
    if replaced:
        return script, replaced

    return _insert_visits(script, target)


def _skip_string(text: str, i: int) -> int:
    """Bo qua mot chuoi trong JS, tra ve vi tri ngay sau dau dong."""
    quote = text[i]
    i += 1
    while i < len(text):
        if text[i] == "\\":
            i += 2
            continue
        if text[i] == quote:
            return i + 1
        i += 1
    return i


def _body_end(text: str, open_brace: int) -> int:
    """Tim dau `}` dong block, co tinh den chuoi va comment."""
    depth = 0
    i = open_brace
    while i < len(text):
        ch = text[i]
        if ch in "\"'`":
            i = _skip_string(text, i)
            continue
        if text.startswith("//", i):
            i = text.find("\n", i)
            if i < 0:
                return len(text)
            continue
        if text.startswith("/*", i):
            i = text.find("*/", i)
            if i < 0:
                return len(text)
            i += 2
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return len(text)


def _insert_visits(script: str, target: str) -> tuple[str, int]:
    """Chen `cy.visit(target)` vao sau lenh dang nhap cua moi block lien quan."""
    blocks: list[tuple[str, int, int]] = []
    for m in _MARKER.finditer(script):
        brace = script.find("{", m.end())
        if brace < 0:
            continue
        blocks.append((m.group(1), brace + 1, _body_end(script, brace)))

    beforeEach = [b for b in blocks if b[0] == "beforeEach"]
    chosen = beforeEach or [b for b in blocks if b[0] == "it"]
    if not chosen:
        return script, 0

    insert_at: list[int] = []
    for _, start, end in chosen:
        body = script[start:end]
        login = None
        for login in _LOGIN_CALL.finditer(body):
            pass
        insert_at.append(start + login.end() if login else start)

    for pos in sorted(insert_at, reverse=True):
        script = f"{script[:pos]}\n    cy.visit('{target}');{script[pos:]}"
    return script, len(insert_at)
