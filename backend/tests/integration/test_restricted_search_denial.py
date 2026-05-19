from __future__ import annotations

import httpx


async def test_strict_qa_emits_denial_audit(client: httpx.AsyncClient) -> None:
    response = await client.post("/qa", json={"question": "国网合同条款", "businessContext": "法务"})

    assert response.status_code == 200
    payload = response.json()
    assert "严格受控" in payload["answer"]
    audit = (await client.get("/audit-events")).json()["items"]
    assert any(event["result"] == "denied" for event in audit)
