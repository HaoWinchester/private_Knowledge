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


class KnowledgeStatus(StrEnum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    PUBLISHED = "published"
    REJECTED = "rejected"
    RECTIFICATION_REQUIRED = "rectification_required"
    ARCHIVED = "archived"
    REMOVED = "removed"
    RESTORED = "restored"


class KnowledgeType(StrEnum):
    DOCUMENT = "document"
    NOTE = "note"
    MEETING_OUTPUT = "meeting_output"
    PROJECT_MATERIAL = "project_material"
    CODE_PRACTICE = "code_practice"
    REVIEW = "review"
    LINK = "link"
    FORM = "form"


class SourceType(StrEnum):
    MANUAL_UPLOAD = "manual_upload"
    LINK_REFERENCE = "link_reference"
    SHARED_DIRECTORY_READONLY = "shared_directory_readonly"
    PROJECT_SAMPLE_READONLY = "project_sample_readonly"
    FORM = "form"


class IntakeStatus(StrEnum):
    SUBMITTED = "submitted"
    PRECHECK_FLAGGED = "precheck_flagged"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    RECTIFICATION_REQUIRED = "rectification_required"
    CANCELLED = "cancelled"


class ReviewDecisionValue(StrEnum):
    APPROVE = "approve"
    REJECT = "reject"
    REQUEST_RECTIFICATION = "request_rectification"
    ESCALATE = "escalate"


class ReviewGroup(StrEnum):
    KNOWLEDGE_ADMIN = "knowledge_admin"
    DOMAIN_EXPERT = "domain_expert"
    SECURITY_ADMIN = "security_admin"


class BusinessActionType(StrEnum):
    PROJECT_REVIEW = "project_review"
    PRESALES_ARCHIVE = "presales_archive"
    DELIVERY_REVIEW = "delivery_review"
    RECRUITMENT_EVALUATION = "recruitment_evaluation"


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
