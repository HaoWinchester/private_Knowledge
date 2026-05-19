from __future__ import annotations

import httpx


async def test_governed_retrieve_request(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/knowledge-service/query",
        json={
            "applicationId": "pilot-agent",
            "requesterUserId": "user-agent",
            "requestType": "retrieve",
            "businessContext": "试点检索",
            "input": "央企",
        },
    )

    assert response.status_code == 200
    assert response.json()["citations"]
