"""Extract generated code from an LLM response.

The Test Flow system prompt instructs the model to output Cypress code inside a
markdown code block, so we pull the code block out before validation.
"""

from __future__ import annotations

import re

_CODE_FENCE_RE = re.compile(r"```(?:typescript|ts|javascript|js)?\s*(.*?)```", re.DOTALL)


def extract_script(response: str) -> str:
    """Extract the code block from the model response.

    Falls back to returning the whole response if no fenced block is found.
    """
    match = _CODE_FENCE_RE.search(response)
    if match:
        return match.group(1).strip()
    return response.strip()
