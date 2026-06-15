"""
JSON renderer — writes the agent's report as JSON files consumed by the React site.

Writes:
  site/public/data/YYYY-MM-DD.json   — full report data
  site/public/data/index.json        — archive index (date + headline for each report)
"""

import json
import re
from datetime import date
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent.parent / "site" / "public" / "data"


def render_report(report: dict, mode: str = "scheduled") -> None:
    """Write the daily report JSON and regenerate the index."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    report_date = report.get("date", date.today().isoformat())

    # Validate date format to prevent path traversal
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(report_date)):
        raise ValueError(f"Invalid date in report: {report_date!r}")

    # Write the full report
    report_path = DATA_DIR / f"{report_date}.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"[renderer] Wrote {report_path}")

    # Regenerate index.json
    _render_index(report_date, report.get("headline", ""))


def _render_index(latest_date: str, latest_headline: str) -> None:
    """
    Rebuild index.json from all report files in the data directory.
    Sorted newest first.
    """
    index_path = DATA_DIR / "index.json"

    # Load existing index if present
    existing: list[dict] = []
    if index_path.exists():
        try:
            existing = json.loads(index_path.read_text())["reports"]
        except Exception:
            existing = []

    # Upsert the latest entry
    dates = {r["date"]: r for r in existing}
    dates[latest_date] = {"date": latest_date, "headline": latest_headline}

    reports = sorted(dates.values(), key=lambda r: r["date"], reverse=True)
    index_path.write_text(json.dumps({"reports": reports}, indent=2), encoding="utf-8")
    print(f"[renderer] Updated {index_path}")
