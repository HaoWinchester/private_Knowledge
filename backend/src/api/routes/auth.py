from __future__ import annotations

from fastapi import APIRouter, HTTPException

from src.schemas.auth import AuthResponse, LoginRequest, RegisterRequest
from src.services.database_store import store

router = APIRouter(prefix="/auth", tags=["identity"])


@router.post("/register", operation_id="registerUser", status_code=201)
async def register_user(payload: RegisterRequest) -> AuthResponse:
    try:
        return store.register_user(payload)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@router.post("/login", operation_id="loginUser")
async def login_user(payload: LoginRequest) -> AuthResponse:
    response = store.login_user(payload)
    if response is None:
        raise HTTPException(status_code=401, detail="邮箱或密码不正确")
    return response
