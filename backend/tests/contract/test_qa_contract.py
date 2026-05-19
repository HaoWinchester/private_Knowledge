from __future__ import annotations

import httpx


async def test_qa_contract_returns_citations(client: httpx.AsyncClient) -> None:
    response = await client.post("/qa", json={"question": "央企售前调研", "businessContext": "contract"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["answer"]
    assert payload["citations"]
    assert payload["auditEventId"].startswith("AUD-")
