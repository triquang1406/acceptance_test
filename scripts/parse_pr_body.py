"""Parse a GitHub pull-request description into Test Flow inputs.

The GitHub Action (per Fig. 3 of the paper) extracts the JIRA issue key and the
list of page URLs from the PR description, then passes them to Test Flow.

Expected PR-body format (any of these lines work):
    Issue: PROJ-123
    Issue key: PROJ-123
    JIRA: PROJ-123
    URL: https://example.com/page
    https://example.com/page1

Emits shell-friendly key=value lines to stdout.
"""

from __future__ import annotations

import re
import sys


def parse(body: str) -> tuple[str, list[str]]:
    issue_match = re.search(
        r"(?ix)"
        r"(?:issue[-_ ]?key|issue|jira)\s*[:=]?\s*"
        r"(?P<key>[A-Z][A-Z0-9]+-\d+)",
        body,
    )
    issue_key = issue_match.group("key") if issue_match else ""

    # URLs: line-style "URL: <url>" or bare URLs anywhere.
    urls = []
    for m in re.finditer(r"https?://[^\s\)\]\>]+", body):
        url = m.group(0).rstrip(".,;")
        if url not in urls:
            urls.append(url)
    return issue_key, urls


def main(argv=None) -> int:
    if argv is None:
        argv = sys.argv
    body = (
        " ".join(argv[1:])
        if argv and len(argv) > 1
        else (sys.stdin.read() if not sys.stdin.isatty() else "")
    )
    issue_key, urls = parse(body)
    print(f"ISSUE_KEY={issue_key}")
    print("PAGE_URLS=" + " ".join(urls))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
