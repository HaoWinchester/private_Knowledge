from __future__ import annotations


def scan_expiring_items(days: int = 30) -> dict[str, int]:
    return {"days": days, "queued": 0}
