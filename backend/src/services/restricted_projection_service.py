from __future__ import annotations

from src.schemas.domain import KnowledgeCard, KnowledgeItemDetail


class RestrictedProjectionService:
    def metadata_only(self, item: KnowledgeItemDetail) -> KnowledgeCard:
        return KnowledgeCard(**item.model_dump(exclude={"contentPreview", "versions", "permissions"}))
