from __future__ import annotations

from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from src.models.audit_event import AuditEvent
from src.models.enums import AuditEventType, OperationResult
from src.services.retention_service import retention_until


class AuditService:
    def __init__(self, session: AsyncSession | None = None):
        self.session = session

    async def append(
        self,
        *,
        event_type: AuditEventType,
        result: OperationResult,
        actor_user_id: str | None = None,
        application_id: str | None = None,
        knowledge_item_id: str | None = None,
        operation_context: str | None = None,
        reason: str | None = None,
    ) -> AuditEvent:
        event = AuditEvent(
            id=str(uuid4()),
            actor_user_id=actor_user_id,
            application_id=application_id,
            knowledge_item_id=knowledge_item_id,
            event_type=event_type.value,
            result=result.value,
            operation_context=operation_context,
            reason=reason,
            retention_until=retention_until(),
        )
        if self.session is not None:
            self.session.add(event)
        return event
