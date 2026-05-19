from __future__ import annotations

from fastapi import APIRouter

from src.schemas.domain import QARequest, QAResponse
from src.services.memory_store import store
from src.services.model_answer_service import enhance_qa_answer

router = APIRouter(tags=["qa"])


@router.post("/qa", operation_id="answerQuestion")
async def answer_question(payload: QARequest) -> QAResponse:
    response = store.answer(payload)
    return await enhance_qa_answer(payload, response)
