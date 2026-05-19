from __future__ import annotations

import httpx


async def test_list_intake_requests_returns_seed_queue(client: httpx.AsyncClient) -> None:
    response = await client.get("/intake-requests")

    assert response.status_code == 200
    payload = response.json()
    assert payload["items"]
    assert {"id", "knowledgeItemId", "status", "createdAt"} <= set(payload["items"][0])
