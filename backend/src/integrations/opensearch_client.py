from __future__ import annotations

from dataclasses import dataclass

from src.core.settings import get_settings


@dataclass(frozen=True)
class OpenSearchClient:
    url: str

    @classmethod
    def from_settings(cls) -> "OpenSearchClient":
        return cls(url=get_settings().opensearch_url)
