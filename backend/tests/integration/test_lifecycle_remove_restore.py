from __future__ import annotations

import httpx


async def test_update_item_creates_lifecycle_review_request(client: httpx.AsyncClient) -> None:
    response = await client.patch(
        "/knowledge-items/K-2026-0142",
        json={"summary": "更新后进入复核", "reason": "生命周期复核"},
    )

    assert response.status_code == 202
    assert response.json()["requestType"] == "update"
