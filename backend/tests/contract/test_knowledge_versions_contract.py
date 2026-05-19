from __future__ import annotations

import httpx


async def test_create_knowledge_version_contract(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/knowledge-items/K-2026-0142/versions",
        json={
            "changeSummary": "补充客户访谈章节",
            "source": {"sourceType": "link_reference", "displayName": "访谈纪要", "uri": "https://intranet/item"},
        },
    )

    assert response.status_code == 202
    assert response.json()["knowledgeItemId"] == "K-2026-0142"


async def test_list_knowledge_versions_contract(client: httpx.AsyncClient) -> None:
    response = await client.get("/knowledge-items/K-2026-0142/versions")

    assert response.status_code == 200
    assert response.json()["versions"][0]["effectiveStatus"] == "effective"
