from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(tags=["system"])


@router.get("/health", operation_id="getHealth")
async def get_health() -> dict[str, str]:
    return {"status": "ok"}
