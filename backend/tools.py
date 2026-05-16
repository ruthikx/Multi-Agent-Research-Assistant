import asyncio
from typing import TypedDict

import httpx
from bs4 import BeautifulSoup
from tavily import TavilyClient

from backend.settings import get_settings


class SearchResult(TypedDict):
    title: str
    url: str
    snippet: str


async def web_search(query: str) -> list[SearchResult]:
    settings = get_settings()
    if not settings.tavily_api_key:
        raise RuntimeError("Missing TAVILY_API_KEY. Add it to backend/.env before running research.")

    client = TavilyClient(api_key=settings.tavily_api_key)

    def _search() -> list[SearchResult]:
        response = client.search(query=query, max_results=settings.max_search_results)
        return [
            {
                "title": item.get("title", "Untitled result"),
                "url": item.get("url", ""),
                "snippet": item.get("content", "").strip(),
            }
            for item in response.get("results", [])
        ]

    return await asyncio.to_thread(_search)


async def scrape_url(url: str) -> str:
    settings = get_settings()
    headers = {"User-Agent": settings.user_agent}

    async with httpx.AsyncClient(
        headers=headers,
        follow_redirects=True,
        timeout=settings.request_timeout,
    ) as client:
        response = await client.get(url)
        response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "svg"]):
        tag.decompose()

    text = soup.get_text(separator=" ", strip=True)
    compact_text = " ".join(text.split())
    return compact_text[: settings.max_scrape_chars]


def format_search_results(results: list[SearchResult]) -> str:
    if not results:
        return "No search results were returned."

    blocks = []
    for index, result in enumerate(results, start=1):
        blocks.append(
            "\n".join(
                [
                    f"{index}. {result['title']}",
                    f"URL: {result['url']}",
                    f"Snippet: {result['snippet'][:420]}",
                ]
            )
        )

    return "\n\n".join(blocks)
