from __future__ import annotations

from src.schemas.domain import QARequest, QAResponse
from src.services.database_store import store


class QAService:
    def answer(self, payload: QARequest) -> QAResponse:
        return store.answer(payload)
