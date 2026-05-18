from __future__ import annotations

from enum import StrEnum


class UserStatus(StrEnum):
    ACTIVE = "active"
    DISABLED = "disabled"


class ConfidentialityLevel(StrEnum):
    INTERNAL_PUBLIC = "internal_public"
    DEPARTMENT_VISIBLE = "department_visible"
    PROJECT_VISIBLE = "project_visible"
    SENSITIVE = "sensitive"
    STRICTLY_CONTROLLED = "strictly_controlled"


class Permission(StrEnum):
    VIEW_METADATA = "view_metadata"
    VIEW_CONTENT = "view_content"
    CITE = "cite"
    EXPORT = "export"
    DOWNLOAD = "download"
    USE_IN_QA = "use_in_qa"
    USE_IN_AI_SERVICE = "use_in_ai_service"
    APPROVE_STRICT_ACCESS = "approve_strict_access"


class AuditEventType(StrEnum):
    SUBMIT = "submit"
    REVIEW = "review"
    PUBLISH = "publish"
    VERSION_CHANGE = "version_change"
    SEARCH = "search"
    BROWSE = "browse"
    CITE = "cite"
    EXPORT = "export"
    DOWNLOAD = "download"
    QA_CALL = "qa_call"
    SERVICE_CALL = "service_call"
    ACCESS_DENIED = "access_denied"
    LIFECYCLE_CHANGE = "lifecycle_change"


class OperationResult(StrEnum):
    SUCCESS = "success"
    DENIED = "denied"
    FAILED = "failed"


class AuthorizationStatus(StrEnum):
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"
