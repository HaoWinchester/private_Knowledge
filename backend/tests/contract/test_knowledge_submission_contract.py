from __future__ import annotations

import httpx

from tests.helpers import submission_payload


async def test_create_knowledge_submission_returns_intake_request(client: httpx.AsyncClient) -> None:
    response = await client.post("/knowledge-items", json=submission_payload())

    assert response.status_code == 202
    payload = response.json()
    assert payload["id"].startswith("REV-")
    assert payload["knowledgeItemId"].startswith("K-")
    assert payload["status"] == "submitted"
