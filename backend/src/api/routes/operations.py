from __future__ import annotations

from fastapi import APIRouter

from src.schemas.domain import OperationsSummary
from src.services.memory_store import store

router = APIRouter(tags=["operations"])


@router.get("/operations/summary", operation_id="getOperationsSummary")
async def get_operations_summary() -> OperationsSummary:
    return store.operations_summary()
