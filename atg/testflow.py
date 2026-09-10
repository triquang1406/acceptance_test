"""Test Flow: Step 2 of the pipeline.

Converts Gherkin acceptance test scenarios (+ user story + page HTML) into an
executable Cypress (TypeScript) test script. Mirrors Section II-D and Appendix B.
"""

from __future__ import annotations

from typing import Optional

from .code_extractor import extract_script
from .jira_extractor import JIRAClient
from .llm_client import LLMClient
from .models import TestFlowInput, TestFlowResult, UserStory
from .prompts import build_testflow_system_prompt, build_testflow_user_prompt
from .ts_validate import ts_check


class TestFlow:
    """Generates Cypress test scripts from Gherkin scenarios + page HTML."""

    __test__ = False  # prevent pytest from collecting this class

    def __init__(self, llm: Optional[LLMClient] = None) -> None:
        self.llm = llm or LLMClient()
        self.jira = JIRAClient()

    def generate(
        self,
        test_input: TestFlowInput,
        validate: bool = True,
    ) -> TestFlowResult:
        """Generate a Cypress script for the given input bundle."""
        system_prompt = build_testflow_system_prompt(
            product_context=test_input.product_context,
            predefined_commands=test_input.predefined_commands,
        )
        user_prompt = build_testflow_user_prompt(
            user_story=test_input.user_story,
            gherkin_scenarios=test_input.gherkin_scenarios,
            html=test_input.html,
            page_urls=test_input.page_urls,
        )
        response = self.llm.chat(system=system_prompt, user=user_prompt)
        script = extract_script(response)

        is_valid = False
        notes = ""
        if validate:
            is_valid, notes = ts_check.validate(script)

        return TestFlowResult(
            script=script,
            is_valid_typescript=is_valid,
            validation_notes=notes,
        )

    def generate_from_issue(
        self,
        issue_key: str,
        urls: list[str],
        product_context: str = "",
        predefined_commands: str = "",
        validate: bool = True,
    ) -> TestFlowResult:
        """End-to-end convenience: read inputs from JIRA + fetch page HTML."""
        user_story, gherkin = self.jira.extract_user_story(issue_key)

        # Local import to avoid hard dependency when only using issue_key path.
        from .html_fetcher import fetch_pages_html

        pages = fetch_pages_html(urls)
        combined_html = "\n\n".join(
            f"<!-- {p.url} -->\n{p.html}" for p in pages
        )
        test_input = TestFlowInput(
            user_story=user_story,
            gherkin_scenarios=gherkin,
            html=combined_html,
            predefined_commands=predefined_commands,
            product_context=product_context,
        )
        return self.generate(test_input, validate=validate)
