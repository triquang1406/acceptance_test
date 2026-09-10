"""LLM client wrapping the OpenAI chat completions API.

Kept as a thin abstraction so the AutoUAT / Test Flow tools can be tested
against a mock and swapped to another provider without touching their logic.
"""

from __future__ import annotations

from typing import List, Optional

from .config import settings


class LLMClient:
    """Sends chat requests to the OpenAI API and returns the answer."""

    def __init__(self) -> None:
        self._client = None  # lazily created

    def _get_client(self):
        """Create (and cache) the OpenAI client."""
        if self._client is not None:
            return self._client
        if not settings.openai_configured:
            raise RuntimeError(
                "No LLM credentials configured. Set OPENAI_API_KEY in your .env file."
            )
        from openai import OpenAI

        self._client = OpenAI(api_key=settings.openai_api_key)
        return self._client

    def chat(
        self,
        system: Optional[str],
        user: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """Send a single-turn chat completion and return the assistant text."""
        messages: List[dict] = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": user})

        client = self._get_client()
        kwargs = {
            "model": settings.openai_model,
            "messages": messages,
            "temperature": settings.llm_temperature
            if temperature is None
            else temperature,
            "max_tokens": settings.llm_max_tokens if max_tokens is None else max_tokens,
        }
        resp = client.chat.completions.create(**kwargs)
        return resp.choices[0].message.content or ""
