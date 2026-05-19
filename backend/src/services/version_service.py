from __future__ import annotations

from src.schemas.domain import IntakeRequest, KnowledgeVersionCreate
from src.services.memory_store import store


class VersionService:
    def submit_version(self, item_id: str, payload: KnowledgeVersionCreate) -> IntakeRequest | None:
        return store.create_version(item_id, payload)
