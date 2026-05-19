from __future__ import annotations

from dataclasses import dataclass

from src.core.settings import get_settings


@dataclass(frozen=True)
class QdrantVectorClient:
    url: str

    @classmethod
    def from_settings(cls) -> "QdrantVectorClient":
        return cls(url=get_settings().qdrant_url)
