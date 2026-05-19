from __future__ import annotations

from src.schemas.domain import BusinessActionBinding, BusinessActionBindingCreate
from src.services.database_store import store


class SourceService:
    def create_business_action_binding(
        self, payload: BusinessActionBindingCreate
    ) -> BusinessActionBinding:
        return store.create_business_binding(payload)
