from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base
from src.models.mixins import TimestampMixin


class ClassificationAssignment(TimestampMixin, Base):
    __tablename__ = "classification_assignments"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    knowledge_item_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    dimension: Mapped[str] = mapped_column(String(64), nullable=False)
    value: Mapped[str] = mapped_column(String(255), nullable=False)
    assigned_by_user_id: Mapped[str | None] = mapped_column(String(64))
