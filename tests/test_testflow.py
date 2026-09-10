"""Tests for Test Flow (Step 2), code extraction, and TS validation."""

from atg.code_extractor import extract_script
from atg.models import TestFlowInput, UserStory
from atg.testflow import TestFlow
from atg.ts_validate import TSCheck
from tests.conftest import MockLLM

CYPRESS_SCRIPT = """\
describe('Accordion with texts on detail page', () => {
  it('Display first section unfolded', () => {
    cy.get('[data-testid="accordion-item-0"]').within(() => {
      cy.get('h2').should('have.text', 'Produktdetails');
      cy.get('.accordion-item-children').should('be.visible');
    });
  });
});
"""


def test_extract_script_from_fence():
    response = "Here you go:\n```typescript\n" + CYPRESS_SCRIPT + "\n```\nAll done."
    assert extract_script(response) == CYPRESS_SCRIPT.strip()


def test_extract_script_falls_back_to_raw():
    assert extract_script("no fence") == "no fence"


def test_testflow_generate_uses_mock():
    llm = MockLLM(always="```typescript\n" + CYPRESS_SCRIPT + "\n```")
    tf = TestFlow(llm=llm)
    test_input = TestFlowInput(
        user_story=UserStory(title="Detail page", description="As a customer..."),
        gherkin_scenarios="Feature: Accordion\nScenario: ...",
        html="<html><body></body></html>",
    )
    result = tf.generate(test_input, validate=False)
    assert result.script == CYPRESS_SCRIPT.strip()
    assert len(llm.calls) == 1
    # System prompt should carry the best-practice notes.
    system = llm.calls[0]["system"]
    assert "Cypress built-in assertions" in system
    # Selector convention is adapted to the app under test: iTrust2 has no
    # data-test-id, so the prompt points at the id/name attributes in the HTML
    # (see the note above TESTFLOW_SYSTEM_PROMPT_TEMPLATE in atg/prompts.py).
    assert "data-test-id" not in system
    assert "`id` / `name`" in system


def test_ts_validate_returns_bool():
    check = TSCheck(node_bin="nonexistent-node-xyz")  # force heuristic path
    is_valid, notes = check.validate(CYPRESS_SCRIPT)
    assert isinstance(is_valid, bool)
    assert is_valid is True, notes


def test_ts_heuristic_ignores_comments_and_strings():
    check = TSCheck(node_bin="nonexistent-node-xyz")  # force heuristic path
    code = (
        "// a comment with [ brackets ] and { braces }\n"
        "describe('x: has (parens)', () => {\n"
        "  it('y', () => { /* block } comment */\n"
        "    cy.get('[data-testid=\"a\"]').should('be.visible');\n"
        "  });\n"
        "});\n"
    )
    is_valid, notes = check.validate(code)
    assert is_valid is True, notes


def test_ts_heuristic_detects_imbalance():
    check = TSCheck(node_bin="nonexistent-node-xyz")  # force heuristic path
    is_valid, _ = check.validate("describe('x', () => { if (a) { }\n")
    assert is_valid is False
