"""Reusable mock LLM for offline runs and demonstration.

Not used in production. Lets the CLI / tests exercise the full pipeline without
OpenAI API credentials.
"""

from __future__ import annotations

from typing import Optional, Sequence, Union


class MockLLM:
    """Drop-in replacement for LLMClient.

    Cycles through ``responses``, or returns ``always`` when set. Records the
    prompts it received for inspection.
    """

    def __init__(
        self,
        responses: Optional[Sequence[str]] = None,
        always: str = "",
        record: bool = True,
    ) -> None:
        self._responses = list(responses or [])
        self._always = always
        self.record = record
        self.calls: list[dict] = []

    def chat(self, system, user, temperature=None, max_tokens=None) -> str:
        if self.record:
            self.calls.append(
                {
                    "system": system,
                    "user": user,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }
            )
        if self._always:
            return self._always
        if self._responses:
            return self._responses.pop(0)
        return ""


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

SAMPLE_CYPRESS = """\
describe('Legal Information - Usage Data Tracking', () => {
  it('User activates the collection of analytics data', () => {
    cy.get('[data-testid="data-collection-toggle"]').click();
    cy.get('[data-testid="data-collection-toggle"]')
      .should('have.class', 'is-active');
  });
});
"""


def make_mock_for_gherkin() -> MockLLM:
    return MockLLM(always=SAMPLE_GHERKIN)


def make_mock_for_cypress() -> MockLLM:
    return MockLLM(always="```typescript\n" + SAMPLE_CYPRESS + "\n```")
