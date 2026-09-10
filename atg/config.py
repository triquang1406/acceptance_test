"""Configuration for the ATG tools.

Reads settings from environment variables (optionally via a .env file).
All secrets (API keys, URLs) live in the environment / .env, never in code.
"""

from __future__ import annotations

import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Central configuration object."""

    def __init__(self) -> None:
        # --- OpenAI (chat completions via the OpenAI API) ---
        # Default to the cost-efficient gpt-4o-mini unless overridden.
        self.openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
        self.openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.llm_temperature: float = float(os.getenv("LLM_TEMPERATURE", "0.2"))
        self.llm_max_tokens: int = int(os.getenv("LLM_MAX_TOKENS", "4096"))

        # --- JIRA ---
        self.jira_base_url: str = os.getenv("JIRA_BASE_URL", "")
        self.jira_username: str = os.getenv("JIRA_USERNAME", "")
        self.jira_api_token: str = os.getenv("JIRA_API_TOKEN", "")

        # --- Product context (Test Flow system prompt; redacted in the paper) ---
        self.product_context: str = os.getenv("PRODUCT_CONTEXT", "")

        # --- iTrust2 (running-app login + base) ---
        self.itrust2_username: str = os.getenv("ITRUST2_USERNAME", "")
        self.itrust2_password: str = os.getenv("ITRUST2_PASSWORD", "")
        self.itrust2_base: str = os.getenv("ITRUST2_BASE", "")

        # --- HTTP options ---
        self.http_timeout: int = int(os.getenv("HTTP_TIMEOUT", "30"))
        self.http_user_agent: str = os.getenv(
            "HTTP_USER_AGENT", "atg-tools/0.1.0"
        )

    @property
    def jira_configured(self) -> bool:
        return bool(self.jira_base_url and self.jira_api_token)

    @property
    def openai_configured(self) -> bool:
        return bool(self.openai_api_key)


settings = Settings()
