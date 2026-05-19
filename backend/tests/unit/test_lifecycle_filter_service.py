from __future__ import annotations

from src.services.lifecycle_filter_service import LifecycleFilterService
from src.services.database_store import store


def test_lifecycle_filter_keeps_reusable_items() -> None:
    service = LifecycleFilterService()

    assert all(item.status == "published" for item in service.reusable(store.list_items()))
