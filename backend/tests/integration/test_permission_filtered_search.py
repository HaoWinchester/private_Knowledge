from __future__ import annotations

import httpx


async def test_search_returns_permission_project_visible_metadata(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/search",
        json={"query": "售前", "filters": {"confidentialityLevel": "project_visible"}},
    )

    assert response.status_code == 200
    assert all(item["confidentialityLevel"] == "project_visible" for item in response.json()["items"])
