from __future__ import annotations

import httpx


async def test_service_call_is_audited(client: httpx.AsyncClient) -> None:
    await client.post(
        "/knowledge-service/query",
        json={
            "applicationId": "pilot-agent",
            "requesterUserId": "user-agent",
            "requestType": "qa",
            "businessContext": "试点",
            "input": "央企",
        },
    )
    audit = (await client.get("/audit-events")).json()["items"]

    assert any(event["eventType"] == "service_call" for event in audit)
