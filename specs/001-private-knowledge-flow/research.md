# Research: 企业内部知识库与受控流转体系

## Decision: Use a backend/frontend web application, not a document-only system

**Rationale**: The feature includes employee submission, review workflows, search, QA, admin audit, lifecycle operations, and one AI-service pilot. These require interactive user journeys and server-side controls.

**Alternatives considered**:

- Document-only repository: rejected because it cannot enforce permission filtering, workflow state, audit, or service calls.
- Backend-only API: rejected because administrators and employees need first-phase workflows and validation screens.

## Decision: FastAPI backend with existing TanStack Start frontend

**Rationale**: The user provided an existing frontend implementation with completed internal portal pages for dashboard, library, submission, review, access approval, audit, AI chat, operations, and integrations. It now lives under `frontend/` in this repository. FastAPI still fits strong schema validation, OpenAPI contracts, async workers, and RAG orchestration. The backend should integrate with the TanStack Start/Vite/React frontend by replacing mock data with API clients and field mappers.

**Alternatives considered**:

- Java Spring stack: strong enterprise fit, but not aligned with the existing local agent profile.
- Low-code workflow platform first: useful later, but less flexible for permission-filtered RAG and custom audit requirements.
- New frontend scaffold: rejected because the existing frontend implementation already contains the required first-phase workflows and validation screens.

## Decision: PostgreSQL as the operational source of truth

**Rationale**: Knowledge metadata, workflow state, local authorization rules, audit indexes, lifecycle status, quality signals, and service-call logs need relational consistency and queryability.

**Alternatives considered**:

- Store everything in object storage: rejected because workflow, audit, and permissions need structured queries.
- Use only a search engine as source of truth: rejected because search indexes are derived and should be rebuildable.

## Decision: Object storage for source files and derived artifacts

**Rationale**: Original files, extracted text, sanitized fragments, thumbnails, and generated artifacts should be stored outside the relational database, with metadata and checksums tracked in PostgreSQL.

**Alternatives considered**:

- Database BLOB storage: rejected due to backup size, migration complexity, and limited document lifecycle ergonomics.
- Local filesystem only: rejected because deployment should support private server/container scaling and backup policies.

## Decision: Separate full-text and vector retrieval

**Rationale**: The spec requires keyword/tag filtering and semantic question answering. OpenSearch handles lexical/full-text filtering and operational search, while Qdrant handles embedding-based retrieval. Results are merged only after permission filtering constraints are applied.

**Alternatives considered**:

- Vector-only search: rejected because business users need exact keyword, tag, status, and metadata filtering.
- Full-text-only search: rejected because semantic QA and similar case recommendation need meaning-based retrieval.

## Decision: Unified identity plus local knowledge authorization

**Rationale**: Clarification selected unified identity for user, department, and role, while the knowledge base owns project authorization, confidentiality authorization, and exception authorization. This avoids deep first-phase dependency on OA/project/code-system permission models.

**Alternatives considered**:

- Fully local identity: rejected because enterprise account alignment is required.
- Full external permission synchronization: rejected as too large for phase one and likely to delay the closed-loop pilot.

## Decision: Confidentiality-specific RAG controls

**Rationale**: Sensitive knowledge may be used as authorized desensitized fragments, while strictly controlled knowledge returns metadata and an authorization entry until explicit approval. This matches the clarified security posture and keeps high-risk content out of default QA.

**Alternatives considered**:

- No high-sensitivity content in QA: safer but weakens authorized business reuse.
- Full-content access whenever authorized: rejected because it increases leakage risk and complicates audit review.

## Decision: Read-only external source access in phase one

**Rationale**: The first phase should support manual upload, link reference, shared directory read-only access, and project sample read-only access. Every item still requires human review before publication.

**Alternatives considered**:

- Full automatic sync: rejected because source ownership, deduplication, confidentiality, and review are not mature enough in phase one.
- Manual upload only: rejected because it weakens source traceability and pilot realism.

## Decision: One upper-level AI application pilot

**Rationale**: The first phase should prove governed knowledge service value through one real call path, validating permission filtering, citations, and audit without expanding into every AI application.

**Alternatives considered**:

- No AI-service pilot: rejected because the feature's long-term value is a governed AI knowledge source.
- All AI applications in phase one: rejected because proposal generation, code assistance, interview assistance, and multi-agent workflows are separate products.

## Decision: Append-oriented audit and retention model

**Rationale**: Approval records, access records, audit records, and service-call logs must be retained for at least 3 years. Append-oriented records are easier to review and less prone to accidental loss.

**Alternatives considered**:

- Mutable audit rows only: rejected because edits can compromise traceability.
- Permanent retention for everything: deferred until customer compliance policy demands it.

## Decision: Contract and integration tests before implementation

**Rationale**: Permission filtering, citation behavior, lifecycle exclusions, and service-call auditing are contract-critical. They should be captured by contract tests and integration tests before feature implementation.

**Alternatives considered**:

- UI-only acceptance: rejected because most risk lives in backend authorization and audit paths.
- Manual testing only: rejected because regressions in permissions and RAG filtering are easy to miss.
