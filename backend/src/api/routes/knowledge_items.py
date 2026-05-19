from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query

from src.api.dependencies.auth import get_bearer_token
from src.models.enums import ConfidentialityLevel, KnowledgeStatus
from src.schemas.domain import (
    IntakeRequest,
    KnowledgeCard,
    KnowledgeItemDetail,
    KnowledgeItemUpdate,
    KnowledgeSubmissionCreate,
)
from src.services.identity_service import IdentityService
from src.services.memory_store import store

router = APIRouter(tags=["knowledge"])


@router.get("/knowledge-items", operation_id="listKnowledgeItems")
async def list_knowledge_items(
    q: Annotated[str | None, Query()] = None,
    status: Annotated[KnowledgeStatus | None, Query()] = None,
    confidentialityLevel: Annotated[ConfidentialityLevel | None, Query()] = None,
) -> dict[str, list[KnowledgeCard]]:
    return {
        "items": store.list_items(
            q,
            status=status,
            confidentiality_level=confidentialityLevel,
        )
    }


@router.post("/knowledge-items", operation_id="createKnowledgeSubmission", status_code=202)
async def create_knowledge_submission(
    payload: KnowledgeSubmissionCreate,
    token: Annotated[str | None, Depends(get_bearer_token)],
) -> IntakeRequest:
    user = await IdentityService().current_user(token)
    return store.create_submission(payload, submitter_user_id=user.userId)


@router.get(
    "/knowledge-items/{knowledgeItemId}",
    operation_id="getKnowledgeItem",
    response_model=KnowledgeItemDetail,
)
async def get_knowledge_item(knowledgeItemId: str) -> KnowledgeItemDetail:
    item = store.get_item(knowledgeItemId)
    if item is None:
        raise HTTPException(status_code=404, detail="Knowledge item not found")
    return item


@router.patch("/knowledge-items/{knowledgeItemId}", operation_id="updateKnowledgeItem", status_code=202)
async def update_knowledge_item(knowledgeItemId: str, payload: KnowledgeItemUpdate) -> IntakeRequest:
    request = store.update_item(knowledgeItemId, payload)
    if request is None:
        raise HTTPException(status_code=404, detail="Knowledge item not found")
    return request
