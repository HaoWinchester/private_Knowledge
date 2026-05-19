from __future__ import annotations

from src.schemas.domain import OperationsSummary
from src.services.memory_store import store


class OperationsStatsService:
    def summary(self) -> OperationsSummary:
        return store.operations_summary()
