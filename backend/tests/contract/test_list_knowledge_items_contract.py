from __future__ import annotations

import httpx


async def test_list_knowledge_items_supports_filtering(client: httpx.AsyncClient) -> None:
    response = await client.get("/knowledge-items", params={"q": "央企", "status": "published"})

    assert response.status_code == 200
    items = response.json()["items"]
    assert items
    assert all(item["status"] == "published" for item in items)
