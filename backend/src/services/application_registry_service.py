from __future__ import annotations

from src.schemas.domain import ApplicationSummary
from src.services.memory_store import store


class ApplicationRegistryService:
    def list(self) -> list[ApplicationSummary]:
        return list(store.applications.values())
