"""HTML retrieval and preprocessing for Test Flow.

The paper preprocesses the pages' HTML to remove ``<style>`` and ``<script>``
elements, as these were found unnecessary for the model's understanding and did
not compromise the performance metrics (Section II-D).
"""

from __future__ import annotations

import requests
from bs4 import BeautifulSoup

from .config import settings
from .models import PageSpec


def strip_html(html: str) -> str:
    """Remove <style> and <script> elements from an HTML document.

    Also collapses whitespace a bit so the prompt stays compact (cost control).
    """
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style"]):
        tag.decompose()
    # Return the cleaned document markup (structure/attributes preserved so the
    # model can infer data-testid and element hierarchy).
    return str(soup)


def fetch_page_html(url: str) -> str:
    """Fetch a page's HTML and strip irrelevant elements.

    Returns the cleaned HTML string. Raises on network/HTTP errors.
    """
    headers = {"User-Agent": settings.http_user_agent}
    resp = requests.get(url, headers=headers, timeout=settings.http_timeout)
    resp.raise_for_status()
    return strip_html(resp.text)


def fetch_pages_html(urls: list[str]) -> list[PageSpec]:
    """Fetch and clean HTML for a list of URLs."""
    return [PageSpec(url=url, html=fetch_page_html(url)) for url in urls]
