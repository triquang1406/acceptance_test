"""TypeScript syntax validation for generated Cypress scripts.

The paper reports syntactic correctness as a key metric. We validate the
generated script using the TypeScript compiler (Node.js on PATH). If Node is not
available, we fall back to a lightweight bracket/quote balance check so the tool
still produces a usable signal.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path


class TSCheck:
    """Checks whether a TypeScript snippet is syntactically valid."""

    def __init__(self, node_bin: str = "node", project_root: str = "") -> None:
        self.node_bin = node_bin
        # Node resolves modules relative to the *script* location, so probes and
        # runners written to the temp folder would never find the project's
        # node_modules. Keep the project root to pass `paths` / set the cwd.
        self.project_root = Path(project_root) if project_root else Path(__file__).resolve().parent.parent
        self._parser_path: str | None = None

    def _node_available(self) -> bool:
        return shutil.which(self.node_bin) is not None

    def _resolve_parser(self) -> str:
        """Absolute path of the parser entry point, or '' when not installed."""
        if self._parser_path is not None:
            return self._parser_path
        probe = (
            "try { console.log(require.resolve('@typescript-eslint/parser', "
            "{ paths: [process.cwd()] })); } catch (e) { process.exit(1); }\n"
        )
        try:
            with tempfile.NamedTemporaryFile(
                "w", suffix=".js", delete=False, encoding="utf-8"
            ) as f:
                f.write(probe)
                runner = f.name
            proc = subprocess.run(
                [self.node_bin, runner],
                capture_output=True,
                text=True,
                timeout=60,
                cwd=str(self.project_root),
            )
            self._parser_path = proc.stdout.strip() if proc.returncode == 0 else ""
        except Exception:  # pragma: no cover - defensive
            self._parser_path = ""
        finally:
            try:
                os.unlink(runner)
            except (OSError, UnboundLocalError):
                pass
        return self._parser_path

    def _parser_available(self) -> bool:
        return bool(self._resolve_parser())

    def validate(self, code: str) -> tuple[bool, str]:
        """Return (is_valid, notes)."""
        if self._node_available():
            if self._parser_available():
                try:
                    return self._validate_with_node(code)
                except Exception as exc:  # pragma: no cover - defensive
                    return self._validate_heuristic(
                        code, fallback_note=f"Node parser error ({exc}); used heuristic."
                    )
            return self._validate_heuristic(
                code,
                fallback_note="@typescript-eslint/parser not found; used lightweight heuristic.",
            )
        return self._validate_heuristic(code)

    def _validate_with_node(self, code: str) -> tuple[bool, str]:
        """Use @typescript-eslint/parser to parse the snippet."""
        parser_path = self._resolve_parser()
        script = (
            f"const {{ parse }} = require({parser_path!r});\n"
            "const fs = require('fs');\n"
            "const src = fs.readFileSync(process.argv[2], 'utf8');\n"
            "try { parse(src, { ecmaVersion: 2022, sourceType: 'module', "
            "range: true, loc: true }); console.log('OK'); }\n"
            "catch (e) { console.error('ERROR: ' + e.message); process.exit(1); }\n"
        )
        with tempfile.NamedTemporaryFile(
            "w", suffix=".ts", delete=False, encoding="utf-8"
        ) as f:
            f.write(code)
            tmp = f.name
        try:
            with tempfile.NamedTemporaryFile(
                "w", suffix=".js", delete=False, encoding="utf-8"
            ) as f:
                f.write(script)
                runner = f.name
            proc = subprocess.run(
                [self.node_bin, runner, tmp],
                capture_output=True,
                text=True,
                timeout=60,
            )
            if proc.returncode == 0:
                return True, "Valid TypeScript (parsed by @typescript-eslint/parser)."
            return False, proc.stderr.strip() or proc.stdout.strip()
        finally:
            for path in (tmp, runner):
                try:
                    os.unlink(path)
                except OSError:
                    pass

    def _validate_heuristic(self, code: str, fallback_note: str = "") -> tuple[bool, str]:
        """Bracket/quote balance check used when Node is unavailable.

        Skips line/block comments and treats the whole content of a string
        literal as opaque, so ``// `` comments and ``\"...\"`` strings cannot
        produce false positives.
        """
        note = fallback_note or "Node.js not available; used lightweight heuristic."
        stack = []
        pairs = {"(": ")", "[": "]", "{": "}"}
        in_string = None
        escaped = False
        i = 0
        n = len(code)
        while i < n:
            ch = code[i]
            two = code[i : i + 2]
            # Comments
            if two == "//":
                # skip to end of line
                while i < n and code[i] != "\n":
                    i += 1
                continue
            if two == "/*":
                i += 2
                while i < n and code[i : i + 2] != "*/":
                    i += 1
                i += 2
                continue
            # In string
            if in_string:
                if escaped:
                    escaped = False
                elif ch == "\\":
                    escaped = True
                elif ch == in_string:
                    in_string = None
                i += 1
                continue
            # Start of string
            if ch in ("'", '"', "`"):
                in_string = ch
                i += 1
                continue
            if ch in pairs:
                stack.append(pairs[ch])
            elif ch in (")", "]", "}"):
                if not stack or stack.pop() != ch:
                    return False, f"Unbalanced '{ch}' ({note})"
            i += 1
        valid = not stack and in_string is None
        return valid, note if valid else f"Unbalanced brackets ({note})"


ts_check = TSCheck()
