from __future__ import annotations

import httpx

from tests.helpers import review_payload, submission_payload


async def test_submit_review_publish_flow(client: httpx.AsyncClient) -> None:
    created = (await client.post("/knowledge-items", json=submission_payload())).json()
    item_id = created["knowledgeItemId"]

    decision = await client.post(
        f"/intake-requests/{created['id']}/review",
        json=review_payload("approve"),
    )
    detail = await client.get(f"/knowledge-items/{item_id}")

    assert decision.status_code == 200
    assert detail.json()["status"] == "published"
