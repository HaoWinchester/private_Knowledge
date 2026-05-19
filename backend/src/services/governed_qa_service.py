from __future__ import annotations

from src.schemas.domain import QARequest, QAResponse
from src.services.database_store import store


class GovernedQAService:
    def answer(self, question: str, business_context: str) -> QAResponse:
        return store.answer(QARequest(question=question, businessContext=business_context))
