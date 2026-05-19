from __future__ import annotations

from src.schemas.domain import KnowledgeSubmissionCreate
from src.services.memory_store import store


class DuplicatePrecheckService:
    def find_duplicates(self, payload: KnowledgeSubmissionCreate) -> list[str]:
        return [
            item.id
            for item in store.items.values()
            if item.title.strip().lower() == payload.title.strip().lower()
        ]
