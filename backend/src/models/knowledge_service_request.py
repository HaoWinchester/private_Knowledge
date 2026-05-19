from __future__ import annotations

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base
from src.models.mixins import IdMixin, TimestampMixin


class KnowledgeServiceRequest(IdMixin, TimestampMixin, Base):
    __tablename__ = "knowledge_service_requests"

    application_id: Mapped[str] = mapped_column(String(128), index=True)
    requester_user_id: Mapped[str] = mapped_column(String(128), index=True)
    request_type: Mapped[str] = mapped_column(String(32), index=True)
    business_context: Mapped[str] = mapped_column(Text)
    project_context: Mapped[str | None] = mapped_column(String(255))
    input: Mapped[str] = mapped_column(Text)
    result: Mapped[str] = mapped_column(String(32), index=True)
    audit_event_id: Mapped[str | None] = mapped_column(String(64), index=True)
    retained_until: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True))
