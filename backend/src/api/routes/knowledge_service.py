from __future__ import annotations

from fastapi import APIRouter

from src.schemas.domain import KnowledgeServiceRequest, KnowledgeServiceResponse
from src.services.memory_store import store
from src.services.model_answer_service import enhance_knowledge_service_answer

router = APIRouter(tags=["knowledge-service"])


@router.post("/knowledge-service/query", operation_id="queryKnowledgeService")
async def query_knowledge_service(payload: KnowledgeServiceRequest) -> KnowledgeServiceResponse:
    response = store.knowledge_service(payload)
    if payload.requestType == "qa":
        return await enhance_knowledge_service_answer(payload.input, response)
    return response


@router.post("/api/v1/knowledge/query", operation_id="queryKnowledgeServiceV1Alias")
async def query_knowledge_service_alias(
    payload: KnowledgeServiceRequest,
) -> KnowledgeServiceResponse:
    response = store.knowledge_service(payload)
    if payload.requestType == "qa":
        return await enhance_knowledge_service_answer(payload.input, response)
    return response
