from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Literal

from src.models.enums import (
    AuthorizationStatus,
    BusinessActionType,
    ConfidentialityLevel,
    IntakeStatus,
    KnowledgeStatus,
    KnowledgeType,
    OperationResult,
    ReviewDecisionValue,
    ReviewGroup,
    SourceType,
)
from src.schemas.base import APIModel


class KnowledgeSourceInput(APIModel):
    sourceType: SourceType
    uri: str | None = None
    displayName: str
    checksum: str | None = None


class KnowledgeSubmissionCreate(APIModel):
    title: str
    knowledgeType: KnowledgeType
    source: KnowledgeSourceInput
    responsibleUserId: str
    roleDirection: str
    businessTheme: str
    customerOrProject: str | None = None
    confidentialityLevel: ConfidentialityLevel
    summary: str
    suggestedTags: list[str] = []
    applicableScope: str
    validUntil: date


class KnowledgeItemUpdate(APIModel):
    summary: str | None = None
    applicableScope: str | None = None
    confidentialityLevel: ConfidentialityLevel | None = None
    validUntil: date | None = None
    reason: str | None = None


class KnowledgeVersion(APIModel):
    id: str
    versionNumber: int
    changeSummary: str | None = None
    effectiveStatus: Literal["draft", "effective", "superseded", "archived", "removed"]
    createdAt: datetime
    retentionUntil: date | None = None


class KnowledgeVersionCreate(APIModel):
    changeSummary: str
    source: KnowledgeSourceInput


class KnowledgeCard(APIModel):
    id: str
    title: str
    summary: str
    status: KnowledgeStatus
    confidentialityLevel: ConfidentialityLevel
    currentVersionId: str
    sourceDisplayName: str | None = None
    applicableScope: str | None = None
    tags: list[str] = []
    metadataOnly: bool = False
    authorizationRequestAvailable: bool = False


class KnowledgeItemDetail(KnowledgeCard):
    contentPreview: str | None = None
    versions: list[KnowledgeVersion] = []
    permissions: list[str] = []


class IntakeRequest(APIModel):
    id: str
    knowledgeItemId: str
    requestType: Literal["create", "update", "rectify", "remove", "restore"]
    status: IntakeStatus
    reviewGroup: ReviewGroup | None = None
    createdAt: datetime


class ReviewDecisionCreate(APIModel):
    decision: ReviewDecisionValue
    comments: str | None = None
    reasonCode: str | None = None


class ReviewDecision(ReviewDecisionCreate):
    id: str
    reviewerUserId: str
    createdAt: datetime


class BusinessActionBindingCreate(APIModel):
    actionType: BusinessActionType
    source: KnowledgeSourceInput
    responsibleUserId: str
    businessContext: str
    confidentialityLevel: ConfidentialityLevel
    summary: str
    applicableScope: str
    validUntil: date


class BusinessActionBinding(BusinessActionBindingCreate):
    id: str
    createdAt: datetime


class SearchRequest(APIModel):
    query: str
    filters: dict[str, str] = {}
    includeSemantic: bool = True


class SearchResponse(APIModel):
    items: list[KnowledgeCard]
    auditEventId: str


class Citation(APIModel):
    knowledgeItemId: str
    knowledgeVersionId: str
    fragmentRef: str | None = None
    citationType: Literal[
        "search_result",
        "qa_source",
        "recommendation_source",
        "generated_output_source",
    ]


class QARequest(APIModel):
    question: str
    businessContext: str | None = None
    filters: dict[str, str] = {}


class QAResponse(APIModel):
    answer: str
    citations: list[Citation]
    reviewCue: str | None = None
    auditEventId: str


class AuthorizationRequestCreate(APIModel):
    knowledgeItemId: str
    requestedPermission: str
    businessContext: str


class AuthorizationReview(APIModel):
    decision: Literal["approve", "reject"]
    reviewComment: str | None = None
    expiresAt: datetime | None = None


class AuthorizationRequest(APIModel):
    id: str
    knowledgeItemId: str
    requestedPermission: str
    status: AuthorizationStatus
    createdAt: datetime | None = None
    expiresAt: datetime | None = None


class QualitySignalCreate(APIModel):
    knowledgeItemId: str
    signalType: str
    value: str | None = None
    comment: str | None = None


class QualitySignal(QualitySignalCreate):
    id: str
    createdAt: datetime


class AuditEvent(APIModel):
    id: str
    eventType: str
    result: OperationResult
    createdAt: datetime
    retentionUntil: date
    actorUserId: str | None = None
    applicationId: str | None = None
    knowledgeItemId: str | None = None
    operationContext: str | None = None
    reason: str | None = None


class OperationsSummary(APIModel):
    newKnowledgeCount: int
    reuseCount: int
    expiringCount: int
    activeExpertCount: int
    qualityDistribution: list[dict[str, int | str]]
    weakAreas: list[dict[str, int | str]]
    expiringItems: list[dict[str, str]]


class ApplicationSummary(APIModel):
    applicationId: str
    name: str
    status: Literal["connected", "pending", "disabled"]
    monthlyCalls: int
    deniedCalls: int
    pilot: bool


class ApplicationKeyRotationResponse(APIModel):
    applicationId: str
    maskedKey: str
    rotatedAt: datetime


class ApplicationPolicyState(APIModel):
    prohibitTraining: bool = True
    sensitiveOnlyDesensitized: bool = True
    strictRequiresApproval: bool = True
    forceAudit: bool = True


class ApplicationPolicyUpdate(APIModel):
    prohibitTraining: bool | None = None
    sensitiveOnlyDesensitized: bool | None = None
    strictRequiresApproval: bool | None = None
    forceAudit: bool | None = None


class KnowledgeServiceRequest(APIModel):
    applicationId: str
    requesterUserId: str
    requestType: Literal["retrieve", "qa", "recommend"]
    businessContext: str
    projectContext: str | None = None
    input: str


class KnowledgeServiceResponse(APIModel):
    status: OperationResult
    citations: list[Citation]
    auditEventId: str
    output: str | None = None
    deniedReason: str | None = None


def now_utc() -> datetime:
    return datetime.now(timezone.utc)
