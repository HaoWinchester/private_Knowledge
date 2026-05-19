from __future__ import annotations

from src.schemas.base import APIModel


class UserContext(APIModel):
    userId: str
    displayName: str
    departmentId: str
    departmentName: str | None = None
    roles: list[str]
