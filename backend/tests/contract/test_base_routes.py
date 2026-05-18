from __future__ import annotations

import httpx


async def test_health(client: httpx.AsyncClient) -> None:
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_me(client: httpx.AsyncClient) -> None:
    response = await client.get("/me")
    assert response.status_code == 200
    payload = response.json()
    assert payload["userId"]
    assert isinstance(payload["roles"], list)
