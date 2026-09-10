"""Data models mirroring the paper's inputs/outputs.

These dataclasses define the contract between AutoUAT (Step 1) and Test Flow
(Step 2), and are used by the CLI, REST API, and the underlying tools.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class UserStory:
    """A user story: the unit of input for AutoUAT (title + description)."""

    title: str
    description: str

    def to_prompt_block(self) -> str:
        return (
            f"User Story Title: {self.title}\n"
            f"User Story Description: {self.description}"
        )


@dataclass
class GherkinScenario:
    """A single Gherkin scenario produced by AutoUAT."""

    feature: str
    scenario: str
    steps: List[str] = field(default_factory=list)

    def to_gherkin(self) -> str:
        lines = [f"  Scenario: {self.scenario}"]
        for step in self.steps:
            lines.append(f"    {step}")
        return "\n".join(lines)


@dataclass
class ChatTurn:
    """A single user/assistant exchange used to build chat_history prompts."""

    inputs: "TurnInputs"
    outputs: "TurnOutputs"


@dataclass
class TurnInputs:
    title: str
    description: str


@dataclass
class TurnOutputs:
    answer: str


@dataclass
class AcceptanceTestResult:
    """Output of AutoUAT: a set of Gherkin scenarios."""

    stories: List[UserStory]
    gherkin_text: str
    scenarios: List[GherkinScenario] = field(default_factory=list)

    @property
    def scenario_count(self) -> int:
        return len(self.scenarios) or self.gherkin_text.count("Scenario:")


@dataclass
class TestFlowInput:
    """Input bundle for Test Flow (Step 2)."""

    __test__ = False  # prevent pytest from collecting this dataclass as a test

    user_story: UserStory
    gherkin_scenarios: str
    html: str
    # Page(s) under test, by URL - same input the paper's Test Flow takes
    # together with the issue key (Fig. 3: "extract the inputs (issue key + URLs)").
    page_urls: List[str] = field(default_factory=list)
    # Optional extra Cypress commands/variables known to the project.
    predefined_commands: str = ""
    product_context: str = ""


@dataclass
class TestFlowResult:
    """Output of Test Flow: an executable Cypress (TypeScript) script."""

    script: str
    is_valid_typescript: bool = False
    validation_notes: str = ""


@dataclass
class PageSpec:
    """A web page under test, identified by URL."""

    url: str
    html: str
