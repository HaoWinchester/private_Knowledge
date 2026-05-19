from __future__ import annotations

from src.schemas.domain import AuditEvent
from src.services.memory_store import store


class AuditQueryService:
    def list_events(self) -> list[AuditEvent]:
        return list(store.audit_events.values())
