from __future__ import annotations

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base
from src.models.mixins import IdMixin, TimestampMixin


class Citation(IdMixin, TimestampMixin, Base):
    __tablename__ = "citations"

    knowledge_item_id: Mapped[str] = mapped_column(ForeignKey("knowledge_items.id"), index=True)
    knowledge_version_id: Mapped[str] = mapped_column(
        ForeignKey("knowledge_versions.id"), index=True
    )
    fragment_ref: Mapped[str | None] = mapped_column(String(255))
    citation_type: Mapped[str] = mapped_column(String(64), index=True)
    generated_output_ref: Mapped[str | None] = mapped_column(String(255))
    retained_until: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True))
