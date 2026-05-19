from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query

from src.api.dependencies.auth import get_bearer_token
from src.schemas.domain import IntakeRequest, ReviewDecision, ReviewDecisionCreate
from src.services.identity_service import IdentityService
from src.services.database_store import store

router = APIRouter(tags=["review"])


@router.get("/intake-requests", operation_id="listIntakeRequests")
async def list_intake_requests(
    status: Annotated[str | None, Query()] = None,
) -> dict[str, list[IntakeRequest]]:
    items = list(store.intake_requests.values())
    if status:
        items = [item for item in items if item.status == status]
    return {"items": items}


@router.post("/intake-requests/{intakeRequestId}/review", operation_id="reviewIntakeRequest")
async def review_intake_request(
    intakeRequestId: str,
    payload: ReviewDecisionCreate,
    token: Annotated[str | None, Depends(get_bearer_token)],
) -> ReviewDecision:
    user = await IdentityService().current_user(token)
    decision = store.review_request(intakeRequestId, payload, user.userId)
    if decision is None:
        raise HTTPException(status_code=404, detail="Intake request not found")
    return decision
