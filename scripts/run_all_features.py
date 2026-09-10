"""Run the full paper pipeline (AutoUAT + Test Flow) for every iTrust2 feature.

Each feature gets:
  User Story -> AutoUAT -> Gherkin (saved)
  + real rendered HTML of its page (by URL, per-role login) -> Test Flow -> Cypress (saved)
Outputs go to outputs/<feature>/.

Usage:
    python scripts/run_all_features.py            # all features
    python scripts/run_all_features.py AddHospital AddUser   # subset
"""

from __future__ import annotations

import sys
import re
import shutil
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from atg.autouat import AutoUAT
from atg.itrust2 import fetch_feature, fetch_page_html_authenticated, parse_feature
from atg.models import TestFlowInput
from atg.testflow import TestFlow

BASE = "http://localhost:8080/iTrust2"
OUT = Path(__file__).resolve().parent.parent / "outputs"

# feature -> (page URL, login username)   (all sample passwords are "123456")
FEATURES = {
    "AddHospital": ("admin/hospitals", "admin"),
    "AddUser": ("admin/users", "admin"),
    "AppointmentRequest": ("patient/manageAppointmentRequest", "patient"),
    "Diagnoses": ("patient/officeVisit/viewDiagnoses", "patient"),
    "DocumentBasicHealthMetrics": ("hcp/documentOfficeVisit", "hcp"),
    "DocumentOfficeVisit": ("hcp/documentOfficeVisit", "hcp"),
    "EditDemographics": ("patient/editDemographics", "patient"),
    "HCPEditPatientDemographics": ("hcp/editPatientDemographics", "hcp"),
    "PersonnelEditDemographics": ("personnel/editDemographics", "hcp"),
    "Prescriptions": ("patient/officeVisit/viewPrescriptions", "patient"),
}


def _strip_fences(text: str) -> str:
    m = re.match(r"^```(?:gherkin)?\s*(.*?)\s*```$", text, re.DOTALL)
    return m.group(1) if m else text


def run_one(feature: str, rel_url: str, user: str) -> None:
    page_url = f"{BASE}/{rel_url}"
    user_story, _ = parse_feature(feature, fetch_feature(feature))

    # Step 1: AutoUAT
    gherkin = _strip_fences(AutoUAT().generate(user_story).gherkin_text)

    # Capture real rendered HTML (per-role login)
    html = fetch_page_html_authenticated(page_url, username=user, password="123456")

    # Step 2: Test Flow
    res = TestFlow().generate(
        TestFlowInput(
            user_story=user_story,
            gherkin_scenarios=gherkin,
            html=html,
            product_context="iTrust2 EHR web app (Spring Boot + AngularJS).",
        )
    )

    out = OUT / feature
    out.mkdir(parents=True, exist_ok=True)
    (out / f"{feature}.feature").write_text(gherkin, encoding="utf-8")
    (out / f"{feature}.spec.ts").write_text(res.script, encoding="utf-8")
    print(
        f"[OK] {feature}: {gherkin.count('Scenario:')} scenarios, "
        f"html {len(html)} chars, cypress {len(res.script)} chars"
    )


def main() -> int:
    wanted = sys.argv[1:] or list(FEATURES)
    # Fresh run: clear stale outputs first.
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True, exist_ok=True)
    for feature in wanted:
        if feature not in FEATURES:
            print(f"[SKIP] unknown feature: {feature}")
            continue
        rel_url, user = FEATURES[feature]
        try:
            run_one(feature, rel_url, user)
        except Exception as exc:  # noqa: BLE001
            print(f"[FAIL] {feature}: {type(exc).__name__}: {exc}")
    print(f"\nDone. Outputs in {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
