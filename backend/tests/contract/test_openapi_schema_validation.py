from __future__ import annotations

import httpx


async def test_openapi_schema_contains_core_paths(client: httpx.AsyncClient) -> None:
    response = await client.get("/openapi.json")

    assert response.status_code == 200
    paths = response.json()["paths"]
    for path in [
        "/knowledge-items",
        "/search",
        "/qa",
        "/authorization-requests",
        "/knowledge-service/query",
    ]:
        assert path in paths
