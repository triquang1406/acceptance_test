"""JIRA extraction for Test Flow.

Automatically retrieves the user story and its Gherkin acceptance test
scenarios from JIRA, given an issue key (Section III-B).
"""

from __future__ import annotations

from typing import Optional

import requests
from requests.auth import HTTPBasicAuth

from .config import settings
from .models import UserStory


class JIRAClient:
    """Minimal JIRA REST v3 client to read an issue's story + Gherkin tests."""

    def __init__(self) -> None:
        self.base_url = settings.jira_base_url.rstrip("/")
        self.auth = HTTPBasicAuth(settings.jira_username, settings.jira_api_token)

    def get_issue(self, issue_key: str) -> dict:
        """Fetch a JIRA issue by key (e.g. 'PROJ-123')."""
        url = f"{self.base_url}/rest/api/3/issue/{issue_key}"
        resp = requests.get(
            url, auth=self.auth, timeout=settings.http_timeout
        )
        resp.raise_for_status()
        return resp.json()

    def extract_user_story(self, issue_key: str) -> tuple[UserStory, str]:
        """Return the (UserStory, gherkin_scenarios_text) for an issue.

        Heuristics:
        - title            -> issue summary
        - description      -> issue description text
        - gherkin scenarios-> found in description's code blocks
          (e.g. ```gherkin ... ```) or a dedicated 'Acceptance Criteria' field.
        """
        issue = self.get_issue(issue_key)
        fields = issue.get("fields", {})
        title = fields.get("summary", "") or ""
        description_text = _extract_text(fields.get("description", {}) or "")
        gherkin = _extract_gherkin_from_text(description_text)
        return UserStory(title=title, description=description_text), gherkin


def _extract_text(node) -> str:
    """Flatten a JIRA Atlassian Document Format (ADF) node into plain text."""
    if isinstance(node, str):
        return node
    if isinstance(node, dict):
        if node.get("type") == "text":
            return node.get("text", "")
        chunks = []
        for content in node.get("content", []):
            chunks.append(_extract_text(content))
        return "".join(chunks)
    if isinstance(node, list):
        return "".join(_extract_text(item) for item in node)
    return ""


def _extract_gherkin_from_text(text: str) -> str:
    """Best-effort extraction of Gherkin fenced blocks from free text."""
    import re

    blocks = re.findall(r"```(?:gherkin)?\s*(.*?)```", text, re.DOTALL | re.IGNORECASE)
    if blocks:
        return "\n\n".join(b.strip() for b in blocks if b.strip())
    return ""
