from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base
from src.models.enums import AuthorizationStatus
from src.models.mixins import TimestampMixin


class AuthorizationRequest(TimestampMixin, Base):
    __tablename__ = "authorization_requests"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    knowledge_item_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    requester_user_id: Mapped[str | None] = mapped_column(String(64), index=True)
    application_id: Mapped[str | None] = mapped_column(String(64), index=True)
    requested_permission: Mapped[str] = mapped_column(String(64), nullable=False)
    business_context: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(
        String(32), default=AuthorizationStatus.SUBMITTED.value, nullable=False
    )
    reviewer_user_id: Mapped[str | None] = mapped_column(String(64))
    review_comment: Mapped[str | None] = mapped_column(Text)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
