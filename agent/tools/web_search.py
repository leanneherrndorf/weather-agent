"""
Web search tool — wraps the Tavily Search API to find news articles
about specific weather events.

Requires TAVILY_API_KEY environment variable.
Free tier: 1,000 searches/month. Sign up at https://tavily.com/
Falls back to a structured error if no key is configured.
"""

import os
from typing import Any

try:
    from tavily import TavilyClient
except ImportError:
    TavilyClient = None  # type: ignore


def search_weather_news(query: str, count: int = 3) -> list[dict[str, Any]]:
    """
    Search for recent news articles about a weather event.

    Args:
        query: Search query, e.g. "hurricane beryl texas landfall"
        count: Number of results to return (1-5 recommended)

    Returns:
        List of articles with title, url, description, and source.
    """
    if TavilyClient is None:
        return [{"error": "tavily-python not installed. Run: pip install tavily-python"}]

    api_key = os.environ.get("TAVILY_API_KEY", "")
    if not api_key:
        return [{"error": "TAVILY_API_KEY not set — skipping web search for this event."}]

    try:
        client = TavilyClient(api_key=api_key)
        response = client.search(
            query=query[:200],
            search_depth="basic",
            topic="news",
            days=7,
            max_results=min(count, 5),
        )
    except Exception as e:
        print(f"[web_search] Error: {e}")
        return [{"error": "Search request failed."}]

    articles = []
    for item in response.get("results", []):
        url = item.get("url", "")
        source = url.split("/")[2] if url.startswith("http") else ""
        articles.append({
            "title": item.get("title", ""),
            "url": url,
            "description": item.get("content", "")[:200],
            "source": source,
        })
    return articles
