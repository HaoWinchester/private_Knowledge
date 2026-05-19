from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base
from src.models.enums import UserStatus
from src.models.mixins import TimestampMixin


class UserIdentity(TimestampMixin, Base):
    __tablename__ = "user_identities"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    external_subject: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(128), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255))
    department_id: Mapped[str] = mapped_column(String(64), nullable=False)
    department_name: Mapped[str | None] = mapped_column(String(128))
    roles: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default=UserStatus.ACTIVE.value, nullable=False)
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
