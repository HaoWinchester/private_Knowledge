from __future__ import annotations

from datetime import date

from src.models.enums import ConfidentialityLevel
from src.schemas.domain import KnowledgeSubmissionCreate
from src.services.database_store import DatabaseStore, store


def test_database_store_persists_records_across_instances() -> None:
    request = store.create_submission(
        KnowledgeSubmissionCreate(
            title="数据库持久化验收知识",
            knowledgeType="note",
            source={"sourceType": "manual_upload", "displayName": "acceptance.md"},
            responsibleUserId="user-knowledge-admin",
            roleDirection="研发",
            businessTheme="验收",
            confidentialityLevel=ConfidentialityLevel.DEPARTMENT_VISIBLE,
            summary="用于证明知识条目已经写入 SQLite，而不是留在进程内存。",
            suggestedTags=["数据库", "验收"],
            applicableScope="研发、知识管理员",
            validUntil=date(2027, 5, 18),
        ),
        submitter_user_id="user-knowledge-admin",
    )

    reloaded_store = DatabaseStore()
    reloaded_item = reloaded_store.get_item(request.knowledgeItemId)
    reloaded_request = reloaded_store.intake_requests.get(request.id)

    assert reloaded_item is not None
    assert reloaded_item.title == "数据库持久化验收知识"
    assert reloaded_request is not None
    assert reloaded_request.knowledgeItemId == request.knowledgeItemId
