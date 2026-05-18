from __future__ import annotations

from collections.abc import AsyncIterator

import httpx
import pytest

from src.main import create_app


@pytest.fixture
async def client() -> AsyncIterator[httpx.AsyncClient]:
    transport = httpx.ASGITransport(app=create_app())
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as test_client:
        yield test_client
