from __future__ import annotations

from fastapi import APIRouter

from src.schemas.domain import KnowledgeServiceRequest, KnowledgeServiceResponse
from src.services.memory_store import store

router = APIRouter(tags=["knowledge-service"])


@router.post("/knowledge-service/query", operation_id="queryKnowledgeService")
async def query_knowledge_service(payload: KnowledgeServiceRequest) -> KnowledgeServiceResponse:
    return store.knowledge_service(payload)


@router.post("/api/v1/knowledge/query", operation_id="queryKnowledgeServiceV1Alias")
async def query_knowledge_service_alias(payload: KnowledgeServiceRequest) -> KnowledgeServiceResponse:
    return store.knowledge_service(payload)
