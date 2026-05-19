from __future__ import annotations

import httpx


async def test_search_contract(client: httpx.AsyncClient) -> None:
    response = await client.post("/search", json={"query": "央企", "filters": {}, "includeSemantic": True})

    assert response.status_code == 200
    payload = response.json()
    assert payload["auditEventId"].startswith("AUD-")
    assert payload["items"][0]["id"] == "K-2026-0142"
