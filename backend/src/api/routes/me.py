from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from src.api.dependencies.auth import get_bearer_token
from src.schemas.user import UserContext
from src.services.identity_service import IdentityService

router = APIRouter(tags=["identity"])


@router.get("/me", operation_id="getCurrentUser", response_model=UserContext)
async def get_current_user(
    token: Annotated[str | None, Depends(get_bearer_token)],
) -> UserContext:
    return await IdentityService().current_user(token)
