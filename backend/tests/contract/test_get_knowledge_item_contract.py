from __future__ import annotations

import httpx


async def test_get_knowledge_item_detail_contract(client: httpx.AsyncClient) -> None:
    response = await client.get("/knowledge-items/K-2026-0142")

    assert response.status_code == 200
    payload = response.json()
    assert payload["id"] == "K-2026-0142"
    assert payload["versions"]
