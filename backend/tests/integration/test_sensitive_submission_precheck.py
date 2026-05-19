from __future__ import annotations

import httpx

from tests.helpers import submission_payload


async def test_sensitive_submission_routes_to_security_review(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/knowledge-items",
        json=submission_payload(confidentialityLevel="sensitive", title="敏感客户报价复盘"),
    )

    assert response.status_code == 202
    assert response.json()["reviewGroup"] == "security_admin"
