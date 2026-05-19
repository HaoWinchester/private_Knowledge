from __future__ import annotations

import httpx


async def test_qa_response_citations_reference_versions(client: httpx.AsyncClient) -> None:
    response = await client.post("/qa", json={"question": "微服务部署", "businessContext": "研发"})

    citation = response.json()["citations"][0]
    assert citation["knowledgeItemId"].startswith("K-")
    assert citation["knowledgeVersionId"].endswith("-v1")
