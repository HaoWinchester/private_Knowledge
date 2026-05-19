from __future__ import annotations

from fastapi import APIRouter

from src.schemas.domain import AuditEvent
from src.services.memory_store import store

router = APIRouter(tags=["audit"])


@router.get("/audit-events", operation_id="queryAuditEvents")
async def query_audit_events() -> dict[str, list[AuditEvent]]:
    return {"items": list(store.audit_events.values())}
