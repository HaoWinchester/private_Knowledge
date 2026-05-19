from __future__ import annotations

from src.core.errors import ValidationAppError
from src.schemas.domain import KnowledgeSubmissionCreate


class SubmissionValidationService:
    def validate(self, payload: KnowledgeSubmissionCreate) -> None:
        if not payload.title.strip():
            raise ValidationAppError("title is required")
        if not payload.summary.strip():
            raise ValidationAppError("summary is required")
        if not payload.applicableScope.strip():
            raise ValidationAppError("applicableScope is required")
