"""Tests for HTML preprocessing and JIRA extraction helpers."""

from atg.html_fetcher import strip_html
from atg.jira_extractor import _extract_gherkin_from_text, _extract_text


def test_strip_html_removes_script_and_style():
    html = (
        "<html><head><style>body{color:red}</style>"
        "<script>alert('x')</script></head>"
        "<body><div data-testid=\"a\">Hello</div></body></html>"
    )
    cleaned = strip_html(html)
    assert "<style" not in cleaned
    assert "<script" not in cleaned
    # Structure / attributes preserved so the model can infer data-testid.
    assert 'data-testid="a"' in cleaned


def test_extract_text_flattens_adf():
    node = {
        "type": "doc",
        "content": [
            {"type": "paragraph", "content": [{"type": "text", "text": "Hello "}]},
            {"type": "paragraph", "content": [{"type": "text", "text": "world"}]},
        ],
    }
    assert _extract_text(node) == "Hello world"


def test_extract_gherkin_from_text():
    text = "Some prose.\n```gherkin\nFeature: F\nScenario: S\n```\nMore prose."
    assert "Feature: F" in _extract_gherkin_from_text(text)
    assert "Scenario: S" in _extract_gherkin_from_text(text)
