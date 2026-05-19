from __future__ import annotations

import httpx

from tests.helpers import submission_payload


async def test_submission_requires_core_metadata(client: httpx.AsyncClient) -> None:
    payload = submission_payload()
    payload.pop("responsibleUserId")

    response = await client.post("/knowledge-items", json=payload)

    assert response.status_code == 422
