from __future__ import annotations

from typing import Literal

from src.schemas.base import APIModel
from src.schemas.user import UserContext


class LoginRequest(APIModel):
    email: str
    password: str


class RegisterRequest(APIModel):
    email: str
    password: str
    displayName: str
    departmentName: str
    role: Literal["knowledge_admin", "domain_expert", "security_admin", "employee"] = "employee"


class AuthResponse(APIModel):
    token: str
    user: UserContext
