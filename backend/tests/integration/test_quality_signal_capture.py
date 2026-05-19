from __future__ import annotations

import httpx


async def test_quality_signal_updates_operations_summary(client: httpx.AsyncClient) -> None:
    await client.post(
        "/quality-signals",
        json={"knowledgeItemId": "K-2026-0142", "signalType": "favorite", "value": "true"},
    )
    response = await client.get("/operations/summary")

    assert response.status_code == 200
    assert response.json()["reuseCount"] >= 12
