from __future__ import annotations

from datetime import date

import httpx


async def test_audit_retention_metadata_at_least_three_years(client: httpx.AsyncClient) -> None:
    await client.post("/search", json={"query": "央企"})
    event = (await client.get("/audit-events")).json()["items"][0]

    retention_until = date.fromisoformat(event["retentionUntil"])
    assert retention_until.year >= date.today().year + 2
