from __future__ import annotations

import httpx

from tests.helpers import authorization_payload


async def test_list_authorization_requests_contract(client: httpx.AsyncClient) -> None:
    await client.post("/authorization-requests", json=authorization_payload())
    response = await client.get("/authorization-requests")

    assert response.status_code == 200
    assert response.json()["items"]
