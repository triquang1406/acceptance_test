"""Prompt templates for AutoUAT and Test Flow.

These mirror the prompts published in Appendix A (AutoUAT) and
Appendix B (Test Flow) of arXiv:2504.07244.
"""

from __future__ import annotations

from typing import List, Optional

from .models import ChatTurn

# ---------------------------------------------------------------------------
# AutoUAT (Step 1): User Story -> Gherkin acceptance test scenarios
# ---------------------------------------------------------------------------

AUTOUAT_SYSTEM_PROMPT = (
    "You are an expert assistant specializing in creating User Acceptance Tests "
    "using Gherkin language. Your behavior should be that of a meticulous and "
    "detail-oriented professional, dedicated to producing clear, comprehensive, "
    "and precise User Acceptance Tests. Your objective is to generate high-quality "
    "User Acceptance Tests based on the provided User Story titles and descriptions, "
    "ensuring no ambiguities. The tests should be thorough and follow the Gherkin "
    "syntax accurately."
)

AUTOUAT_CONTEXT_PROMPT = (
    "The User Acceptance Tests you generate will be used by a development team to "
    "validate that the functionality of the application meets the specified "
    "requirements. It is crucial that the tests cover various scenarios, including "
    "edge cases, to ensure robust validation. The User Stories provided will include "
    "a title and a description, and your task is to translate these into Gherkin "
    "language tests."
)


def build_autouat_user_prompt(
    title: str, description: str, chat_history: Optional[List[ChatTurn]] = None
) -> str:
    """Build the AutoUAT user prompt.

    Follows the Jinja-style template in Appendix A. Each chat history item is
    rendered as a user message (with the story) followed by the assistant answer.
    """
    parts = [AUTOUAT_CONTEXT_PROMPT]
    for turn in chat_history or []:
        parts.append(
            "user:\n"
            "Here is a User Story title and description. Generate User Acceptance "
            "Tests in Gherkin language for this User Story.\n"
            f"User Story Title: {turn.inputs.title}\n"
            f"User Story Description: {turn.inputs.description}\n"
            "Here are the User Acceptance Tests in Gherkin language for the given "
            "User Story:\n"
            "assistant:\n"
            f"{turn.outputs.answer}\n"
        )
    parts.append(
        "user:\n"
        "Here is a User Story title and description. Generate User Acceptance Tests "
        "in Gherkin language for this User Story.\n"
        f"User Story Title: {title}\n"
        f"User Story Description: {description}\n"
        "Here are the User Acceptance Tests in Gherkin language for the given User "
        "Story:"
    )
    return "\n".join(parts)


# ---------------------------------------------------------------------------
# Test Flow (Step 2): Gherkin + HTML -> executable Cypress (TypeScript) script
# ---------------------------------------------------------------------------
#
# Sai khac duy nhat so voi Appendix B cua paper (co ghi chu de bao cao):
#   Paper:  "You use the data-test-id to locate the element ..."
#   O day:  dung `id` / `name` co trong HTML duoc cung cap, vi ung dung iTrust2
#           KHONG co attribute data-test-id (kiem chung: 0 occurrence tren cac
#           trang duoc test). Day la buoc prompt engineering ma paper mo ta o
#           Section 5.4 (tinh chinh prompt theo metrics), khong phai bo paper.
# Moi phan khac cua prompt giu nguyen van Appendix B.

TESTFLOW_SYSTEM_PROMPT_TEMPLATE = """\
{product_context}

You will receive a user story, Gherkin scenarios and HTML of the pages to test.
You are responsible for writing the Cypress tests for the Gherkin scenarios.

Keep in mind the following best practices:
- You generate the test to be as complete as possible for the scenario.
- You locate the elements with the `id` / `name` attributes that appear in the
  provided HTML. If you need to interact with an element, use its `id` or `name`.
- Keep tests independent, so they can run in any order.
- Use Cypress built-in assertions.

You already have some Cypress commands and variables to use in your tests:
```typescript
{predefined_commands}
```

Some notes:
- You output the Cypress code only and inside a markdown code block.
- If any additional information is needed, put it in a comment inside the code block.
- Pay attention to the html provided when writing the tests so that you can use the
  correct ids / names and Cypress commands to interact with the elements.
- When using text to assert the content of an element, pay attention to the language
  of the page.
- Ensure your code includes comments that guide through the steps for code
  understanding and accessibility.
"""


def build_testflow_system_prompt(
    product_context: str = "", predefined_commands: str = ""
) -> str:
    """Build the Test Flow system prompt (Appendix B)."""
    return TESTFLOW_SYSTEM_PROMPT_TEMPLATE.format(
        product_context=product_context or "(No product context provided.)",
        predefined_commands=predefined_commands or "(none)",
    )


def build_testflow_user_prompt(
    user_story,
    gherkin_scenarios: str,
    html: str,
    page_urls: Optional[List[str]] = None,
) -> str:
    """Build the Test Flow user prompt.

    The user prompt carries the feature-specific context: the user story, the
    Gherkin scenarios to automate, the URL of the page(s) under test and the
    (preprocessed) HTML of those pages.
    """
    parts = ["User Story:", f"{user_story.to_prompt_block()}", ""]
    if page_urls:
        parts += [
            "Page(s) under test:",
            "\n".join(f"- /iTrust2/{url.strip('/')}" for url in page_urls),
            "",
        ]
    parts += [
        "Gherkin Scenarios:",
        f"{gherkin_scenarios}",
        "",
        "Pages' HTML:",
        f"{html}",
    ]
    return "\n".join(parts)
