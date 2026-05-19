from __future__ import annotations

from datetime import date, datetime, timezone


def submission_payload(**overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "title": "售前知识提交测试",
        "knowledgeType": "document",
        "source": {
            "sourceType": "manual_upload",
            "displayName": "售前测试文档.docx",
            "uri": "s3://knowledge/test.docx",
        },
        "responsibleUserId": "user-knowledge-admin",
        "roleDirection": "售前",
        "businessTheme": "客户调研",
        "customerOrProject": "测试项目",
        "confidentialityLevel": "department_visible",
        "summary": "用于合同测试的知识摘要。",
        "suggestedTags": ["售前", "测试"],
        "applicableScope": "售前咨询部",
        "validUntil": str(date.today().replace(year=date.today().year + 1)),
    }
    payload.update(overrides)
    return payload


def authorization_payload(knowledge_item_id: str = "K-2026-0156") -> dict[str, str]:
    return {
        "knowledgeItemId": knowledge_item_id,
        "requestedPermission": "view_content",
        "businessContext": "客户项目支持",
    }


def review_payload(decision: str = "approve") -> dict[str, str]:
    return {
        "decision": decision,
        "comments": "合同测试审核意见",
        "reasonCode": "contract_test",
    }


def auth_review_payload(decision: str = "approve") -> dict[str, str]:
    return {
        "decision": decision,
        "reviewComment": "同意试点访问",
        "expiresAt": datetime.now(timezone.utc).isoformat(),
    }
