from __future__ import annotations

from src.schemas.domain import KnowledgeCard
from src.services.database_store import store


class GovernedRecommendationService:
    def recommend(self, input_text: str) -> list[KnowledgeCard]:
        return store.list_items(input_text, published_only=True)[:3]
