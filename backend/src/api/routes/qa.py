from __future__ import annotations

from fastapi import APIRouter

from src.schemas.domain import QARequest, QAResponse
from src.services.memory_store import store

router = APIRouter(tags=["qa"])


@router.post("/qa", operation_id="answerQuestion")
async def answer_question(payload: QARequest) -> QAResponse:
    return store.answer(payload)
