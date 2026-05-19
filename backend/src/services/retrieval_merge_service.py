from __future__ import annotations

from src.schemas.domain import KnowledgeCard


class RetrievalMergeService:
    def merge(self, *groups: list[KnowledgeCard]) -> list[KnowledgeCard]:
        merged: dict[str, KnowledgeCard] = {}
        for group in groups:
            for item in group:
                merged[item.id] = item
        return list(merged.values())
