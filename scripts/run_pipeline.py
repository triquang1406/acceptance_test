"""Run the full paper pipeline end-to-end on a real iTrust2 feature.

Flow (Fig. 1 of arXiv:2504.07244):
    User Story -> [AutoUAT] -> Gherkin scenarios -> [Test Flow] -> Cypress script

Uses the real running iTrust2 app for the page HTML (paper-faithful: HTML of
the pages under test, retrieved by URL and stripped of style/script).

Usage:
    python scripts/run_pipeline.py [FEATURE] [PAGE_URL]
    e.g. python scripts/run_pipeline.py AddHospital http://localhost:8080/iTrust2/admin/hospitals
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

# Make the workspace root importable when run as `python scripts/run_pipeline.py`.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from atg.autouat import AutoUAT
from atg.itrust2 import fetch_feature, fetch_page_html_authenticated, parse_feature
from atg.models import TestFlowInput, UserStory
from atg.testflow import TestFlow

OUT_DIR = Path(__file__).resolve().parent.parent / "outputs"


def _strip_fences(text: str) -> str:
    """Remove a surrounding ```gherkin ... ``` code fence if present."""
    m = re.match(r"^```(?:gherkin)?\s*(.*?)\s*```$", text, re.DOTALL)
    return m.group(1) if m else text


def main() -> int:
    feature = sys.argv[1] if len(sys.argv) > 1 else "AddHospital"
    page_url = (
        sys.argv[2]
        if len(sys.argv) > 2
        else "http://localhost:8080/iTrust2/admin/hospitals"
    )

    # --- INPUT: user story from the (local clone) iTrust2 feature -----------
    user_story, original_gherkin = parse_feature(feature, fetch_feature(feature))

    print("=" * 72)
    print("INPUT — User Story")
    print("=" * 72)
    print(f"Title: {user_story.title}")
    print(user_story.description)

    # --- STEP 1: AutoUAT (User Story -> Gherkin) ---------------------------
    print("\n" + "=" * 72)
    print("STEP 1 — AutoUAT: User Story -> Gherkin acceptance test scenarios")
    print("=" * 72)
    generated = AutoUAT().generate(user_story)
    gherkin = _strip_fences(generated.gherkin_text)
    print(gherkin)

    # --- Capture real rendered HTML from the running app (paper-faithful) ---
    print("\n" + "=" * 72)
    print(f"INPUT — Real rendered HTML of the page under test ({page_url})")
    print("=" * 72)
    html = fetch_page_html_authenticated(page_url)
    print(f"Captured HTML length: {len(html)} chars (style/script stripped)")

    # --- STEP 2: Test Flow (Gherkin + HTML -> Cypress) ---------------------
    print("\n" + "=" * 72)
    print("STEP 2 — Test Flow: Gherkin + HTML -> executable Cypress script")
    print("=" * 72)
    test_input = TestFlowInput(
        user_story=user_story,
        gherkin_scenarios=gherkin,
        html=html,
        product_context="iTrust2 EHR web app (Spring Boot + AngularJS).",
    )
    result = TestFlow().generate(test_input)
    print(result.script)
    print(f"\n[validation] {result.validation_notes}")

    # --- Save outputs (overwrite any stale ones) -------------------------------
    OUT_DIR.mkdir(exist_ok=True)
    gh_out = OUT_DIR / f"{feature}.feature"
    ts_out = OUT_DIR / f"{feature}.spec.ts"
    gh_out.write_text(gherkin, encoding="utf-8")
    ts_out.write_text(result.script, encoding="utf-8")
    print("\n==================== SAVED ====================")
    print(f"Gherkin -> {gh_out}")
    print(f"Cypress -> {ts_out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
