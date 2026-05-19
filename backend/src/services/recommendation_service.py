from __future__ import annotations

from src.schemas.domain import KnowledgeCard
from src.services.database_store import store


class RecommendationService:
    def recommend(self, query: str | None = None) -> list[KnowledgeCard]:
        return store.list_items(query, published_only=True)[:5]
