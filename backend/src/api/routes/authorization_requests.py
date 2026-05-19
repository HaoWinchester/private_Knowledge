from __future__ import annotations

from fastapi import APIRouter, HTTPException

from src.schemas.domain import AuthorizationRequest, AuthorizationRequestCreate, AuthorizationReview
from src.services.memory_store import store

router = APIRouter(tags=["authorization"])


@router.post("/authorization-requests", operation_id="createAuthorizationRequest", status_code=202)
async def create_authorization_request(
    payload: AuthorizationRequestCreate,
) -> AuthorizationRequest:
    return store.create_authorization(payload)


@router.get("/authorization-requests", operation_id="listAuthorizationRequests")
async def list_authorization_requests() -> dict[str, list[AuthorizationRequest]]:
    return {"items": list(store.authorization_requests.values())}


@router.post(
    "/authorization-requests/{authorizationRequestId}/review",
    operation_id="reviewAuthorizationRequest",
)
async def review_authorization_request(
    authorizationRequestId: str,
    payload: AuthorizationReview,
) -> AuthorizationRequest:
    request = store.review_authorization(authorizationRequestId, payload)
    if request is None:
        raise HTTPException(status_code=404, detail="Authorization request not found")
    return request
