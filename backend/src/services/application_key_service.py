from __future__ import annotations

from src.schemas.domain import ApplicationKeyRotationResponse
from src.services.memory_store import store


class ApplicationKeyService:
    def rotate(self, application_id: str) -> ApplicationKeyRotationResponse | None:
        return store.rotate_key(application_id)
