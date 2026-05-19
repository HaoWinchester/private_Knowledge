from __future__ import annotations

from src.schemas.domain import KnowledgeCard
from src.services.memory_store import store


class FullTextSearchService:
    def search(self, query: str) -> list[KnowledgeCard]:
        return store.list_items(query, published_only=True)
