"""
NOAA/NWS alerts tool — fetches active major/extreme weather alerts
from the NWS CAP (Common Alerting Protocol) API.

Note: NWS covers the US and territories only. The agent uses web search
for international events.
"""

import urllib.request
import json
from typing import Any

NWS_API = "https://api.weather.gov/alerts/active"

# Severity levels to include
INCLUDE_SEVERITY = {"Extreme", "Severe"}

# Event types that are weather-significant
INCLUDE_EVENTS = {
    "Tornado Warning",
    "Tornado Watch",
    "Hurricane Warning",
    "Hurricane Watch",
    "Tropical Storm Warning",
    "Typhoon Warning",
    "Blizzard Warning",
    "Ice Storm Warning",
    "Flash Flood Emergency",
    "Flash Flood Warning",
    "Extreme Wind Warning",
    "High Wind Warning",
    "Dust Storm Warning",
    "Excessive Heat Warning",
    "Wind Chill Warning",
    "Winter Storm Warning",
    "Severe Thunderstorm Warning",
    "Storm Surge Warning",
}


def get_noaa_alerts() -> list[dict[str, Any]]:
    """
    Fetch active NWS alerts filtered to severe/extreme severity.
    Returns a deduplicated list of significant alert events.
    """
    headers = {
        "User-Agent": "weather-agent-portfolio/1.0 (github.com/your-username/weather-agent)",
        "Accept": "application/geo+json",
    }
    req = urllib.request.Request(NWS_API, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
    except Exception as e:
        print(f"[noaa_alerts] Error: {e}")
        return [{"error": "Failed to fetch NWS alerts."}]

    alerts = []
    seen_events: set[str] = set()

    for feature in data.get("features", []):
        props = feature.get("properties", {})
        severity = props.get("severity", "")
        event = props.get("event", "")

        if severity not in INCLUDE_SEVERITY and event not in INCLUDE_EVENTS:
            continue

        # Deduplicate by event + area
        area = props.get("areaDesc", "")
        key = f"{event}::{area[:40]}"
        if key in seen_events:
            continue
        seen_events.add(key)

        alerts.append({
            "event": str(event)[:100],
            "severity": str(severity)[:20],
            "area": str(area)[:200],
            "headline": str(props.get("headline", ""))[:300],
            "description": str(props.get("description") or "")[:400],
            "onset": str(props.get("onset", ""))[:30],
            "expires": str(props.get("expires", ""))[:30],
            "sender": str(props.get("senderName", ""))[:100],
        })

    # Sort by severity (Extreme first)
    alerts.sort(key=lambda a: 0 if a.get("severity") == "Extreme" else 1)
    return alerts
