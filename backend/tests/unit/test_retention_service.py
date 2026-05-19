from __future__ import annotations

from datetime import date

from src.services.memory_store import _retention


def test_retention_is_at_least_three_years() -> None:
    assert _retention().year >= date.today().year + 2
