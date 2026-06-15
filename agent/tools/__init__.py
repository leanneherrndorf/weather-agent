from .open_meteo import get_weather_extremes
from .noaa_alerts import get_noaa_alerts
from .geological import get_significant_earthquakes
from .web_search import search_weather_news

__all__ = [
    "get_weather_extremes",
    "get_noaa_alerts",
    "get_significant_earthquakes",
    "search_weather_news",
]
