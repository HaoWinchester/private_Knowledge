from __future__ import annotations

from src.models.enums import KnowledgeStatus
from src.schemas.domain import KnowledgeItemDetail


class PublicationService:
    def publish(self, item: KnowledgeItemDetail) -> KnowledgeItemDetail:
        item.status = KnowledgeStatus.PUBLISHED
        return item
