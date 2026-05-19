from __future__ import annotations

from fastapi import APIRouter

from src.schemas.domain import BusinessActionBinding, BusinessActionBindingCreate
from src.services.memory_store import store

router = APIRouter(tags=["knowledge"])


@router.post(
    "/business-action-bindings",
    operation_id="createBusinessActionBinding",
    status_code=201,
)
async def create_business_action_binding(
    payload: BusinessActionBindingCreate,
) -> BusinessActionBinding:
    return store.create_business_binding(payload)
