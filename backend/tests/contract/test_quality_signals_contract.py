from __future__ import annotations

import httpx


async def test_quality_signal_contract(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/quality-signals",
        json={"knowledgeItemId": "K-2026-0142", "signalType": "useful", "value": "yes"},
    )

    assert response.status_code == 201
    assert response.json()["signalType"] == "useful"
