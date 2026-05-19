from __future__ import annotations

import httpx


async def test_operations_summary_lists_expiring_items(client: httpx.AsyncClient) -> None:
    response = await client.get("/operations/summary")

    assert response.status_code == 200
    assert response.json()["expiringItems"]
