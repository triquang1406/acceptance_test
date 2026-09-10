"""iTrust2 adapter: pull real user stories, Gherkin scenarios, and page HTML.

iTrust2 (https://github.com/ncsu-csc326/iTrust2) is an AngularJS + Spring Boot
EHR app whose acceptance tests are written as Cucumber Gherkin ``.feature``
files, with page templates under ``src/main/resources/templates/``.

This module lets AutoUAT / Test Flow work directly on real iTrust2 inputs. It
prefers a **local clone** (fastest, offline, and faithful to the checked-out
code) and falls back to fetching from GitHub. The clone root is located via the
``ITRUST2_REPO`` env var, ``--repo``, or auto-detected (workspace sibling).
"""

from __future__ import annotations

import os
import re
from pathlib import Path
from typing import List, Optional

import requests

from .html_fetcher import strip_html
from .models import UserStory

REPO = "ncsu-csc326/iTrust2"
BRANCH = "main"
API_TREE = f"https://api.github.com/repos/{REPO}/git/trees/{BRANCH}?recursive=1"
RAW_BASE = f"https://raw.githubusercontent.com/{REPO}/{BRANCH}"
FEATURE_DIR = "iTrust2/src/test/resources/edu/ncsu/csc/itrust/cucumber"
TEMPLATE_DIR = "iTrust2/src/main/resources/templates"

# Feature -> template mapping (rel path under TEMPLATE_DIR). Lowercase feature name.
_TEMPLATE_HINTS = {
    "addhospital": "admin/hospitals.html",
    "adduser": "admin/users.html",
    "appointmentrequest": "patient/manageAppointmentRequest.html",
    "diagnoses": "patient/officeVisit/viewDiagnoses.html",
    "documentbasichealthmetrics": "hcp/documentOfficeVisit.html",
    "documentofficevisit": "hcp/documentOfficeVisit.html",
    "editdemographics": "patient/editDemographics.html",
    "hcpeditpatientdemographics": "hcp/editPatientDemographics.html",
    "personneleditdemographics": "personnel/editDemographics.html",
    "prescriptions": "patient/officeVisit/viewPrescriptions.html",
    "login": "login.html",
}


def _repo_root() -> Optional[str]:
    """Locate a local iTrust2 clone root (dir containing the ``iTrust2`` folder)."""
    env = os.getenv("ITRUST2_REPO", "")
    if env:
        return env
    cwd = Path.cwd()
    candidates = [
        cwd / "iTrust2",             # checked out inside the workspace
        cwd.parent / "iTrust2",      # sibling of the workspace (e.g. d:\\APCS\\iTrust2)
        Path(os.getenv("USERPROFILE", "")) / "iTrust2",
    ]
    for cand in candidates:
        if (cand / FEATURE_DIR).exists():
            return str(cand)
    return None


def _local_text(root: Optional[str], rel: str) -> Optional[str]:
    """Read a repo-relative file from the local clone, if present."""
    if not root:
        return None
    path = Path(root) / rel
    if path.exists():
        return path.read_text(encoding="utf-8")
    return None


def list_features(repo_root: Optional[str] = None) -> List[str]:
    """Return the list of iTrust2 ``.feature`` names (without extension)."""
    root = repo_root or _repo_root()
    names: List[str] = []
    if root and (Path(root) / FEATURE_DIR).exists():
        for p in (Path(root) / FEATURE_DIR).glob("*.feature"):
            if p.name.startswith("ZZZZZ"):
                continue
            names.append(p.stem)
        return sorted(names)

    resp = requests.get(API_TREE, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    for item in data.get("tree", []):
        path = item.get("path", "")
        if path.startswith(FEATURE_DIR) and path.endswith(".feature"):
            base = path.rsplit("/", 1)[-1]
            if base.startswith("ZZZZZ"):
                continue  # internal cleanup feature
            names.append(base[: -len(".feature")])
    return sorted(names)


def _raw_url(rel_path: str) -> str:
    return f"{RAW_BASE}/{rel_path}"


def fetch_feature(name: str, repo_root: Optional[str] = None) -> str:
    """Return a ``.feature`` file's text by feature name.

    Reads from the local clone when available, otherwise from GitHub.
    """
    root = repo_root or _repo_root()
    rel = f"{FEATURE_DIR}/{name}.feature"
    local = _local_text(root, rel)
    if local is not None:
        return local
    resp = requests.get(_raw_url(rel), timeout=30)
    resp.raise_for_status()
    return resp.text


def fetch_html(rel_path: str, repo_root: Optional[str] = None) -> str:
    """Return a cleaned HTML template (strip <style>/<script>).

    Reads from the local clone when available, otherwise from GitHub.
    """
    root = repo_root or _repo_root()
    rel = f"{TEMPLATE_DIR}/{rel_path}"
    local = _local_text(root, rel)
    if local is not None:
        return strip_html(local)
    resp = requests.get(_raw_url(rel), timeout=30)
    resp.raise_for_status()
    return strip_html(resp.text)


def fetch_page_html(url: str) -> str:
    """Fetch the *rendered* HTML of a running iTrust2 page (paper-faithful).

    Mirrors Section III-B of the paper: HTML of pages under test is retrieved
    by URL, stripped of style/script elements.
    """
    from .html_fetcher import fetch_page_html as _fetch

    return _fetch(url)


# ---------------------------------------------------------------------------
# Paper-faithful authenticated page fetching (Session + CSRF login)
# ---------------------------------------------------------------------------

def _derive_base(url: str) -> str:
    """Derive the context base (scheme://host/context) from a page URL.

    The context is the first path segment only when followed by more path
    (e.g. /iTrust2/admin/hospitals -> http://.../iTrust2). A single-segment
    route (e.g. /login) is treated as origin-only.
    """
    import re

    m = re.match(r"(https?://[^/]+)(/[^/]+)?(/.*)?$", url)
    if not m:
        return url
    origin = m.group(1)
    first_seg = m.group(2)
    rest = m.group(3)
    if first_seg and rest:
        return origin + first_seg
    return origin


def _csrf_from(html: str) -> str:
    import re

    m = re.search(r'name="_csrf"\s+value="([^"]+)"', html)
    if not m:
        m = re.search(r'value="([^"]+)"\s+name="_csrf"', html)
    return m.group(1) if m else ""


def _login(session, base_url: str, username: str = "", password: str = "") -> None:
    """Perform CSRF-aware form login against a running iTrust2 instance.

    Credentials are taken from the explicit args, then env vars
    (``ITRUST2_USERNAME``/``ITRUST2_PASSWORD``), then iTrust2's documented
    sample users (all password ``123456``): admin, hcp, er, patient.
    """
    from .config import settings

    username = (
        username
        or settings.itrust2_username
        or os.getenv("ITRUST2_USERNAME", "")
        or "admin"
    )
    password = (
        password
        or settings.itrust2_password
        or os.getenv("ITRUST2_PASSWORD", "")
        or "123456"
    )
    login_url = base_url.rstrip("/") + "/login"
    login_page = session.get(login_url, timeout=30)
    csrf = _csrf_from(login_page.text)
    if not csrf:
        return
    session.post(
        login_url,
        data={"username": username, "password": password, "_csrf": csrf},
        timeout=30,
    )


def _needs_login(resp, page_url: str) -> bool:
    return (
        resp.status_code in (401, 403)
        or ("/login" in resp.url and "/login" not in page_url)
    )


def fetch_page_html_authenticated(
    page_url: str, base_url: str = "", username: str = "", password: str = ""
) -> str:
    """Fetch a page's rendered HTML, logging in (CSRF) if the page is protected.

    Uses a requests.Session so cookies persist. ``username``/``password``
    override env/defaults, letting callers pick the right role (admin/patient/hcp).
    """
    from .config import settings

    base = base_url or settings.itrust2_base or _derive_base(page_url)
    session = requests.Session()
    resp = session.get(page_url, timeout=30)
    if _needs_login(resp, page_url):
        _login(session, base, username=username, password=password)
        resp = session.get(page_url, timeout=30)
    return strip_html(resp.text)


def resolve_template(name: str) -> Optional[str]:
    """Resolve an iTrust2 feature name to a template rel path (best effort)."""
    key = name.lower().replace(" ", "")
    return _TEMPLATE_HINTS.get(key)


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------


def parse_feature(name: str, text: str) -> tuple[UserStory, str]:
    """Extract a (UserStory, gherkin_scenarios_text) from a .feature file.

    - UserStory title  : the ``Feature:`` line.
    - UserStory desc   : the role/goal block (As a... / I want... / So that...),
                         i.e. everything between Feature and the first Scenario.
    - Gherkin text     : the full feature text (already Gherkin) for Test Flow.
    """
    feature_title = ""
    desc_lines: List[str] = []
    collecting = False  # started collecting after the Feature line
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("#"):  # author comments etc.
            continue
        if re.match(r"(?i)^Feature\s*:", line):
            feature_title = line.split(":", 1)[1].strip()
            collecting = True
            continue
        if re.match(r"(?i)^Scenario\b|^Background\b", line):
            break  # scenarios start here; stop collecting the description
        if collecting:
            desc_lines.append(line)

    description = "\n".join(desc_lines).strip()
    title = feature_title or name
    if not description:
        description = f"Feature: {title}"
    return UserStory(title=title, description=description), text
