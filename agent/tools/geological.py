"""
Geological events tool — fetches significant earthquakes from the USGS
Earthquake Hazards Program.

No API key required. Covers global seismic events.
Volcanoes and other geological events are handled via web search.
"""

import urllib.request
import json
from datetime import datetime, timezone
from typing import Any

# Significant earthquakes from the past 7 days (magnitude 4.5+, globally significant)
USGS_SIGNIFICANT_WEEK = (
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"
)

# Fallback: magnitude 4.5+ worldwide past day (catches more events)
USGS_M45_DAY = (
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"
)


def get_significant_earthquakes() -> list[dict[str, Any]]:
    """
    Fetch significant earthquakes from the past 7 days via USGS GeoJSON feed.
    Falls back to magnitude 4.5+ events from the past 24 hours if the
    significant feed is empty.

    Returns a list of earthquakes sorted by magnitude (highest first).
    """
    results = _fetch_usgs(USGS_SIGNIFICANT_WEEK)

    # If no significant events this week, widen to M4.5+ in last 24h
    if not results:
        results = _fetch_usgs(USGS_M45_DAY)

    results.sort(key=lambda e: e.get("magnitude", 0), reverse=True)
    return results[:10]  # Cap at 10 events


def _fetch_usgs(url: str) -> list[dict[str, Any]]:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "weather-agent-portfolio/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
    except Exception as e:
        print(f"[geological] Error fetching {url}: {e}")
        return [{"error": "Failed to fetch USGS earthquake data."}]

    events = []
    for feature in data.get("features", []):
        props = feature.get("properties", {})
        coords = feature.get("geometry", {}).get("coordinates", [None, None, None])

        # Convert epoch ms to ISO date string
        epoch_ms = props.get("time")
        time_str = ""
        if epoch_ms:
            time_str = datetime.fromtimestamp(
                epoch_ms / 1000, tz=timezone.utc
            ).strftime("%Y-%m-%d %H:%M UTC")

        url = str(props.get("url", ""))
        if not url.startswith("https://"):
            url = ""

        magnitude = props.get("mag")
        depth = coords[2]

        events.append({
            "title": str(props.get("title", ""))[:200],
            "magnitude": float(magnitude) if isinstance(magnitude, (int, float)) else None,
            "place": str(props.get("place", ""))[:200],
            "time": time_str,
            "depth_km": float(depth) if isinstance(depth, (int, float)) else None,
            "tsunami_alert": bool(props.get("tsunami")),
            "url": url,
            "felt_reports": props.get("felt"),
            "alert_level": str(props.get("alert", ""))[:20] or None,
        })

    return events
