from __future__ import annotations

import httpx

from tests.helpers import authorization_payload


async def test_create_authorization_request_contract(client: httpx.AsyncClient) -> None:
    response = await client.post("/authorization-requests", json=authorization_payload())

    assert response.status_code == 202
    assert response.json()["status"] == "submitted"
