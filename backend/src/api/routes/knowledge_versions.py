from __future__ import annotations

from fastapi import APIRouter, HTTPException

from src.schemas.domain import IntakeRequest, KnowledgeVersion, KnowledgeVersionCreate
from src.services.memory_store import store

router = APIRouter(tags=["knowledge"])


@router.get("/knowledge-items/{knowledgeItemId}/versions", operation_id="listKnowledgeVersions")
async def list_knowledge_versions(knowledgeItemId: str) -> dict[str, list[KnowledgeVersion]]:
    if knowledgeItemId not in store.items:
        raise HTTPException(status_code=404, detail="Knowledge item not found")
    return {"versions": store.versions.get(knowledgeItemId, [])}


@router.post(
    "/knowledge-items/{knowledgeItemId}/versions",
    operation_id="createKnowledgeVersion",
    status_code=202,
)
async def create_knowledge_version(
    knowledgeItemId: str, payload: KnowledgeVersionCreate
) -> IntakeRequest:
    request = store.create_version(knowledgeItemId, payload)
    if request is None:
        raise HTTPException(status_code=404, detail="Knowledge item not found")
    return request
