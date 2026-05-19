from __future__ import annotations

import httpx


async def test_governed_qa_request(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/api/v1/knowledge/query",
        json={
            "applicationId": "pilot-agent",
            "requesterUserId": "user-agent",
            "requestType": "qa",
            "businessContext": "方案生成",
            "input": "售前调研关注什么",
        },
    )

    assert response.status_code == 200
    assert "引用" in response.json()["output"] or response.json()["citations"]
