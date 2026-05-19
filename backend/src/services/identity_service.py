from __future__ import annotations

from src.integrations.identity_stub import IdentityStubClient
from src.schemas.user import UserContext
from src.services.database_store import store


class IdentityService:
    def __init__(self, stub_client: IdentityStubClient | None = None):
        self.stub_client = stub_client or IdentityStubClient()

    async def current_user(self, token: str | None = None) -> UserContext:
        return store.resolve_user_by_token(token) or self.stub_client.resolve_user(token)
