"""AutoUAT: Step 1 of the pipeline.

Converts a user story (title + description) into Gherkin acceptance test
scenarios, using the LLM. Mirrors Section II-C and Appendix A of the paper.
"""

from __future__ import annotations

import re
from typing import List, Optional

from .llm_client import LLMClient
from .models import AcceptanceTestResult, ChatTurn, GherkinScenario, UserStory
from .prompts import AUTOUAT_SYSTEM_PROMPT, build_autouat_user_prompt

# Gherkin step keywords (from the Gherkin grammar), used to tokenize steps.
_STEP_KEYWORDS = (
    r"(Given|When|Then|And|But|\*)"
)

# Matches a line that starts a Scenario/Scenario Outline.
_SCENARIO_RE = re.compile(
    r"^\s*(Scenario|Scenario Outline)\s*:\s*(?P<name>.+)$", re.IGNORECASE
)
_FEATURE_RE = re.compile(
    r"^\s*Feature\s*:\s*(?P<name>.+)$", re.IGNORECASE
)
_STEP_RE = re.compile(r"^\s*(" + _STEP_KEYWORDS + r")\s+(?P<text>.+)$")

# Markdown fence line (the LLM often wraps the answer in ```gherkin ... ```).
_FENCE_RE = re.compile(r"^\s*```[A-Za-z]*\s*$")
# A line that belongs to Gherkin (keyword line, table row, tag, comment).
_GHERKIN_LINE_RE = re.compile(
    r"^\s*(?:@\S|Feature\s*:|Background\s*:|Scenario(?:\s+Outline)?\s*:|"
    r"Examples\s*:|(?:Given|When|Then|And|But|\*)\s+|\||#)"
)


def clean_gherkin(text: str) -> str:
    """Return Gherkin without markdown fences nor prose around it.

    The LLM sometimes wraps the feature in a ```gherkin block and appends an
    explanatory paragraph after it. The paper's Step 2 expects the Gherkin
    scenarios only, so both are stripped here.
    """
    lines = [ln.rstrip() for ln in text.splitlines() if not _FENCE_RE.match(ln)]

    first = next(
        (i for i, ln in enumerate(lines) if _GHERKIN_LINE_RE.match(ln)), len(lines)
    )
    last = -1
    for i in range(first, len(lines)):
        if _GHERKIN_LINE_RE.match(lines[i]):
            last = i
    if last < 0:
        return "\n".join(lines).strip()
    while last > first and not lines[last].strip():
        last -= 1
    return "\n".join(lines[first : last + 1]).strip()


class AutoUAT:
    """Generates Gherkin acceptance test scenarios from user stories."""

    def __init__(self, llm: Optional[LLMClient] = None) -> None:
        self.llm = llm or LLMClient()

    def generate(
        self,
        user_story: UserStory,
        chat_history: Optional[List[ChatTurn]] = None,
    ) -> AcceptanceTestResult:
        """Generate Gherkin scenarios for a single user story."""
        user_prompt = build_autouat_user_prompt(
            user_story.title, user_story.description, chat_history
        )
        answer = self.llm.chat(
            system=AUTOUAT_SYSTEM_PROMPT, user=user_prompt
        )
        # Step 2 takes the Gherkin scenarios; drop markdown fences/prose first.
        gherkin = clean_gherkin(answer)
        scenarios = parse_gherkin(gherkin)
        return AcceptanceTestResult(
            stories=[user_story],
            gherkin_text=gherkin,
            scenarios=scenarios,
        )

    def generate_batch(
        self,
        user_stories: List[UserStory],
    ) -> List[AcceptanceTestResult]:
        """Generate Gherkin scenarios for many user stories."""
        return [self.generate(us) for us in user_stories]


def parse_gherkin(text: str) -> List[GherkinScenario]:
    """Parse a Gherkin text blob into structured scenarios.

    - Captures the single ``Feature`` (if present).
    - Splits into scenarios by ``Scenario``/``Scenario Outline`` headers.
    - Groups ``Given/When/Then/And/But/*`` lines as steps of each scenario.
    Non-Gherkin noise (e.g. markdown fences, prose) is ignored.
    """
    scenarios: List[GherkinScenario] = []
    current_feature = ""
    current: Optional[GherkinScenario] = None

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        # Strip markdown code fences that the LLM may wrap output in.
        if line.startswith("```"):
            continue

        feature_match = _FEATURE_RE.match(line)
        if feature_match:
            current_feature = feature_match.group("name").strip()
            continue

        scenario_match = _SCENARIO_RE.match(line)
        if scenario_match:
            if current is not None:
                scenarios.append(current)
            current = GherkinScenario(
                feature=current_feature,
                scenario=scenario_match.group("name").strip(),
                steps=[],
            )
            continue

        step_match = _STEP_RE.match(line)
        if step_match and current is not None:
            keyword = step_match.group(1)
            text = step_match.group(2).strip()
            current.steps.append(f"{keyword} {text}")
            continue

        # Examples table / other Gherkin constructs: ignored in this v0.1 parser.

    if current is not None:
        scenarios.append(current)

    return scenarios
