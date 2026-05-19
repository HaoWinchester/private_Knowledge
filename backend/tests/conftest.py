from __future__ import annotations

from collections.abc import AsyncIterator

import httpx
import pytest

from src.main import create_app
from src.services.database_store import store


@pytest.fixture(autouse=True)
def reset_database_store() -> None:
    store.reset()


@pytest.fixture
async def client() -> AsyncIterator[httpx.AsyncClient]:
    transport = httpx.ASGITransport(app=create_app())
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as test_client:
        yield test_client
