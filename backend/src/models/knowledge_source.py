from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base
from src.models.mixins import TimestampMixin


class KnowledgeSource(TimestampMixin, Base):
    __tablename__ = "knowledge_sources"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    source_type: Mapped[str] = mapped_column(String(64), nullable=False)
    uri: Mapped[str | None] = mapped_column(String(1024))
    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    checksum: Mapped[str | None] = mapped_column(String(128))
    external_last_modified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    access_status: Mapped[str] = mapped_column(String(32), default="available", nullable=False)
    submitted_by_user_id: Mapped[str | None] = mapped_column(String(64))
