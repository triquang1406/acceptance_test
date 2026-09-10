"""Flask REST API for the ATG tools.

Exposes AutoUAT and Test Flow as HTTP endpoints so the tools can be integrated
into existing workflows (e.g. a GitHub Action, per Section III-B of the paper).
"""

from __future__ import annotations

from flask import Flask, jsonify, request

from .autouat import AutoUAT
from .models import TestFlowInput, UserStory
from .testflow import TestFlow


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False

    autouat = AutoUAT()
    testflow = TestFlow()

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.post("/autouat/generate")
    def autouat_generate():
        """Generate Gherkin acceptance test scenarios from a user story."""
        data = request.get_json(force=True)
        title = data.get("title", "")
        description = data.get("description", "")
        if not title:
            return jsonify({"error": "'title' is required"}), 400
        user_story = UserStory(title=title, description=description)
        result = autouat.generate(user_story)
        return jsonify(
            {
                "gherkin": result.gherkin_text,
                "scenarios": [
                    s.to_gherkin() for s in result.scenarios
                ],
                "scenario_count": result.scenario_count,
            }
        )

    @app.post("/testflow/generate")
    def testflow_generate():
        """Generate a Cypress script from user story + Gherkin + HTML."""
        data = request.get_json(force=True)
        try:
            test_input = TestFlowInput(
                user_story=UserStory(
                    title=data["user_story"]["title"],
                    description=data["user_story"].get("description", ""),
                ),
                gherkin_scenarios=data.get("gherkin_scenarios", ""),
                html=data.get("html", ""),
                predefined_commands=data.get("predefined_commands", ""),
                product_context=data.get("product_context", ""),
            )
        except KeyError as exc:
            return jsonify({"error": f"missing field: {exc}"}), 400

        result = testflow.generate(test_input)
        return jsonify(
            {
                "script": result.script,
                "is_valid_typescript": result.is_valid_typescript,
                "validation_notes": result.validation_notes,
            }
        )

    @app.post("/testflow/generate-from-issue")
    def testflow_generate_from_issue():
        """Generate a Cypress script directly from a JIRA issue + page URLs."""
        data = request.get_json(force=True)
        issue_key = data.get("issue_key", "")
        urls = data.get("urls", [])
        if not issue_key:
            return jsonify({"error": "'issue_key' is required"}), 400
        if not urls:
            return jsonify({"error": "'urls' (list) is required"}), 400
        result = testflow.generate_from_issue(
            issue_key=issue_key,
            urls=urls,
            product_context=data.get("product_context", ""),
            predefined_commands=data.get("predefined_commands", ""),
        )
        return jsonify(
            {
                "script": result.script,
                "is_valid_typescript": result.is_valid_typescript,
                "validation_notes": result.validation_notes,
            }
        )

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)
