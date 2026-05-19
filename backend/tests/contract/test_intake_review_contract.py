from __future__ import annotations

import httpx

from tests.helpers import review_payload


async def test_review_intake_request_contract(client: httpx.AsyncClient) -> None:
    request_id = (await client.get("/intake-requests")).json()["items"][0]["id"]

    response = await client.post(
        f"/intake-requests/{request_id}/review",
        json=review_payload(),
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["decision"] == "approve"
    assert payload["reviewerUserId"]
