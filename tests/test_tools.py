"""
Basic smoke tests for data tools.
Run with: python -m pytest tests/ -v
"""

import pytest
from agent.tools.open_meteo import get_weather_extremes
from agent.tools.noaa_alerts import get_noaa_alerts
from agent.tools.web_search import search_weather_news


def test_open_meteo_returns_results():
    results = get_weather_extremes()
    assert isinstance(results, list)
    assert len(results) > 0
    first = results[0]
    assert "city" in first
    assert "temp_max_c" in first


def test_noaa_alerts_returns_list():
    alerts = get_noaa_alerts()
    assert isinstance(alerts, list)
    # Each item should have 'event' or 'error'
    for alert in alerts:
        assert "event" in alert or "error" in alert


def test_web_search_without_key():
    # Without API key, should return error dict, not raise
    results = search_weather_news("test query")
    assert isinstance(results, list)
    # Either results or an error dict
    for r in results:
        assert isinstance(r, dict)
