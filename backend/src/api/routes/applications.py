from __future__ import annotations

from fastapi import APIRouter, HTTPException

from src.schemas.domain import ApplicationKeyRotationResponse, ApplicationSummary
from src.services.memory_store import store

router = APIRouter(tags=["applications"])


@router.get("/applications", operation_id="listApplications")
async def list_applications() -> dict[str, list[ApplicationSummary]]:
    return {"items": list(store.applications.values())}


@router.post(
    "/applications/{applicationId}/keys/rotate",
    operation_id="rotateApplicationKey",
)
async def rotate_application_key(applicationId: str) -> ApplicationKeyRotationResponse:
    response = store.rotate_key(applicationId)
    if response is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return response
