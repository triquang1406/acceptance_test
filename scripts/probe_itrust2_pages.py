"""Probe every iTrust2 page route against the running app and report content."""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from atg.itrust2 import fetch_page_html_authenticated

BASE = "http://localhost:8080/iTrust2"

# (path, login-role) for every page route found in the controllers.
ROUTES = [
    ("login", "admin"),
    ("viewEmails", "admin"),
    ("admin/index", "admin"),
    ("admin/users", "admin"),
    ("admin/hospitals", "admin"),
    ("admin/drugs", "admin"),
    ("admin/manageICDCodes", "admin"),
    ("patient/index", "patient"),
    ("patient/editDemographics", "patient"),
    ("patient/manageAppointmentRequest", "patient"),
    ("patient/officeVisit/viewOfficeVisits", "patient"),
    ("patient/officeVisit/viewPrescriptions", "patient"),
    ("patient/officeVisit/viewDiagnoses", "patient"),
    ("hcp/index", "hcp"),
    ("hcp/documentOfficeVisit", "hcp"),
    ("hcp/editPatientDemographics", "hcp"),
    ("hcp/editPrescriptions", "hcp"),
    ("hcp/appointmentRequests", "hcp"),
    ("personnel/editDemographics", "hcp"),
    ("er/index", "er"),
]

lines = [f"{'path':42} {'len':>5}  status/content"]
for path, role in ROUTES:
    try:
        h = fetch_page_html_authenticated(f"{BASE}/{path}", username=role, password="123456")
        t = " ".join(re.sub(r"<[^>]+>", " ", h).split())
        bad = "  <-- 404/ERR" if (len(h) < 400 or '"status":404' in h or "Whitelabel" in t or "status=500" in h) else ""
        lines.append(f"{path:42} {len(h):5}  {t[:60]}{bad}")
    except Exception as exc:  # noqa: BLE001
        lines.append(f"{path:42}  ERR {type(exc).__name__}: {str(exc)[:40]}")

Path("probe.txt").write_text("\n".join(lines), encoding="utf-8")
print("done", len(ROUTES))
