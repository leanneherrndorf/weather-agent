"""
Open-Meteo tool — fetches global weather extremes for the current day.

Uses the Open-Meteo API (no key required). Samples a grid of major cities
worldwide to identify temperature, precipitation, and wind anomalies.
"""

import urllib.request
import json
from datetime import date
from typing import Any

# Representative sample of major cities worldwide
# (name, latitude, longitude)
SAMPLE_CITIES: list[tuple[str, float, float]] = [
    ("New York", 40.71, -74.01),
    ("Los Angeles", 34.05, -118.24),
    ("Chicago", 41.88, -87.63),
    ("Miami", 25.77, -80.19),
    ("São Paulo", -23.55, -46.63),
    ("Buenos Aires", -34.60, -58.38),
    ("London", 51.51, -0.13),
    ("Paris", 48.85, 2.35),
    ("Berlin", 52.52, 13.40),
    ("Moscow", 55.75, 37.62),
    ("Cairo", 30.06, 31.25),
    ("Lagos", 6.45, 3.39),
    ("Nairobi", -1.29, 36.82),
    ("Cape Town", -33.93, 18.42),
    ("Dubai", 25.20, 55.27),
    ("Mumbai", 19.08, 72.88),
    ("Delhi", 28.66, 77.23),
    ("Dhaka", 23.81, 90.41),
    ("Beijing", 39.91, 116.39),
    ("Shanghai", 31.23, 121.47),
    ("Tokyo", 35.69, 139.69),
    ("Seoul", 37.57, 126.98),
    ("Bangkok", 13.75, 100.52),
    ("Jakarta", -6.21, 106.85),
    ("Sydney", -33.87, 151.21),
    ("Auckland", -36.86, 174.76),
    ("Anchorage", 61.22, -149.90),
    ("Reykjavik", 64.13, -21.90),
    ("Singapore", 1.35, 103.82),
    ("Karachi", 24.86, 67.01),
]

BASE_URL = "https://api.open-meteo.com/v1/forecast"


def _fetch_city(name: str, lat: float, lon: float) -> dict[str, Any] | None:
    """Fetch today's weather summary for a single city."""
    today = date.today().isoformat()
    params = (
        f"latitude={lat}&longitude={lon}"
        f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max"
        f"&start_date={today}&end_date={today}"
        f"&timezone=auto"
    )
    url = f"{BASE_URL}?{params}"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read())
        daily = data.get("daily", {})
        return {
            "city": name,
            "lat": lat,
            "lon": lon,
            "temp_max_c": daily.get("temperature_2m_max", [None])[0],
            "temp_min_c": daily.get("temperature_2m_min", [None])[0],
            "precipitation_mm": daily.get("precipitation_sum", [None])[0],
            "windspeed_max_kmh": daily.get("windspeed_10m_max", [None])[0],
        }
    except Exception:
        return None


def get_weather_extremes() -> list[dict[str, Any]]:
    """
    Returns weather data for all sample cities, sorted by most extreme
    conditions (high temp, high precipitation, high wind).
    """
    results = []
    for name, lat, lon in SAMPLE_CITIES:
        data = _fetch_city(name, lat, lon)
        if data:
            results.append(data)

    # Sort by a composite extremity score
    def extremity_score(d: dict) -> float:
        score = 0.0
        if d["temp_max_c"] is not None:
            # Flag temps above 38°C or below -20°C as extreme
            score += max(0, d["temp_max_c"] - 38) * 2
            score += max(0, -20 - d["temp_min_c"]) * 2
        if d["precipitation_mm"] is not None:
            score += d["precipitation_mm"] * 0.5
        if d["windspeed_max_kmh"] is not None:
            score += max(0, d["windspeed_max_kmh"] - 60) * 0.3
        return score

    results.sort(key=extremity_score, reverse=True)
    return results
