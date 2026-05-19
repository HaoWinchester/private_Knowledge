from __future__ import annotations

import httpx


SERVICE_PAYLOAD = {
    "applicationId": "pilot-agent",
    "requesterUserId": "user-agent",
    "requestType": "qa",
    "businessContext": "方案生成",
    "input": "央企售前调研",
}


async def test_knowledge_service_query_contract(client: httpx.AsyncClient) -> None:
    response = await client.post("/knowledge-service/query", json=SERVICE_PAYLOAD)

    assert response.status_code == 200
    assert response.json()["status"] == "success"


async def test_knowledge_service_alias_contract(client: httpx.AsyncClient) -> None:
    response = await client.post("/api/v1/knowledge/query", json=SERVICE_PAYLOAD)

    assert response.status_code == 200
    assert response.json()["citations"]


async def test_applications_and_policy_contracts(client: httpx.AsyncClient) -> None:
    assert (await client.get("/applications")).json()["items"][0]["applicationId"] == "pilot-agent"
    assert (await client.post("/applications/pilot-agent/keys/rotate")).json()["maskedKey"]
    assert (await client.get("/application-policies")).json()["forceAudit"] is True
    response = await client.patch("/application-policies", json={"forceAudit": False})
    assert response.json()["forceAudit"] is False
