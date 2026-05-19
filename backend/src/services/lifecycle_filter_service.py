from __future__ import annotations

from src.models.enums import KnowledgeStatus
from src.schemas.domain import KnowledgeCard


class LifecycleFilterService:
    reusable_statuses = {KnowledgeStatus.PUBLISHED, KnowledgeStatus.RESTORED}

    def reusable(self, items: list[KnowledgeCard]) -> list[KnowledgeCard]:
        return [item for item in items if item.status in self.reusable_statuses]
