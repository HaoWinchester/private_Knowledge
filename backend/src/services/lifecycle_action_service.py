from __future__ import annotations

from src.models.enums import KnowledgeStatus
from src.schemas.domain import KnowledgeItemUpdate, IntakeRequest
from src.services.database_store import store


class LifecycleActionService:
    def mark_removed(self, item_id: str) -> IntakeRequest | None:
        item = store.items.get(item_id)
        if item is None:
            return None
        item.status = KnowledgeStatus.REMOVED
        store.audit("lifecycle_change", knowledge_item_id=item_id, context="remove")
        return store.update_item(item_id, KnowledgeItemUpdate(reason="lifecycle_remove"))
