"""Tests for AutoUAT (Step 1) and the Gherkin parser."""

from atg.autouat import AutoUAT, clean_gherkin, parse_gherkin
from atg.models import UserStory
from tests.conftest import MockLLM

SAMPLE_GHERKIN = """\
Feature: Legal Information - Usage Data Tracking

Scenario: User activates the collection of analytics data
  Given the user is on the Profile & Settings Main Page
  And the user is in the Legal Information section
  When the user clicks on the data collection toggle
  Then the toggle should move to the right
  And the toggle should turn green
  And the backend should be notified to activate analytics tracking

Scenario: User deactivates the collection of analytics data
  Given the user is on the Profile & Settings Main Page
  And the user is in the Legal Information section
  When the user clicks on the data collection toggle
  Then the toggle should move to the left
  And the toggle should turn grey
  And the backend should be notified to deactivate analytics tracking
"""


def test_parse_gherkin_counts_scenarios():
    scenarios = parse_gherkin(SAMPLE_GHERKIN)
    assert len(scenarios) == 2
    assert scenarios[0].feature == "Legal Information - Usage Data Tracking"
    assert scenarios[0].scenario == "User activates the collection of analytics data"
    assert scenarios[0].steps[0].startswith("Given")


def test_parse_gherkin_ignores_markdown_fences():
    fenced = "```gherkin\n" + SAMPLE_GHERKIN + "\n```"
    scenarios = parse_gherkin(fenced)
    assert len(scenarios) == 2


def test_parse_gherkin_handles_empty():
    assert parse_gherkin("no gherkin here") == []


def test_autouat_generate_uses_mock():
    llm = MockLLM(always=SAMPLE_GHERKIN)
    autouat = AutoUAT(llm=llm)
    result = autouat.generate(
        UserStory(title="Alphabet User Sign-Up", description="As a user I want...")
    )
    assert result.scenario_count == 2
    # Step 1 output is stored without markdown fences / prose (see clean_gherkin).
    assert result.gherkin_text == SAMPLE_GHERKIN.strip()
    assert "```" not in result.gherkin_text
    assert len(llm.calls) == 1
    assert "Alphabet User Sign-Up" in llm.calls[0]["user"]


def test_clean_gherkin_strips_fences_and_prose():
    fenced = "```gherkin\n" + SAMPLE_GHERKIN + "```\nThis set of scenarios covers the toggle.\n"
    cleaned = clean_gherkin(fenced)
    assert cleaned == SAMPLE_GHERKIN.strip()
    assert "```" not in cleaned
    assert "covers the toggle" not in cleaned
