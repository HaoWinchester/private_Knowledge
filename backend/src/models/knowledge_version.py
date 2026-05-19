from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Date, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base
from src.models.mixins import TimestampMixin


class KnowledgeVersion(TimestampMixin, Base):
    __tablename__ = "knowledge_versions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    knowledge_item_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)
    change_summary: Mapped[str | None] = mapped_column(Text)
    content_object_key: Mapped[str | None] = mapped_column(String(512))
    extracted_text_object_key: Mapped[str | None] = mapped_column(String(512))
    sanitized_text_object_key: Mapped[str | None] = mapped_column(String(512))
    effective_status: Mapped[str] = mapped_column(String(32), default="draft", nullable=False)
    created_by_user_id: Mapped[str | None] = mapped_column(String(64))
    effective_from: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    retention_until: Mapped[date | None] = mapped_column(Date)
