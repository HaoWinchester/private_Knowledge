from __future__ import annotations

from src.models.enums import OperationResult
from src.schemas.domain import AuditEvent
from src.services.database_store import store


class KnowledgeServiceLogService:
    def log(self, application_id: str, requester_user_id: str, context: str) -> AuditEvent:
        return store.audit(
            "service_call",
            result=OperationResult.SUCCESS,
            actor_user_id=requester_user_id,
            application_id=application_id,
            context=context,
        )
