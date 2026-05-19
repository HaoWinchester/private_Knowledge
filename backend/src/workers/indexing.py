from __future__ import annotations


def index_published_version(knowledge_item_id: str, version_id: str) -> dict[str, str]:
    return {"knowledgeItemId": knowledge_item_id, "versionId": version_id, "status": "indexed"}
