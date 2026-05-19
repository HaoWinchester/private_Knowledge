export type ConfidentialityLevel =
  | "internal_public"
  | "department_visible"
  | "project_visible"
  | "sensitive"
  | "strictly_controlled";

export type KnowledgeStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected"
  | "rectification_required"
  | "archived"
  | "removed"
  | "restored";

export type KnowledgeType =
  | "document"
  | "note"
  | "meeting_output"
  | "project_material"
  | "code_practice"
  | "review"
  | "link"
  | "form";

export type SourceType =
  | "manual_upload"
  | "link_reference"
  | "shared_directory_readonly"
  | "project_sample_readonly"
  | "form";

export interface UserContext {
  userId: string;
  displayName: string;
  departmentId: string;
  departmentName?: string;
  roles: string[];
}

export interface KnowledgeSourceInput {
  sourceType: SourceType;
  uri?: string;
  displayName: string;
  checksum?: string;
}

export interface KnowledgeSubmissionCreate {
  title: string;
  knowledgeType: KnowledgeType;
  source: KnowledgeSourceInput;
  responsibleUserId: string;
  roleDirection: string;
  businessTheme: string;
  customerOrProject?: string;
  confidentialityLevel: ConfidentialityLevel;
  summary: string;
  suggestedTags?: string[];
  applicableScope: string;
  validUntil: string;
}

export interface KnowledgeCard {
  id: string;
  title: string;
  summary: string;
  status: KnowledgeStatus;
  confidentialityLevel: ConfidentialityLevel;
  currentVersionId: string;
  sourceDisplayName?: string;
  applicableScope?: string;
  tags: string[];
  metadataOnly: boolean;
  authorizationRequestAvailable: boolean;
}

export interface KnowledgeItemDetail extends KnowledgeCard {
  contentPreview?: string;
  versions: KnowledgeVersion[];
  permissions: string[];
}

export interface KnowledgeVersion {
  id: string;
  versionNumber: number;
  changeSummary?: string;
  effectiveStatus: "draft" | "effective" | "superseded" | "archived" | "removed";
  createdAt: string;
  retentionUntil?: string;
}

export interface KnowledgeVersionCreate {
  changeSummary: string;
  source: KnowledgeSourceInput;
}

export interface IntakeRequest {
  id: string;
  knowledgeItemId: string;
  requestType: "create" | "update" | "rectify" | "remove" | "restore";
  status:
    | "submitted"
    | "precheck_flagged"
    | "in_review"
    | "approved"
    | "rejected"
    | "rectification_required"
    | "cancelled";
  reviewGroup?: "knowledge_admin" | "domain_expert" | "security_admin";
  createdAt: string;
}

export interface ReviewDecisionCreate {
  decision: "approve" | "reject" | "request_rectification" | "escalate";
  comments?: string;
  reasonCode?: string;
}

export interface ReviewDecision extends ReviewDecisionCreate {
  id: string;
  reviewerUserId: string;
  createdAt: string;
}

export interface Citation {
  knowledgeItemId: string;
  knowledgeVersionId: string;
  fragmentRef?: string;
  citationType: "search_result" | "qa_source" | "recommendation_source" | "generated_output_source";
}

export interface QAResponse {
  answer: string;
  citations: Citation[];
  reviewCue?: string;
  auditEventId: string;
}

export interface AuthorizationRequest {
  id: string;
  knowledgeItemId: string;
  requestedPermission: string;
  status: "submitted" | "approved" | "rejected" | "expired";
  createdAt?: string;
  expiresAt?: string;
}

export interface AuditEvent {
  id: string;
  eventType: string;
  result: "success" | "denied" | "failed";
  createdAt: string;
  retentionUntil: string;
  actorUserId?: string;
  applicationId?: string;
  knowledgeItemId?: string;
  operationContext?: string;
  reason?: string;
}

export interface QualitySignal {
  id: string;
  knowledgeItemId: string;
  signalType: string;
  value?: string;
  comment?: string;
  createdAt: string;
}

export interface OperationsSummary {
  newKnowledgeCount: number;
  reuseCount: number;
  expiringCount: number;
  activeExpertCount: number;
  qualityDistribution: Array<{ label: string; count: number }>;
  weakAreas: Array<{ businessTheme: string; issueCount: number; suggestedAction?: string }>;
  expiringItems: Array<{ knowledgeItemId: string; title: string; validUntil: string }>;
}

export interface ApplicationSummary {
  applicationId: string;
  name: string;
  status: "connected" | "pending" | "disabled";
  monthlyCalls: number;
  deniedCalls: number;
  pilot: boolean;
}

export interface ApplicationPolicyState {
  prohibitTraining: boolean;
  sensitiveOnlyDesensitized: boolean;
  strictRequiresApproval: boolean;
  forceAudit: boolean;
}

export interface ApplicationKeyRotationResponse {
  applicationId: string;
  maskedKey: string;
  rotatedAt: string;
}

export interface KnowledgeServiceResponse {
  status: "success" | "denied" | "failed";
  citations: Citation[];
  auditEventId: string;
  output?: string;
  deniedReason?: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
}
