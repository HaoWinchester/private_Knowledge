from __future__ import annotations

import httpx


async def test_create_business_action_binding_contract(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/business-action-bindings",
        json={
            "actionType": "project_review",
            "source": {"sourceType": "project_sample_readonly", "displayName": "项目复盘目录"},
            "responsibleUserId": "user-delivery",
            "businessContext": "交付复盘后自动入库",
            "confidentialityLevel": "project_visible",
            "summary": "复盘资料入库绑定",
            "applicableScope": "交付项目组",
            "validUntil": "2027-05-18",
        },
    )

    assert response.status_code == 201
    assert response.json()["id"].startswith("BIND-")
