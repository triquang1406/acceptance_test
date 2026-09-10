"""Shared test fixtures.

Provides a configurable MockLLM so the full pipeline can be exercised offline
(without OpenAI API credentials).
"""

from __future__ import annotations

import pytest


class MockLLM:
    """Drop-in replacement for LLMClient.

    Returns one of the configured responses on each call (cycling through them),
    or a fixed response. Records the system/user prompts it received.
    """

    def __init__(self, responses=None, always: str = "") -> None:
        self._responses = list(responses or [])
        self._always = always
        self.calls: list[dict] = []

    def chat(self, system, user, temperature=None, max_tokens=None) -> str:
        self.calls.append(
            {"system": system, "user": user, "temperature": temperature, "max_tokens": max_tokens}
        )
        if self._always:
            return self._always
        if self._responses:
            return self._responses.pop(0)
        return ""


@pytest.fixture
def mock_llm():
    return MockLLM()
