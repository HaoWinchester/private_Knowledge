from __future__ import annotations

from src.models.enums import ConfidentialityLevel, KnowledgeStatus
from src.schemas.domain import KnowledgeCard
from src.services.database_store import store


class KnowledgeQueryService:
    def list(
        self,
        query: str | None = None,
        *,
        status: KnowledgeStatus | None = None,
        confidentiality_level: ConfidentialityLevel | None = None,
    ) -> list[KnowledgeCard]:
        return store.list_items(
            query,
            status=status,
            confidentiality_level=confidentiality_level,
        )
