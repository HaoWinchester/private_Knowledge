from __future__ import annotations

import httpx


async def test_search_excludes_non_published_lifecycle_items(client: httpx.AsyncClient) -> None:
    await client.post(
        "/knowledge-items",
        json={
            "title": "尚未发布的临时知识",
            "knowledgeType": "note",
            "source": {"sourceType": "manual_upload", "displayName": "tmp.md"},
            "responsibleUserId": "user-knowledge-admin",
            "roleDirection": "研发",
            "businessTheme": "临时",
            "confidentialityLevel": "department_visible",
            "summary": "这条不应出现在检索结果中",
            "applicableScope": "研发",
            "validUntil": "2027-05-18",
        },
    )

    response = await client.post("/search", json={"query": "临时"})

    assert response.status_code == 200
    assert response.json()["items"] == []
