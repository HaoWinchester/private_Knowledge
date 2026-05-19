from __future__ import annotations

from src.schemas.domain import QualitySignal, QualitySignalCreate
from src.services.database_store import store


class QualitySignalService:
    def create(self, payload: QualitySignalCreate) -> QualitySignal:
        return store.create_quality_signal(payload)
