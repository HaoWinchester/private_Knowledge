from __future__ import annotations

from fastapi import APIRouter

from src.schemas.domain import ApplicationPolicyState, ApplicationPolicyUpdate
from src.services.memory_store import store

router = APIRouter(tags=["applications"])


@router.get("/application-policies", operation_id="getApplicationPolicies")
async def get_application_policies() -> ApplicationPolicyState:
    return store.application_policies


@router.patch("/application-policies", operation_id="updateApplicationPolicies")
async def update_application_policies(payload: ApplicationPolicyUpdate) -> ApplicationPolicyState:
    return store.update_policies(payload)
