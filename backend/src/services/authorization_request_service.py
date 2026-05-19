from __future__ import annotations

from src.schemas.domain import AuthorizationRequest, AuthorizationRequestCreate
from src.services.memory_store import store


class AuthorizationRequestService:
    def create(self, payload: AuthorizationRequestCreate) -> AuthorizationRequest:
        return store.create_authorization(payload)
