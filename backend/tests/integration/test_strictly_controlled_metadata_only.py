from __future__ import annotations

import httpx


async def test_strictly_controlled_detail_is_metadata_only(client: httpx.AsyncClient) -> None:
    response = await client.get("/knowledge-items/K-2026-0156")

    payload = response.json()
    assert payload["metadataOnly"] is True
    assert payload["authorizationRequestAvailable"] is True
    assert payload["contentPreview"] is None
