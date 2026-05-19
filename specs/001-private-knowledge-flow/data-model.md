# Data Model: 企业内部知识库与受控流转体系

## Entity Overview

The model separates source artifacts, governed knowledge, workflow decisions, permissions, retrieval indexes, audit events, and upper-level service calls. PostgreSQL is the system of record; object storage and retrieval indexes are derived or attached resources.

## Entities

### UserIdentity

Represents a user resolved from the unified identity provider.

**Fields**:

- `id`: stable internal identifier
- `external_subject`: unified identity subject identifier
- `display_name`
- `email`
- `department_id`
- `department_name`
- `roles`: role names supplied by unified identity
- `status`: active, disabled
- `last_synced_at`

**Validation Rules**:

- `external_subject` must be unique.
- Disabled users cannot create new knowledge submissions or approve requests.

### KnowledgeItem

Governed knowledge asset visible through knowledge cards, retrieval, QA, and service calls.

**Fields**:

- `id`
- `title`
- `summary`
- `knowledge_type`: document, note, meeting_output, project_material, code_practice, review, link, form
- `status`: draft, pending_review, published, rejected, rectification_required, archived, removed, restored
- `confidentiality_level`: internal_public, department_visible, project_visible, sensitive, strictly_controlled
- `owner_user_id`
- `responsible_user_id`
- `source_id`
- `current_version_id`
- `applicable_scope`
- `valid_from`
- `valid_until`
- `created_at`
- `published_at`
- `updated_at`

**Relationships**:

- Has many `KnowledgeVersion`.
- Has one current `KnowledgeVersion`.
- Has many `ClassificationAssignment`.
- Has many `PermissionRule`.
- Has many `AuditEvent`.
- Has many `QualitySignal`.

**Validation Rules**:

- Published items must have source, responsible user, summary, confidentiality level, applicable scope, and current version.
- Removed, rejected, archived, or superseded versions cannot be returned as current formal reuse content.

### KnowledgeSource

Original source or reference for a knowledge item.

**Fields**:

- `id`
- `source_type`: manual_upload, link_reference, shared_directory_readonly, project_sample_readonly, form
- `uri`
- `display_name`
- `checksum`
- `external_last_modified_at`
- `access_status`: available, inaccessible, changed, deleted
- `submitted_by_user_id`
- `created_at`

**Validation Rules**:

- Read-only sources must never be modified by the knowledge system.
- Link and directory sources must store enough display metadata to support review if the target becomes unavailable.

### BusinessActionBinding

Configured trigger that binds a business action scenario to a governed knowledge intake path.

**Fields**:

- `id`
- `action_type`: project_review, presales_archive, delivery_review, recruitment_evaluation
- `source_id`
- `responsible_user_id`
- `business_context`
- `confidentiality_level`
- `summary`
- `applicable_scope`
- `valid_until`
- `status`: active, disabled
- `created_at`

**Relationships**:

- References one `KnowledgeSource`.
- Can create or prefill one or more `IntakeRequest` records.

**Validation Rules**:

- Business action bindings must provide enough metadata to pass the same intake validation as manual submissions.
- Disabled bindings cannot create new intake requests.

### KnowledgeVersion

Historical version of a knowledge item.

**Fields**:

- `id`
- `knowledge_item_id`
- `version_number`
- `change_summary`
- `content_object_key`
- `extracted_text_object_key`
- `sanitized_text_object_key`
- `effective_status`: draft, effective, superseded, archived, removed
- `created_by_user_id`
- `created_at`
- `effective_from`
- `retention_until`

**Validation Rules**:

- Version numbers are unique per knowledge item.
- Archived or removed knowledge versions must retain history for at least 3 years.

### IntakeRequest

Workflow object for submission, review, publication, rectification, removal, or restoration.

**Fields**:

- `id`
- `knowledge_item_id`
- `request_type`: create, update, rectify, remove, restore
- `status`: submitted, precheck_flagged, in_review, approved, rejected, rectification_required, cancelled
- `submitted_by_user_id`
- `assigned_reviewer_user_id`
- `review_group`: knowledge_admin, domain_expert, security_admin
- `reason`
- `created_at`
- `completed_at`

**Relationships**:

- Has many `ReviewDecision`.
- May produce a new `KnowledgeVersion`.

**Validation Rules**:

- No source can be published without an approved intake request.
- Sensitive and strictly controlled items require security review before publication.

### ReviewDecision

Reviewer action on an intake request.

**Fields**:

- `id`
- `intake_request_id`
- `reviewer_user_id`
- `decision`: approve, reject, request_rectification, escalate
- `comments`
- `reason_code`
- `created_at`
- `retention_until`

**Validation Rules**:

- Decision, reviewer, and reason are required for rejections and rectification requests.
- Retention must be at least 3 years.

### ClassificationAssignment

Controlled dimensions attached to a knowledge item.

**Fields**:

- `id`
- `knowledge_item_id`
- `dimension`: role_direction, business_theme, industry_customer, project_stage, technology_stack, confidentiality, lifecycle
- `value`
- `assigned_by_user_id`
- `created_at`

**Validation Rules**:

- Each published item must have at least role direction, business theme, confidentiality, lifecycle, and applicable scope.

### PermissionRule

Local authorization rule owned by the knowledge base.

**Fields**:

- `id`
- `knowledge_item_id`
- `rule_type`: project, confidentiality, exception
- `subject_type`: user, department, role, project, application
- `subject_ref`
- `permission`: view_metadata, view_content, cite, export, download, use_in_qa, use_in_ai_service, approve_strict_access
- `valid_from`
- `valid_until`
- `created_by_user_id`
- `created_at`

**Validation Rules**:

- Authorization evaluation must combine unified identity claims with local rules.
- Strictly controlled content requires explicit approval before desensitized fragments can be used in QA or AI-service calls.

### AuthorizationRequest

User or application request for access to restricted knowledge.

**Fields**:

- `id`
- `knowledge_item_id`
- `requester_user_id`
- `application_id`
- `requested_permission`
- `business_context`
- `status`: submitted, approved, rejected, expired
- `reviewer_user_id`
- `review_comment`
- `created_at`
- `expires_at`

**Validation Rules**:

- Strictly controlled content must have an approved authorization request before content fragments are exposed.

### AuditEvent

Append-oriented trace of important operations.

**Fields**:

- `id`
- `actor_user_id`
- `application_id`
- `knowledge_item_id`
- `event_type`: submit, review, publish, version_change, search, browse, cite, export, download, qa_call, service_call, access_denied, lifecycle_change
- `operation_context`
- `result`: success, denied, failed
- `reason`
- `created_at`
- `retention_until`

**Validation Rules**:

- Retention must be at least 3 years.
- Access denied events must include reason.

### QualitySignal

Usage and quality signal for lifecycle operations.

**Fields**:

- `id`
- `knowledge_item_id`
- `signal_type`: view, favorite, cite, qa_hit, reuse, rating, feedback, expiration_due, rectification
- `value`
- `comment`
- `actor_user_id`
- `created_at`

### KnowledgeServiceRequest

Upper-level AI application request for governed retrieval or QA.

**Fields**:

- `id`
- `application_id`
- `requester_user_id`
- `business_context`
- `project_context`
- `request_type`: retrieve, qa, recommend
- `input_summary`
- `result_summary`
- `status`: success, denied, failed
- `created_at`
- `retention_until`

**Relationships**:

- Has many `Citation`.
- Produces `AuditEvent` records.

### Citation

Reference from a search, QA, recommendation, or AI-service response to a knowledge item/version.

**Fields**:

- `id`
- `knowledge_service_request_id`
- `knowledge_item_id`
- `knowledge_version_id`
- `fragment_ref`
- `citation_type`: search_result, qa_source, recommendation_source, generated_output_source
- `created_at`

## State Transitions

### KnowledgeItem

```text
draft
  -> pending_review
  -> published
  -> rectification_required
  -> pending_review
  -> published
  -> archived
  -> restored
  -> published
  -> removed
```

Rejected submissions move from `pending_review` to `rejected` and require a new request to restart.

### IntakeRequest

```text
submitted
  -> precheck_flagged
  -> in_review
  -> approved

submitted -> in_review -> rejected
submitted -> in_review -> rectification_required
submitted -> cancelled
```

### AuthorizationRequest

```text
submitted -> approved -> expired
submitted -> rejected
```

## Derived Indexes

- Full-text index stores only authorized searchable fields and extracted text references.
- Vector index stores embedding references to fragments; content exposure still depends on permission evaluation at query time.
- Search and QA must filter by status, validity, confidentiality, unified identity claims, and local permission rules before returning content.
