from __future__ import annotations

import httpx


async def test_audit_events_contract(client: httpx.AsyncClient) -> None:
    await client.post("/search", json={"query": "央企"})
    response = await client.get("/audit-events")

    assert response.status_code == 200
    assert response.json()["items"][0]["retentionUntil"]
