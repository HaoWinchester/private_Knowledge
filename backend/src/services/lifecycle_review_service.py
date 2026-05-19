from __future__ import annotations

from datetime import date, timedelta

from src.schemas.domain import KnowledgeCard
from src.services.memory_store import store


class LifecycleReviewService:
    def expiring_soon(self, days: int = 30) -> list[KnowledgeCard]:
        _deadline = date.today() + timedelta(days=days)
        return store.list_items(published_only=True)[:3]
