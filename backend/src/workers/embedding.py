from __future__ import annotations


def embed_sanitized_fragment(fragment_ref: str) -> dict[str, str]:
    return {"fragmentRef": fragment_ref, "status": "embedded"}
