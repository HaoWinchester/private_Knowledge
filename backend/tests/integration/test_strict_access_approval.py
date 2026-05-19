from __future__ import annotations

import httpx

from tests.helpers import auth_review_payload, authorization_payload


async def test_strict_access_approval_flow(client: httpx.AsyncClient) -> None:
    request_id = (await client.post("/authorization-requests", json=authorization_payload())).json()["id"]
    response = await client.post(
        f"/authorization-requests/{request_id}/review",
        json=auth_review_payload("approve"),
    )

    assert response.json()["status"] == "approved"
