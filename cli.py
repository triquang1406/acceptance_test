"""Command-line entry point for the ATG tools.

Examples
--------
AutoUAT (User Story -> Gherkin)::

    python cli.py autouat --title "Alphabet User Sign-Up" --file story.txt

Test Flow (Gherkin + HTML -> Cypress)::

    python cli.py testflow --story-file story.txt --gherkin-file scenarios.feature \\
        --html-file page.html

Test Flow from JIRA::

    python cli.py testflow-issue --issue-key PROJ-123 --url https://example.com/page

Serve the REST API::

    python cli.py serve --port 5000
"""

from __future__ import annotations

import argparse
import sys

from atg.autouat import AutoUAT
from atg.models import TestFlowInput, UserStory
from atg.testflow import TestFlow


def _read(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def cmd_autouat(args) -> int:
    description = args.description or ""
    if args.file:
        description = _read(args.file)
    if not args.title and not args.file:
        # Read a bare user story from stdin: first line = title, rest = description.
        data = sys.stdin.read().strip()
        if data:
            lines = data.splitlines()
            args.title = lines[0]
            description = "\n".join(lines[1:])
    if not args.title:
        print("error: --title or --file is required", file=sys.stderr)
        return 2

    if args.mock:
        from atg.mock import make_mock_for_gherkin

        autouat = AutoUAT(llm=make_mock_for_gherkin())
    else:
        autouat = AutoUAT()

    result = autouat.generate(UserStory(title=args.title, description=description))
    print(result.gherkin_text)
    return 0


def cmd_testflow(args) -> int:
    user_story = UserStory(
        title=getattr(args, "story_title", None) or "Untitled",
        description=_read(args.story_file) if args.story_file else "",
    )
    gherkin = _read(args.gherkin_file) if args.gherkin_file else ""
    html = _read(args.html_file) if args.html_file else ""
    test_input = TestFlowInput(
        user_story=user_story,
        gherkin_scenarios=gherkin,
        html=html,
        predefined_commands=getattr(args, "predefined_commands", "") or "",
        product_context=getattr(args, "product_context", "") or "",
    )
    if args.mock:
        from atg.mock import make_mock_for_cypress

        tf = TestFlow(llm=make_mock_for_cypress())
    else:
        tf = TestFlow()
    result = tf.generate(test_input)
    print(result.script)
    if args.verbose:
        print(
            f"\n[validation] {result.validation_notes}",
            file=sys.stderr,
        )
    return 0


def cmd_testflow_issue(args) -> int:
    result = TestFlow().generate_from_issue(
        issue_key=args.issue_key,
        urls=args.url,
        product_context=args.product_context or "",
        predefined_commands=args.predefined_commands or "",
    )
    print(result.script)
    if args.verbose:
        print(f"\n[validation] {result.validation_notes}", file=sys.stderr)
    return 0


# --- iTrust2 ---------------------------------------------------------------

def cmd_itrust2_list(args) -> int:
    from atg.itrust2 import list_features

    for name in list_features(repo_root=getattr(args, "repo", None)):
        print(name)
    return 0


def _itrust2_user_story(feature: str, repo=None):
    from atg.itrust2 import fetch_feature, parse_feature

    user_story, _ = parse_feature(feature, fetch_feature(feature, repo_root=repo))
    return user_story


def _itrust2_llm(kind: str, mock: bool):
    if mock:
        from atg.mock import make_mock_for_cypress, make_mock_for_gherkin

        return make_mock_for_gherkin() if kind == "gherkin" else make_mock_for_cypress()
    return None  # use the real LLMClient by default


def cmd_itrust2_autouat(args) -> int:
    user_story = _itrust2_user_story(args.feature, getattr(args, "repo", None))
    autouat = AutoUAT(llm=_itrust2_llm("gherkin", args.mock))
    result = autouat.generate(user_story)
    print(result.gherkin_text)
    return 0


def cmd_itrust2_testflow(args) -> int:
    from atg.config import settings
    from atg.itrust2 import (
        fetch_feature,
        fetch_html,
        fetch_page_html,
        parse_feature,
        resolve_template,
    )

    repo = getattr(args, "repo", None)
    user_story, gherkin = parse_feature(
        args.feature, fetch_feature(args.feature, repo_root=repo)
    )
    template = args.html_path or resolve_template(args.feature) or "index.html"

    if getattr(args, "page_url", None):
        # Paper-faithful: fetch the *rendered* HTML of running pages by URL,
        # authenticating (CSRF session) if the page is protected.
        from atg.itrust2 import fetch_page_html_authenticated

        base = getattr(args, "base_url", "") or settings.itrust2_base
        user = getattr(args, "user", "") or ""
        password = getattr(args, "password", "") or ""
        html = "\n\n".join(
            f"<!-- {u} -->\n"
            f"{fetch_page_html_authenticated(u, base_url=base, username=user, password=password)}"
            for u in args.page_url
        )
    elif getattr(args, "base_url", None):
        url = args.base_url.rstrip("/") + "/" + template
        html = fetch_page_html(url)
    else:
        html = fetch_html(template, repo_root=repo)

    test_input = TestFlowInput(
        user_story=user_story,
        gherkin_scenarios=gherkin,
        html=html,
        predefined_commands=getattr(args, "predefined_commands", "") or "",
        product_context=getattr(args, "product_context", "") or settings.product_context,
    )
    result = TestFlow(llm=_itrust2_llm("cypress", args.mock)).generate(test_input)
    print(result.script)
    if args.verbose:
        print(f"\n[validation] {result.validation_notes}", file=sys.stderr)
    return 0


def cmd_serve(args) -> int:
    from atg.api import create_app

    app = create_app()
    app.run(host="127.0.0.1", port=args.port, debug=False)
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="atg", description="Acceptance test generation (AutoUAT + Test Flow)"
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_au = sub.add_parser("autouat", help="User Story -> Gherkin scenarios")
    p_au.add_argument("--title", help="User story title")
    p_au.add_argument("--description", help="User story description (inline)")
    p_au.add_argument("--file", help="Read description from a file")
    p_au.add_argument("--mock", action="store_true", help="Run offline with a mock LLM")
    p_au.set_defaults(func=cmd_autouat)

    p_tf = sub.add_parser("testflow", help="Gherkin + HTML -> Cypress script")
    p_tf.add_argument("--story-file", help="File containing the user story")
    p_tf.add_argument(
        "--story-title", help="User story title (when not in story-file)"
    )
    p_tf.add_argument("--gherkin-file", help="File containing Gherkin scenarios")
    p_tf.add_argument("--html-file", help="File containing cleaned page HTML")
    p_tf.add_argument("--predefined-commands", default="")
    p_tf.add_argument("--product-context", default="")
    p_tf.add_argument("--mock", action="store_true", help="Run offline with a mock LLM")
    p_tf.add_argument("-v", "--verbose", action="store_true")
    p_tf.set_defaults(func=cmd_testflow)

    p_tfi = sub.add_parser(
        "testflow-issue", help="JIRA issue + page URLs -> Cypress script"
    )
    p_tfi.add_argument("--issue-key", required=True)
    p_tfi.add_argument("--url", action="append", required=True, help="Page URL(s)")
    p_tfi.add_argument("--predefined-commands", default="")
    p_tfi.add_argument("--product-context", default="")
    p_tfi.add_argument("-v", "--verbose", action="store_true")
    p_tfi.set_defaults(func=cmd_testflow_issue)

    p_it = sub.add_parser("itrust2", help="Work directly with the iTrust2 repo")
    it_sub = p_it.add_subparsers(dest="itrust2_command", required=True)

    p_it_list = it_sub.add_parser("list", help="List iTrust2 .feature files")
    p_it_list.add_argument("--repo", help="Local clone root (default: auto-detect)")
    p_it_list.set_defaults(func=cmd_itrust2_list)

    p_it_au = it_sub.add_parser(
        "autouat", help="AutoUAT on an iTrust2 feature (user story -> Gherkin)"
    )
    p_it_au.add_argument("--feature", required=True)
    p_it_au.add_argument("--repo", help="Local clone root (default: auto-detect)")
    p_it_au.add_argument("--mock", action="store_true")
    p_it_au.set_defaults(func=cmd_itrust2_autouat)

    p_it_tf = it_sub.add_parser(
        "testflow", help="Test Flow on an iTrust2 feature + HTML page (-> Cypress)"
    )
    p_it_tf.add_argument("--feature", required=True)
    p_it_tf.add_argument("--repo", help="Local clone root (default: auto-detect)")
    p_it_tf.add_argument(
        "--html-path",
        default=None,
        help="Template rel path under iTrust2/src/main/resources/templates/ "
        "(default: auto by feature)",
    )
    p_it_tf.add_argument(
        "--page-url",
        action="append",
        help="URL(s) of a RUNNING iTrust2 page to capture rendered HTML "
        "(paper-faithful). Repeatable.",
    )
    p_it_tf.add_argument(
        "--base-url",
        default="",
        help="Base URL of a running iTrust2; combined with --html-path to fetch HTML.",
    )
    p_it_tf.add_argument("--predefined-commands", default="")
    p_it_tf.add_argument("--product-context", default="")
    p_it_tf.add_argument("--user", default="", help="iTrust2 login username override")
    p_it_tf.add_argument("--password", default="", help="iTrust2 login password override")
    p_it_tf.add_argument("--mock", action="store_true")
    p_it_tf.add_argument("-v", "--verbose", action="store_true")
    p_it_tf.set_defaults(func=cmd_itrust2_testflow)

    p_serve = sub.add_parser("serve", help="Run the Flask REST API")
    p_serve.add_argument("--port", type=int, default=5000)
    p_serve.set_defaults(func=cmd_serve)

    return parser


def main(argv=None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
