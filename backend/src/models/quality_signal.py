from __future__ import annotations

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base
from src.models.mixins import IdMixin, TimestampMixin


class QualitySignal(IdMixin, TimestampMixin, Base):
    __tablename__ = "quality_signals"

    knowledge_item_id: Mapped[str] = mapped_column(ForeignKey("knowledge_items.id"), index=True)
    signal_type: Mapped[str] = mapped_column(String(64), index=True)
    value: Mapped[str | None] = mapped_column(String(128))
    comment: Mapped[str | None] = mapped_column(Text)
