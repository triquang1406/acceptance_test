"""Tests for the iTrust2 feature parser (no network required)."""

from pathlib import Path

from atg.itrust2 import (
    FEATURE_DIR,
    _csrf_from,
    _derive_base,
    _local_text,
    parse_feature,
    resolve_template,
)

SAMPLE_FEATURE = """\
#Author kpresle

Feature: Add a Hospital
	As an Admin
	I want to add a new hospital
	So that patients can use one of our new facilities

Scenario: Add a valid hospital
	Given I am logged in as an admin
	When I navigate to the hospitals page
	When I fill in the hospital details
	Then the hospital is added
"""


def test_parse_feature_extracts_user_story():
    user_story, gherkin = parse_feature("AddHospital", SAMPLE_FEATURE)
    assert user_story.title == "Add a Hospital"
    assert "As an Admin" in user_story.description
    assert "I want to add a new hospital" in user_story.description
    assert "So that patients can use one of our new facilities" in user_story.description
    # The full feature text is returned as the Gherkin input for Test Flow.
    assert "Scenario: Add a valid hospital" in gherkin


def test_parse_feature_stops_description_at_scenario():
    user_story, _ = parse_feature("AddHospital", SAMPLE_FEATURE)
    # Steps (Given/When/Then) should NOT be part of the description.
    assert "Given I am logged in" not in user_story.description


def test_resolve_template():
    assert resolve_template("AddHospital") == "admin/hospitals.html"
    assert resolve_template("EditDemographics") == "patient/editDemographics.html"


def test_local_text_reads_from_clone(tmp_path):
    # Mimic the repo layout under a temp "clone root".
    rel = FEATURE_DIR + "/AddHospital.feature"
    p = tmp_path / rel
    p.parent.mkdir(parents=True)
    p.write_text("Feature: Add a Hospital\n", encoding="utf-8")
    assert _local_text(str(tmp_path), rel) == "Feature: Add a Hospital\n"
    # Unknown file -> None (falls back to GitHub).
    assert _local_text(str(tmp_path), FEATURE_DIR + "/Nope.feature") is None


def test_derive_base():
    assert _derive_base("http://localhost:8080/iTrust2/admin/hospitals") == (
        "http://localhost:8080/iTrust2"
    )
    assert _derive_base("https://example.com/login") == "https://example.com"


def test_csrf_from():
    html = '<form><input type="hidden" name="_csrf" value="abc123"></form>'
    assert _csrf_from(html) == "abc123"
    assert _csrf_from("<form></form>") == ""

