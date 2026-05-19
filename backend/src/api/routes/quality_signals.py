from __future__ import annotations

from fastapi import APIRouter

from src.schemas.domain import QualitySignal, QualitySignalCreate
from src.services.memory_store import store

router = APIRouter(tags=["quality"])


@router.post("/quality-signals", operation_id="createQualitySignal", status_code=201)
async def create_quality_signal(payload: QualitySignalCreate) -> QualitySignal:
    return store.create_quality_signal(payload)
