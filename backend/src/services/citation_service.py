from __future__ import annotations

from src.schemas.domain import Citation, KnowledgeCard


class CitationService:
    def from_items(self, items: list[KnowledgeCard], citation_type: str = "qa_source") -> list[Citation]:
        return [
            Citation(
                knowledgeItemId=item.id,
                knowledgeVersionId=item.currentVersionId,
                fragmentRef="preview",
                citationType=citation_type,
            )
            for item in items
        ]
