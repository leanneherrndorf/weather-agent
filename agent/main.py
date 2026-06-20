"""
Weather Agent — main orchestrator.

Run modes:
  Scheduled:  SCHEDULED_RUN=true python -m agent.main
  Test:       python -m agent.main --test

Any other invocation exits immediately with a usage message.
This is intentional: the agent is designed for automated runs only.
"""

import os
import sys
import json
import re
import argparse
from datetime import date

from dotenv import load_dotenv
load_dotenv()  # loads .env from project root — no-op in GitHub Actions

import anthropic

from agent.prompts.report import SYSTEM_PROMPT, user_prompt
from agent.renderer.json import DATA_DIR
from agent.tools import get_weather_extremes, get_noaa_alerts, get_significant_earthquakes, search_weather_news
from agent.renderer.json import render_report


# ---------------------------------------------------------------------------
# Report schema validation
# ---------------------------------------------------------------------------

VALID_TYPES = {"weather", "earthquake", "volcano", "wildfire", "tsunami", "other"}
VALID_SEVERITIES = {"extreme", "severe", "moderate"}


def validate_report(report: dict) -> dict:
    """
    Validate and sanitise the LLM-generated report dict before writing to disk.
    Raises ValueError on critical structural problems.
    """
    if not isinstance(report, dict):
        raise ValueError("Report is not a dict")

    # Validate date
    report_date = report.get("date", "")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(report_date)):
        raise ValueError(f"Invalid or missing date: {report_date!r}")

    # Coerce string fields to safe lengths
    report["headline"] = str(report.get("headline", ""))[:300]
    report["overview"] = str(report.get("overview", ""))[:2000]

    events = report.get("events")
    if not isinstance(events, list):
        raise ValueError("Report 'events' is not a list")

    sanitised_events = []
    for i, event in enumerate(events):
        if not isinstance(event, dict):
            continue

        # Allowlist type and severity
        event_type = str(event.get("type", "other")).lower()
        if event_type not in VALID_TYPES:
            event["type"] = "other"

        severity = str(event.get("severity", "moderate")).lower()
        if severity not in VALID_SEVERITIES:
            event["severity"] = "moderate"

        # Coerce continuing flag
        event["continuing"] = bool(event.get("continuing", False))

        # Truncate free-text fields
        event["title"] = str(event.get("title", ""))[:300]
        event["location"] = str(event.get("location", ""))[:200]
        event["summary"] = str(event.get("summary", ""))[:1000]

        # Validate article URLs — only allow https://
        articles = event.get("articles", [])
        if isinstance(articles, list):
            safe_articles = []
            for article in articles:
                if isinstance(article, dict):
                    url = str(article.get("url", ""))
                    if not url.startswith("https://"):
                        url = ""
                    safe_articles.append({
                        "title": str(article.get("title", ""))[:300],
                        "url": url,
                        "source": str(article.get("source", ""))[:100],
                    })
            event["articles"] = safe_articles

        sanitised_events.append(event)

    report["events"] = sanitised_events
    return report


# ---------------------------------------------------------------------------
# Run guard
# ---------------------------------------------------------------------------

def check_run_mode() -> str:
    """
    Returns 'scheduled' or 'test', or exits if neither condition is met.
    """
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--test", action="store_true")
    args, _ = parser.parse_known_args()

    if args.test:
        print("[weather-agent] Running in TEST mode.")
        return "test"

    if os.environ.get("SCHEDULED_RUN") == "true":
        print("[weather-agent] Running in SCHEDULED mode.")
        return "scheduled"

    print(
        "weather-agent is designed for scheduled runs only.\n"
        "  Scheduled: set SCHEDULED_RUN=true in the environment\n"
        "  Testing:   pass --test flag\n"
    )
    sys.exit(1)


# ---------------------------------------------------------------------------
# Recent events loader
# ---------------------------------------------------------------------------

def load_recent_events(days: int = 2) -> list[dict]:
    """
    Load the most recent N daily reports and return a list of
    {date, events} dicts for use in the user prompt.
    """
    index_path = DATA_DIR / "index.json"
    if not index_path.exists():
        return []

    try:
        reports = json.loads(index_path.read_text())["reports"]
    except Exception:
        return []

    recent = []
    for entry in reports[:days]:
        report_path = DATA_DIR / f"{entry['date']}.json"
        if report_path.exists():
            try:
                data = json.loads(report_path.read_text())
                recent.append({"date": data["date"], "events": data.get("events", [])})
            except Exception:
                continue

    return recent


# ---------------------------------------------------------------------------
# Tool definitions for Claude
# ---------------------------------------------------------------------------

TOOLS: list[dict] = [
    {
        "name": "get_weather_extremes",
        "description": (
            "Fetches current weather conditions (max/min temperature, precipitation, wind speed) "
            "for a representative sample of major cities worldwide. Returns a list sorted by "
            "most extreme conditions first."
        ),
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "get_noaa_alerts",
        "description": (
            "Fetches active severe and extreme weather alerts from the US National Weather Service. "
            "Covers the United States and territories. Returns alert event, severity, affected area, "
            "and a short description."
        ),
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "get_significant_earthquakes",
        "description": (
            "Fetches significant earthquakes from the past 7 days via the USGS Earthquake "
            "Hazards Program. Returns magnitude, location, depth, time, tsunami alert status, "
            "and USGS alert level (green/yellow/orange/red). Global coverage."
        ),
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "search_weather_news",
        "description": (
            "Searches for recent news articles about a specific natural event — weather, "
            "earthquakes, volcanic eruptions, wildfires, tsunamis, or any other natural disaster. "
            "Use a specific query like 'cyclone dana philippines 2024' or "
            "'volcano eruption iceland june 2026'. "
            "Returns article titles, URLs, sources, and short descriptions."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Specific search query for the weather event",
                },
                "count": {
                    "type": "integer",
                    "description": "Number of articles to return (1-3 recommended)",
                    "default": 2,
                },
            },
            "required": ["query"],
        },
    },
]


# ---------------------------------------------------------------------------
# Tool dispatch
# ---------------------------------------------------------------------------

def dispatch_tool(name: str, inputs: dict) -> str:
    """Execute a tool call and return JSON-serialised result."""
    if name == "get_weather_extremes":
        result = get_weather_extremes()
    elif name == "get_noaa_alerts":
        result = get_noaa_alerts()
    elif name == "get_significant_earthquakes":
        result = get_significant_earthquakes()
    elif name == "search_weather_news":
        result = search_weather_news(
            query=inputs["query"],
            count=inputs.get("count", 2),
        )
    else:
        result = {"error": f"Unknown tool: {name}"}

    return json.dumps(result)


# ---------------------------------------------------------------------------
# Agent loop
# ---------------------------------------------------------------------------

def run_agent() -> dict:
    """
    Runs the agentic tool loop and returns the parsed report dict.
    """
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    recent_events = load_recent_events(days=2)
    messages = [{"role": "user", "content": user_prompt(recent_events)}]

    print("[weather-agent] Starting agent loop...")

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2500,
            system=[{"type": "text", "text": SYSTEM_PROMPT, "cache_control": {"type": "ephemeral"}}],
            tools=TOOLS,
            messages=messages,
        )

        # Append assistant turn
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            # Extract JSON from the final text block
            for block in response.content:
                if hasattr(block, "text"):
                    try:
                        return json.loads(block.text)
                    except json.JSONDecodeError:
                        # Try to extract JSON substring
                        text = block.text
                        start = text.find("{")
                        end = text.rfind("}") + 1
                        if start != -1 and end > start:
                            return json.loads(text[start:end])
            raise ValueError("Agent returned no parseable JSON.")

        if response.stop_reason != "tool_use":
            raise ValueError(f"Unexpected stop reason: {response.stop_reason}")

        # Process tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"[weather-agent] Tool call: {block.name}({json.dumps(block.input)[:80]})")
                result = dispatch_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result,
                })

        messages.append({"role": "user", "content": tool_results})


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    mode = check_run_mode()

    try:
        report = run_agent()
        report = validate_report(report)
    except Exception as e:
        print(f"[weather-agent] Agent error: {e}")
        sys.exit(1)

    report_date = report.get("date", date.today().isoformat())
    print(f"[weather-agent] Report generated for {report_date} with {len(report.get('events', []))} events.")

    render_report(report, mode=mode)
    print("[weather-agent] Done.")


if __name__ == "__main__":
    main()
