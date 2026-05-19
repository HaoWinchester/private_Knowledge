from __future__ import annotations

from hashlib import sha256


def checksum_text(value: str) -> str:
    return sha256(value.encode("utf-8")).hexdigest()
