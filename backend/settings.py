import os
from dataclasses import dataclass
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "Multi-Agent Research API")
    app_env: str = os.getenv("APP_ENV", "development")
    mistral_api_key: str | None = os.getenv("MISTRAL_API_KEY")
    mistral_model: str = os.getenv("MISTRAL_MODEL", "mistral-large-latest")
    tavily_api_key: str | None = os.getenv("TAVILY_API_KEY")
    cors_origins_raw: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    )
    request_timeout: float = float(os.getenv("REQUEST_TIMEOUT", "12"))
    max_search_results: int = int(os.getenv("MAX_SEARCH_RESULTS", "5"))
    max_scrape_chars: int = int(os.getenv("MAX_SCRAPE_CHARS", "6000"))
    scrape_source_limit: int = int(os.getenv("SCRAPE_SOURCE_LIMIT", "3"))
    user_agent: str = os.getenv(
        "USER_AGENT",
        "Mozilla/5.0 (compatible; MultiAgentResearchBot/1.0; +https://localhost)",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
