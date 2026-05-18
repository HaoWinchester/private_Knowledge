# Tasks: 企业内部知识库与受控流转体系

**Input**: Design documents from `/specs/001-private-knowledge-flow/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

**Tests**: Included. `research.md` explicitly requires contract and integration tests before implementation for permission filtering, citations, lifecycle exclusions, and service-call auditing.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently after the shared foundation is complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel after this phase's prerequisites are ready because it touches a different file or isolated concern
- **[Story]**: User story label for story phases only
- Every task includes an exact repository-relative file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the backend, frontend, infrastructure, and test skeletons required by the implementation plan.

- [ ] T001 Create backend package entrypoint in `backend/src/__init__.py`
- [ ] T002 Create FastAPI application shell in `backend/src/main.py`
- [ ] T003 [P] Create backend dependency package marker in `backend/src/api/__init__.py`
- [ ] T004 [P] Create backend route package marker in `backend/src/api/routes/__init__.py`
- [ ] T005 [P] Create backend dependency package marker in `backend/src/api/dependencies/__init__.py`
- [ ] T006 [P] Create backend core package marker in `backend/src/core/__init__.py`
- [ ] T007 [P] Create backend model package marker in `backend/src/models/__init__.py`
- [ ] T008 [P] Create backend schema package marker in `backend/src/schemas/__init__.py`
- [ ] T009 [P] Create backend service package marker in `backend/src/services/__init__.py`
- [ ] T010 [P] Create backend integration package marker in `backend/src/integrations/__init__.py`
- [ ] T011 [P] Create backend worker package marker in `backend/src/workers/__init__.py`
- [ ] T012 Define backend runtime dependencies in `backend/requirements.txt`
- [ ] T013 Define backend development dependencies in `backend/requirements-dev.txt`
- [ ] T014 Configure pytest defaults in `backend/pytest.ini`
- [ ] T015 Configure Alembic entrypoint in `backend/alembic.ini`
- [ ] T016 Create Alembic environment loader in `infra/migrations/env.py`
- [ ] T017 [P] Create backend contract test package marker in `backend/tests/contract/__init__.py`
- [ ] T018 [P] Create backend integration test package marker in `backend/tests/integration/__init__.py`
- [ ] T019 [P] Create backend unit test package marker in `backend/tests/unit/__init__.py`
- [ ] T020 Initialize Next.js package metadata in `frontend/package.json`
- [ ] T021 Configure TypeScript compiler in `frontend/tsconfig.json`
- [ ] T022 Configure Next.js runtime options in `frontend/next.config.mjs`
- [ ] T023 Configure Playwright project in `frontend/playwright.config.ts`
- [ ] T024 Create local service compose file in `infra/docker/docker-compose.dev.yml`
- [ ] T025 Document local environment variables in `.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared configuration, persistence, identity, authorization primitives, audit plumbing, and clients that all user stories depend on.

**Critical**: No user story work starts until this phase is complete.

- [ ] T026 Implement typed environment settings in `backend/src/core/settings.py`
- [ ] T027 Implement structured logging configuration in `backend/src/core/logging.py`
- [ ] T028 Implement application error types in `backend/src/core/errors.py`
- [ ] T029 Implement API exception handlers in `backend/src/api/dependencies/error_handlers.py`
- [ ] T030 Configure async SQLAlchemy engine in `backend/src/core/database.py`
- [ ] T031 Create declarative model base in `backend/src/models/base.py`
- [ ] T032 Create shared timestamp mixin in `backend/src/models/mixins.py`
- [ ] T033 Create first Alembic revision placeholder in `infra/migrations/versions/0001_initial.py`
- [ ] T034 Implement database session dependency in `backend/src/api/dependencies/session.py`
- [ ] T035 Implement repository transaction helper in `backend/src/services/unit_of_work.py`
- [ ] T036 Define shared enum values in `backend/src/models/enums.py`
- [ ] T037 Define shared Pydantic config base in `backend/src/schemas/base.py`
- [ ] T038 Implement request correlation middleware in `backend/src/api/dependencies/request_context.py`
- [ ] T039 Implement bearer token parsing dependency in `backend/src/api/dependencies/auth.py`
- [ ] T040 Implement unified identity stub client in `backend/src/integrations/identity_stub.py`
- [ ] T041 Implement current user resolver service in `backend/src/services/identity_service.py`
- [ ] T042 Implement `/health` route in `backend/src/api/routes/health.py`
- [ ] T043 Implement `/me` route in `backend/src/api/routes/me.py`
- [ ] T044 Register base routes and middleware in `backend/src/main.py`
- [ ] T045 Define UserIdentity model in `backend/src/models/user_identity.py`
- [ ] T046 Define AuditEvent model in `backend/src/models/audit_event.py`
- [ ] T047 Define PermissionRule model in `backend/src/models/permission_rule.py`
- [ ] T048 Define AuthorizationRequest model in `backend/src/models/authorization_request.py`
- [ ] T049 Implement audit retention date helper in `backend/src/services/retention_service.py`
- [ ] T050 Implement append-only audit service in `backend/src/services/audit_service.py`
- [ ] T051 Implement authorization decision value object in `backend/src/services/authorization_types.py`
- [ ] T052 Implement local permission rule evaluator in `backend/src/services/authorization_service.py`
- [ ] T053 Implement object storage client wrapper in `backend/src/integrations/object_storage.py`
- [ ] T054 Implement OpenSearch client wrapper in `backend/src/integrations/opensearch_client.py`
- [ ] T055 Implement Qdrant client wrapper in `backend/src/integrations/qdrant_client.py`
- [ ] T056 Implement Redis client wrapper in `backend/src/integrations/redis_client.py`
- [ ] T057 Implement Celery application setup in `backend/src/workers/celery_app.py`
- [ ] T058 Create backend test fixtures in `backend/tests/conftest.py`
- [ ] T059 Create seed identity users in `infra/seed/users.json`
- [ ] T060 Create seed confidentiality roles in `infra/seed/roles.json`
- [ ] T061 Create frontend application layout in `frontend/src/app/layout.tsx`
- [ ] T062 Create frontend Ant Design provider in `frontend/src/components/AppProviders.tsx`
- [ ] T063 Create frontend API client base in `frontend/src/services/apiClient.ts`
- [ ] T064 Create frontend auth state store in `frontend/src/state/authStore.ts`
- [ ] T065 Create frontend shell navigation in `frontend/src/components/AppShell.tsx`

**Checkpoint**: Backend app starts, `/health` and `/me` are callable, database sessions work, audit and authorization primitives exist, and frontend shell can load.

---

## Phase 3: User Story 1 - 知识提交与受控入库 (Priority: P1) MVP

**Goal**: Users can submit knowledge with required metadata, route it through review, publish it as a traceable knowledge card, and submit later versions.

**Independent Test**: Submit one manual upload or link-reference knowledge item, verify required metadata validation, route to reviewer, approve it, and confirm a published latest-version card with source, owner, scope, confidentiality, and lifecycle fields.

### Tests for User Story 1

> Write these tests first and confirm they fail before implementation.

- [ ] T066 [P] [US1] Add contract test for `POST /knowledge-items` in `backend/tests/contract/test_knowledge_submission_contract.py`
- [ ] T067 [P] [US1] Add contract test for `GET /intake-requests` in `backend/tests/contract/test_intake_requests_contract.py`
- [ ] T068 [P] [US1] Add contract test for `POST /intake-requests/{id}/review` in `backend/tests/contract/test_intake_review_contract.py`
- [ ] T069 [P] [US1] Add contract test for `POST /knowledge-items/{id}/versions` in `backend/tests/contract/test_knowledge_versions_contract.py`
- [ ] T070 [P] [US1] Add integration test for submit-review-publish flow in `backend/tests/integration/test_submit_review_publish_flow.py`
- [ ] T071 [P] [US1] Add integration test for required metadata validation in `backend/tests/integration/test_submission_metadata_validation.py`
- [ ] T072 [P] [US1] Add integration test for sensitive precheck routing in `backend/tests/integration/test_sensitive_submission_precheck.py`
- [ ] T073 [P] [US1] Add Playwright journey for employee submission and reviewer approval in `frontend/tests/e2e/submit_review_publish.spec.ts`

### Implementation for User Story 1

- [ ] T074 [P] [US1] Define KnowledgeSource model in `backend/src/models/knowledge_source.py`
- [ ] T075 [P] [US1] Define KnowledgeItem model in `backend/src/models/knowledge_item.py`
- [ ] T076 [P] [US1] Define KnowledgeVersion model in `backend/src/models/knowledge_version.py`
- [ ] T077 [P] [US1] Define IntakeRequest model in `backend/src/models/intake_request.py`
- [ ] T078 [P] [US1] Define ReviewDecision model in `backend/src/models/review_decision.py`
- [ ] T079 [P] [US1] Define ClassificationAssignment model in `backend/src/models/classification_assignment.py`
- [ ] T080 [US1] Add knowledge intake tables to migration in `infra/migrations/versions/0001_initial.py`
- [ ] T081 [P] [US1] Define knowledge source schemas in `backend/src/schemas/knowledge_source.py`
- [ ] T082 [P] [US1] Define knowledge item schemas in `backend/src/schemas/knowledge_item.py`
- [ ] T083 [P] [US1] Define knowledge version schemas in `backend/src/schemas/knowledge_version.py`
- [ ] T084 [P] [US1] Define intake request schemas in `backend/src/schemas/intake_request.py`
- [ ] T085 [P] [US1] Define review decision schemas in `backend/src/schemas/review_decision.py`
- [ ] T086 [US1] Implement source registration service in `backend/src/services/source_service.py`
- [ ] T087 [US1] Implement submission metadata validator in `backend/src/services/submission_validation_service.py`
- [ ] T088 [US1] Implement duplicate precheck service in `backend/src/services/duplicate_precheck_service.py`
- [ ] T089 [US1] Implement confidentiality precheck service in `backend/src/services/confidentiality_precheck_service.py`
- [ ] T090 [US1] Implement reviewer routing service in `backend/src/services/reviewer_routing_service.py`
- [ ] T091 [US1] Implement intake workflow service in `backend/src/services/intake_service.py`
- [ ] T092 [US1] Implement publication service in `backend/src/services/publication_service.py`
- [ ] T093 [US1] Implement versioning service in `backend/src/services/version_service.py`
- [ ] T094 [US1] Implement classification assignment service in `backend/src/services/classification_service.py`
- [ ] T095 [US1] Implement document extraction worker stub in `backend/src/workers/document_extraction.py`
- [ ] T096 [US1] Implement source checksum worker stub in `backend/src/workers/source_integrity.py`
- [ ] T097 [US1] Implement `POST /knowledge-items` route in `backend/src/api/routes/knowledge_items.py`
- [ ] T098 [US1] Implement `PATCH /knowledge-items/{knowledgeItemId}` route in `backend/src/api/routes/knowledge_items.py`
- [ ] T099 [US1] Implement `GET /knowledge-items/{knowledgeItemId}/versions` route in `backend/src/api/routes/knowledge_versions.py`
- [ ] T100 [US1] Implement `POST /knowledge-items/{knowledgeItemId}/versions` route in `backend/src/api/routes/knowledge_versions.py`
- [ ] T101 [US1] Implement `GET /intake-requests` route in `backend/src/api/routes/intake_requests.py`
- [ ] T102 [US1] Implement `POST /intake-requests/{intakeRequestId}/review` route in `backend/src/api/routes/intake_requests.py`
- [ ] T103 [US1] Emit submit/review/publish/version audit events in `backend/src/services/intake_service.py`
- [ ] T104 [US1] Create frontend knowledge submission API methods in `frontend/src/services/knowledgeItems.ts`
- [ ] T105 [US1] Create frontend intake request API methods in `frontend/src/services/intakeRequests.ts`
- [ ] T106 [US1] Create submission form state store in `frontend/src/state/submissionStore.ts`
- [ ] T107 [US1] Create knowledge metadata form component in `frontend/src/features/submission/KnowledgeMetadataForm.tsx`
- [ ] T108 [US1] Create source input component in `frontend/src/features/submission/KnowledgeSourceInput.tsx`
- [ ] T109 [US1] Create confidentiality selector component in `frontend/src/features/submission/ConfidentialitySelector.tsx`
- [ ] T110 [US1] Create employee submission page in `frontend/src/app/submit/page.tsx`
- [ ] T111 [US1] Create reviewer intake list component in `frontend/src/features/review/IntakeRequestList.tsx`
- [ ] T112 [US1] Create review decision panel component in `frontend/src/features/review/ReviewDecisionPanel.tsx`
- [ ] T113 [US1] Create admin intake page in `frontend/src/app/admin/intake/page.tsx`
- [ ] T114 [US1] Create knowledge card summary component in `frontend/src/features/knowledge/KnowledgeCard.tsx`
- [ ] T115 [US1] Add seed submission examples in `infra/seed/knowledge_submissions.json`
- [ ] T116 [US1] Update quickstart submit-review-publish command notes in `specs/001-private-knowledge-flow/quickstart.md`

**Checkpoint**: User Story 1 is fully functional and independently demonstrable as the MVP.

---

## Phase 4: User Story 2 - 可信检索、问答与复用 (Priority: P1)

**Goal**: Authorized users can filter, search, ask questions, see citations, and receive reusable recommendations while lifecycle-excluded knowledge is suppressed.

**Independent Test**: Publish authorized and lifecycle-excluded knowledge, search with filters, ask a question, verify only authorized current material appears, and confirm answers include citations with version, scope, and review cue.

### Tests for User Story 2

> Write these tests first and confirm they fail before implementation.

- [ ] T117 [P] [US2] Add contract test for `GET /knowledge-items` filtering in `backend/tests/contract/test_list_knowledge_items_contract.py`
- [ ] T118 [P] [US2] Add contract test for `GET /knowledge-items/{id}` detail in `backend/tests/contract/test_get_knowledge_item_contract.py`
- [ ] T119 [P] [US2] Add contract test for `POST /search` in `backend/tests/contract/test_search_contract.py`
- [ ] T120 [P] [US2] Add contract test for `POST /qa` in `backend/tests/contract/test_qa_contract.py`
- [ ] T121 [P] [US2] Add integration test for permission-filtered search in `backend/tests/integration/test_permission_filtered_search.py`
- [ ] T122 [P] [US2] Add integration test for QA citations in `backend/tests/integration/test_qa_citations.py`
- [ ] T123 [P] [US2] Add integration test for lifecycle exclusion in `backend/tests/integration/test_lifecycle_exclusion.py`
- [ ] T124 [P] [US2] Add Playwright search and QA journey in `frontend/tests/e2e/search_qa_reuse.spec.ts`

### Implementation for User Story 2

- [ ] T125 [P] [US2] Define search request and response schemas in `backend/src/schemas/search.py`
- [ ] T126 [P] [US2] Define QA request and response schemas in `backend/src/schemas/qa.py`
- [ ] T127 [P] [US2] Define citation schemas in `backend/src/schemas/citation.py`
- [ ] T128 [US2] Extend Citation model for search and QA references in `backend/src/models/citation.py`
- [ ] T129 [US2] Add citation table to migration in `infra/migrations/versions/0001_initial.py`
- [ ] T130 [US2] Implement lifecycle eligibility filter in `backend/src/services/lifecycle_filter_service.py`
- [ ] T131 [US2] Implement knowledge list query service in `backend/src/services/knowledge_query_service.py`
- [ ] T132 [US2] Implement metadata filter builder in `backend/src/services/metadata_filter_service.py`
- [ ] T133 [US2] Implement full-text retrieval service in `backend/src/services/fulltext_search_service.py`
- [ ] T134 [US2] Implement semantic retrieval service in `backend/src/services/vector_search_service.py`
- [ ] T135 [US2] Implement retrieval result merge service in `backend/src/services/retrieval_merge_service.py`
- [ ] T136 [US2] Implement citation assembly service in `backend/src/services/citation_service.py`
- [ ] T137 [US2] Implement answer generation adapter stub in `backend/src/integrations/model_gateway.py`
- [ ] T138 [US2] Implement QA orchestration service in `backend/src/services/qa_service.py`
- [ ] T139 [US2] Implement recommendation service in `backend/src/services/recommendation_service.py`
- [ ] T140 [US2] Implement `GET /knowledge-items` route in `backend/src/api/routes/knowledge_items.py`
- [ ] T141 [US2] Implement `GET /knowledge-items/{knowledgeItemId}` route in `backend/src/api/routes/knowledge_items.py`
- [ ] T142 [US2] Implement `POST /search` route in `backend/src/api/routes/search.py`
- [ ] T143 [US2] Implement `POST /qa` route in `backend/src/api/routes/qa.py`
- [ ] T144 [US2] Emit search and qa_call audit events in `backend/src/services/qa_service.py`
- [ ] T145 [US2] Implement indexing worker for published versions in `backend/src/workers/indexing.py`
- [ ] T146 [US2] Implement embedding worker for sanitized fragments in `backend/src/workers/embedding.py`
- [ ] T147 [US2] Create frontend search API methods in `frontend/src/services/search.ts`
- [ ] T148 [US2] Create frontend QA API methods in `frontend/src/services/qa.ts`
- [ ] T149 [US2] Create search state store in `frontend/src/state/searchStore.ts`
- [ ] T150 [US2] Create knowledge filter panel in `frontend/src/features/search/KnowledgeFilterPanel.tsx`
- [ ] T151 [US2] Create search result list in `frontend/src/features/search/SearchResultList.tsx`
- [ ] T152 [US2] Create citation list component in `frontend/src/features/qa/CitationList.tsx`
- [ ] T153 [US2] Create QA composer component in `frontend/src/features/qa/QAComposer.tsx`
- [ ] T154 [US2] Create search and QA page in `frontend/src/app/search/page.tsx`
- [ ] T155 [US2] Create reusable material recommendation panel in `frontend/src/features/recommendations/RecommendationPanel.tsx`
- [ ] T156 [US2] Add searchable seed knowledge in `infra/seed/published_knowledge.json`

**Checkpoint**: User Story 2 works independently with authorized current knowledge, citations, recommendations, and lifecycle exclusions.

---

## Phase 5: User Story 3 - 权限、密级、脱敏与审计 (Priority: P1)

**Goal**: The system enforces unified identity plus local authorization rules, handles sensitive and strictly controlled knowledge safely, and provides complete audit queryability.

**Independent Test**: Unauthorized users cannot discover or consume restricted content; strictly controlled results expose metadata and an authorization entry until explicit approval; administrators can query access, denial, citation, export, service, and lifecycle audit events.

### Tests for User Story 3

> Write these tests first and confirm they fail before implementation.

- [ ] T157 [P] [US3] Add contract test for `POST /authorization-requests` in `backend/tests/contract/test_create_authorization_request_contract.py`
- [ ] T158 [P] [US3] Add contract test for `GET /authorization-requests` in `backend/tests/contract/test_list_authorization_requests_contract.py`
- [ ] T159 [P] [US3] Add contract test for `POST /authorization-requests/{id}/review` in `backend/tests/contract/test_review_authorization_request_contract.py`
- [ ] T160 [P] [US3] Add contract test for `GET /audit-events` in `backend/tests/contract/test_audit_events_contract.py`
- [ ] T161 [P] [US3] Add integration test for restricted search denial in `backend/tests/integration/test_restricted_search_denial.py`
- [ ] T162 [P] [US3] Add integration test for strictly controlled metadata-only behavior in `backend/tests/integration/test_strictly_controlled_metadata_only.py`
- [ ] T163 [P] [US3] Add integration test for explicit strict access approval in `backend/tests/integration/test_strict_access_approval.py`
- [ ] T164 [P] [US3] Add integration test for audit retention metadata in `backend/tests/integration/test_audit_retention.py`
- [ ] T165 [P] [US3] Add Playwright restricted-content authorization journey in `frontend/tests/e2e/restricted_authorization.spec.ts`

### Implementation for User Story 3

- [ ] T166 [P] [US3] Define authorization request schemas in `backend/src/schemas/authorization_request.py`
- [ ] T167 [P] [US3] Define permission rule schemas in `backend/src/schemas/permission_rule.py`
- [ ] T168 [P] [US3] Define audit event schemas in `backend/src/schemas/audit_event.py`
- [ ] T169 [US3] Add permission and authorization indexes to migration in `infra/migrations/versions/0001_initial.py`
- [ ] T170 [US3] Implement confidentiality policy matrix in `backend/src/services/confidentiality_policy.py`
- [ ] T171 [US3] Implement sensitive content classifier stub in `backend/src/services/sensitive_content_service.py`
- [ ] T172 [US3] Implement desensitization service in `backend/src/services/desensitization_service.py`
- [ ] T173 [US3] Implement strict-control metadata projection in `backend/src/services/restricted_projection_service.py`
- [ ] T174 [US3] Implement authorization request service in `backend/src/services/authorization_request_service.py`
- [ ] T175 [US3] Implement authorization review service in `backend/src/services/authorization_review_service.py`
- [ ] T176 [US3] Extend authorization evaluator with project rules in `backend/src/services/authorization_service.py`
- [ ] T177 [US3] Extend authorization evaluator with confidentiality rules in `backend/src/services/authorization_service.py`
- [ ] T178 [US3] Extend authorization evaluator with exception rules in `backend/src/services/authorization_service.py`
- [ ] T179 [US3] Enforce permission filter in knowledge query service in `backend/src/services/knowledge_query_service.py`
- [ ] T180 [US3] Enforce permission filter in full-text retrieval service in `backend/src/services/fulltext_search_service.py`
- [ ] T181 [US3] Enforce permission filter in vector retrieval service in `backend/src/services/vector_search_service.py`
- [ ] T182 [US3] Enforce desensitized fragment rules in QA service in `backend/src/services/qa_service.py`
- [ ] T183 [US3] Emit access_denied audit events in authorization service in `backend/src/services/authorization_service.py`
- [ ] T184 [US3] Implement `POST /authorization-requests` route in `backend/src/api/routes/authorization_requests.py`
- [ ] T185 [US3] Implement `GET /authorization-requests` route in `backend/src/api/routes/authorization_requests.py`
- [ ] T186 [US3] Implement `POST /authorization-requests/{authorizationRequestId}/review` route in `backend/src/api/routes/authorization_requests.py`
- [ ] T187 [US3] Implement `GET /audit-events` route in `backend/src/api/routes/audit_events.py`
- [ ] T188 [US3] Create audit query service in `backend/src/services/audit_query_service.py`
- [ ] T189 [US3] Create frontend authorization API methods in `frontend/src/services/authorizationRequests.ts`
- [ ] T190 [US3] Create frontend audit API methods in `frontend/src/services/auditEvents.ts`
- [ ] T191 [US3] Create restricted metadata notice component in `frontend/src/features/security/RestrictedMetadataNotice.tsx`
- [ ] T192 [US3] Create authorization request drawer in `frontend/src/features/security/AuthorizationRequestDrawer.tsx`
- [ ] T193 [US3] Create authorization review queue component in `frontend/src/features/security/AuthorizationReviewQueue.tsx`
- [ ] T194 [US3] Create audit filter panel in `frontend/src/features/audit/AuditFilterPanel.tsx`
- [ ] T195 [US3] Create audit event table in `frontend/src/features/audit/AuditEventTable.tsx`
- [ ] T196 [US3] Create security administration page in `frontend/src/app/admin/security/page.tsx`
- [ ] T197 [US3] Create audit administration page in `frontend/src/app/admin/audit/page.tsx`
- [ ] T198 [US3] Add restricted-access seed data in `infra/seed/restricted_knowledge.json`

**Checkpoint**: User Story 3 proves the security boundary with denials, strict-access approvals, desensitization, and audit visibility.

---

## Phase 6: User Story 4 - 知识质量与生命周期运营 (Priority: P2)

**Goal**: Administrators and experts can collect quality signals, identify stale or weak knowledge, trigger lifecycle actions, and view operational statistics.

**Independent Test**: Record quality and usage signals for published knowledge, trigger expiration or low-quality review, remove or restore an item, and confirm the operations dashboard reflects counts, quality distribution, weak areas, and expert contribution.

### Tests for User Story 4

> Write these tests first and confirm they fail before implementation.

- [ ] T199 [P] [US4] Add contract test for `POST /quality-signals` in `backend/tests/contract/test_quality_signals_contract.py`
- [ ] T200 [P] [US4] Add integration test for quality signal capture in `backend/tests/integration/test_quality_signal_capture.py`
- [ ] T201 [P] [US4] Add integration test for expiration review trigger in `backend/tests/integration/test_expiration_review_trigger.py`
- [ ] T202 [P] [US4] Add integration test for lifecycle remove and restore in `backend/tests/integration/test_lifecycle_remove_restore.py`
- [ ] T203 [P] [US4] Add Playwright operations dashboard journey in `frontend/tests/e2e/operations_dashboard.spec.ts`

### Implementation for User Story 4

- [ ] T204 [P] [US4] Define QualitySignal model in `backend/src/models/quality_signal.py`
- [ ] T205 [P] [US4] Define quality signal schemas in `backend/src/schemas/quality_signal.py`
- [ ] T206 [US4] Add quality signal table to migration in `infra/migrations/versions/0001_initial.py`
- [ ] T207 [US4] Implement quality signal service in `backend/src/services/quality_signal_service.py`
- [ ] T208 [US4] Implement lifecycle review trigger service in `backend/src/services/lifecycle_review_service.py`
- [ ] T209 [US4] Implement lifecycle action service in `backend/src/services/lifecycle_action_service.py`
- [ ] T210 [US4] Implement operations statistics service in `backend/src/services/operations_stats_service.py`
- [ ] T211 [US4] Implement expiration scan worker in `backend/src/workers/expiration_scan.py`
- [ ] T212 [US4] Implement quality aggregation worker in `backend/src/workers/quality_aggregation.py`
- [ ] T213 [US4] Implement `POST /quality-signals` route in `backend/src/api/routes/quality_signals.py`
- [ ] T214 [US4] Implement lifecycle action handlers in `backend/src/api/routes/knowledge_items.py`
- [ ] T215 [US4] Implement operations summary route in `backend/src/api/routes/operations.py`
- [ ] T216 [US4] Emit lifecycle_change audit events in `backend/src/services/lifecycle_action_service.py`
- [ ] T217 [US4] Create frontend quality signal API methods in `frontend/src/services/qualitySignals.ts`
- [ ] T218 [US4] Create frontend operations API methods in `frontend/src/services/operations.ts`
- [ ] T219 [US4] Create knowledge feedback widget in `frontend/src/features/quality/KnowledgeFeedbackWidget.tsx`
- [ ] T220 [US4] Create lifecycle action panel in `frontend/src/features/lifecycle/LifecycleActionPanel.tsx`
- [ ] T221 [US4] Create operations metric cards in `frontend/src/features/operations/OperationsMetricCards.tsx`
- [ ] T222 [US4] Create operations dashboard page in `frontend/src/app/admin/operations/page.tsx`
- [ ] T223 [US4] Add lifecycle seed scenarios in `infra/seed/lifecycle_scenarios.json`

**Checkpoint**: User Story 4 enables quality and lifecycle operations without changing the MVP submission/search/security guarantees.

---

## Phase 7: User Story 5 - 面向上层 AI 应用的受控知识服务 (Priority: P2)

**Goal**: One pilot upper-level AI application can call a governed knowledge service on behalf of a user, receive permission-filtered citations, and produce auditable service-call records.

**Independent Test**: Register one pilot application, call the governed service as an authorized and unauthorized user, verify filtered citations and denied responses, and confirm service_call audit records exist.

### Tests for User Story 5

> Write these tests first and confirm they fail before implementation.

- [ ] T224 [P] [US5] Add contract test for `POST /knowledge-service/query` in `backend/tests/contract/test_knowledge_service_contract.py`
- [ ] T225 [P] [US5] Add integration test for governed retrieve request in `backend/tests/integration/test_knowledge_service_retrieve.py`
- [ ] T226 [P] [US5] Add integration test for governed QA request in `backend/tests/integration/test_knowledge_service_qa.py`
- [ ] T227 [P] [US5] Add integration test for AI-service denial audit in `backend/tests/integration/test_knowledge_service_denial_audit.py`
- [ ] T228 [P] [US5] Add Playwright pilot application console journey in `frontend/tests/e2e/ai_service_pilot.spec.ts`

### Implementation for User Story 5

- [ ] T229 [P] [US5] Define KnowledgeServiceRequest model in `backend/src/models/knowledge_service_request.py`
- [ ] T230 [P] [US5] Define knowledge service schemas in `backend/src/schemas/knowledge_service.py`
- [ ] T231 [US5] Add knowledge service request table to migration in `infra/migrations/versions/0001_initial.py`
- [ ] T232 [US5] Extend Citation model for generated output references in `backend/src/models/citation.py`
- [ ] T233 [US5] Implement pilot application registry service in `backend/src/services/application_registry_service.py`
- [ ] T234 [US5] Implement knowledge service request logger in `backend/src/services/knowledge_service_log_service.py`
- [ ] T235 [US5] Implement governed retrieve service in `backend/src/services/governed_retrieve_service.py`
- [ ] T236 [US5] Implement governed QA service in `backend/src/services/governed_qa_service.py`
- [ ] T237 [US5] Implement governed recommendation service in `backend/src/services/governed_recommendation_service.py`
- [ ] T238 [US5] Enforce application permission rules in `backend/src/services/authorization_service.py`
- [ ] T239 [US5] Emit service_call audit events in `backend/src/services/knowledge_service_log_service.py`
- [ ] T240 [US5] Implement `POST /knowledge-service/query` route in `backend/src/api/routes/knowledge_service.py`
- [ ] T241 [US5] Create frontend knowledge service API methods in `frontend/src/services/knowledgeService.ts`
- [ ] T242 [US5] Create pilot application request form in `frontend/src/features/aiService/PilotRequestForm.tsx`
- [ ] T243 [US5] Create pilot service response viewer in `frontend/src/features/aiService/PilotResponseViewer.tsx`
- [ ] T244 [US5] Create pilot service audit panel in `frontend/src/features/aiService/PilotAuditPanel.tsx`
- [ ] T245 [US5] Create AI service pilot page in `frontend/src/app/admin/ai-service/page.tsx`
- [ ] T246 [US5] Add pilot application seed data in `infra/seed/pilot_applications.json`
- [ ] T247 [US5] Update quickstart AI pilot scenario commands in `specs/001-private-knowledge-flow/quickstart.md`

**Checkpoint**: User Story 5 validates the governed knowledge-service path for one upper-level AI pilot.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, verification, documentation, and readiness checks that span multiple stories.

- [ ] T248 [P] Add OpenAPI schema validation test in `backend/tests/contract/test_openapi_schema_validation.py`
- [ ] T249 [P] Add backend unit tests for authorization edge cases in `backend/tests/unit/test_authorization_service.py`
- [ ] T250 [P] Add backend unit tests for retention calculations in `backend/tests/unit/test_retention_service.py`
- [ ] T251 [P] Add backend unit tests for lifecycle filtering in `backend/tests/unit/test_lifecycle_filter_service.py`
- [ ] T252 [P] Add backend unit tests for desensitization rules in `backend/tests/unit/test_desensitization_service.py`
- [ ] T253 [P] Add frontend unit smoke test setup in `frontend/src/components/AppProviders.test.tsx`
- [ ] T254 Configure backend lint command in `backend/pyproject.toml`
- [ ] T255 Configure frontend lint command in `frontend/package.json`
- [ ] T256 Add database backup script in `infra/docker/backup-postgres.sh`
- [ ] T257 Add object storage backup script in `infra/docker/backup-minio.sh`
- [ ] T258 Add local restore script in `infra/docker/restore-dev.sh`
- [ ] T259 Add service healthcheck definitions in `infra/docker/docker-compose.dev.yml`
- [ ] T260 Add observability configuration in `infra/docker/observability.yml`
- [ ] T261 Add security hardening checklist in `docs/security-hardening.md`
- [ ] T262 Add operations runbook in `docs/operations-runbook.md`
- [ ] T263 Add pilot acceptance checklist in `docs/pilot-acceptance.md`
- [ ] T264 Update repository implementation notes in `AGENTS.md`
- [ ] T265 Run backend contract suite and record command in `specs/001-private-knowledge-flow/quickstart.md`
- [ ] T266 Run backend integration suite and record command in `specs/001-private-knowledge-flow/quickstart.md`
- [ ] T267 Run frontend Playwright suite and record command in `specs/001-private-knowledge-flow/quickstart.md`
- [ ] T268 Run full quickstart validation and record completion signal in `specs/001-private-knowledge-flow/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 US1**: Depends on Phase 2 and delivers the MVP.
- **Phase 4 US2**: Depends on Phase 2; can run after or in parallel with US1, but demo quality improves if US1 seed/publish flow exists.
- **Phase 5 US3**: Depends on Phase 2; can run after or in parallel with US1/US2, but should be validated before production pilot.
- **Phase 6 US4**: Depends on Phase 2 and benefits from US1 published items.
- **Phase 7 US5**: Depends on Phase 2 and benefits from US2 retrieval plus US3 security rules.
- **Phase 8 Polish**: Depends on the user stories selected for the release.

### User Story Dependencies

- **US1 (P1)**: No story dependency after foundation; recommended MVP.
- **US2 (P1)**: Independent after foundation if seed data exists; naturally reuses published knowledge from US1.
- **US3 (P1)**: Independent after foundation; must be complete before any sensitive pilot exposure.
- **US4 (P2)**: Independent after foundation with seed data; more valuable after US1/US2.
- **US5 (P2)**: Independent service shell after foundation; complete validation depends on US2 retrieval and US3 authorization.

### Within Each User Story

- Contract and integration tests come before implementation.
- Models and schemas come before migrations, services, and routes.
- Services come before API routes.
- API routes come before frontend screens.
- Frontend screens come before Playwright journey validation.
- Audit and retention behavior must be validated before a story checkpoint is accepted.

---

## Parallel Opportunities

- Setup tasks T003-T011 and T017-T019 can be done in parallel after T001-T002.
- Foundational client wrappers T053-T056 can run in parallel after settings are defined.
- US1 model tasks T074-T079 and schema tasks T081-T085 can run in parallel.
- US2 contract tests T117-T120 and integration tests T121-T123 can run in parallel.
- US3 authorization, audit, and frontend security components can split across separate files after core policies exist.
- US4 worker, dashboard, and quality signal API work can split after the quality model is created.
- US5 pilot frontend components T242-T244 can run in parallel after the API service contract is stable.

## Parallel Example: User Story 1

```bash
Task: "T074 [P] [US1] Define KnowledgeSource model in backend/src/models/knowledge_source.py"
Task: "T075 [P] [US1] Define KnowledgeItem model in backend/src/models/knowledge_item.py"
Task: "T076 [P] [US1] Define KnowledgeVersion model in backend/src/models/knowledge_version.py"
Task: "T081 [P] [US1] Define knowledge source schemas in backend/src/schemas/knowledge_source.py"
Task: "T082 [P] [US1] Define knowledge item schemas in backend/src/schemas/knowledge_item.py"
```

## Parallel Example: User Story 2

```bash
Task: "T119 [P] [US2] Add contract test for POST /search in backend/tests/contract/test_search_contract.py"
Task: "T120 [P] [US2] Add contract test for POST /qa in backend/tests/contract/test_qa_contract.py"
Task: "T133 [US2] Implement full-text retrieval service in backend/src/services/fulltext_search_service.py"
Task: "T134 [US2] Implement semantic retrieval service in backend/src/services/vector_search_service.py"
```

## Parallel Example: User Story 3

```bash
Task: "T166 [P] [US3] Define authorization request schemas in backend/src/schemas/authorization_request.py"
Task: "T167 [P] [US3] Define permission rule schemas in backend/src/schemas/permission_rule.py"
Task: "T168 [P] [US3] Define audit event schemas in backend/src/schemas/audit_event.py"
Task: "T191 [US3] Create restricted metadata notice component in frontend/src/features/security/RestrictedMetadataNotice.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "T199 [P] [US4] Add contract test for POST /quality-signals in backend/tests/contract/test_quality_signals_contract.py"
Task: "T207 [US4] Implement quality signal service in backend/src/services/quality_signal_service.py"
Task: "T211 [US4] Implement expiration scan worker in backend/src/workers/expiration_scan.py"
Task: "T221 [US4] Create operations metric cards in frontend/src/features/operations/OperationsMetricCards.tsx"
```

## Parallel Example: User Story 5

```bash
Task: "T224 [P] [US5] Add contract test for POST /knowledge-service/query in backend/tests/contract/test_knowledge_service_contract.py"
Task: "T235 [US5] Implement governed retrieve service in backend/src/services/governed_retrieve_service.py"
Task: "T236 [US5] Implement governed QA service in backend/src/services/governed_qa_service.py"
Task: "T242 [US5] Create pilot application request form in frontend/src/features/aiService/PilotRequestForm.tsx"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational.
3. Complete Phase 3 US1.
4. Stop and validate the submit-review-publish flow independently.
5. Demo the MVP before adding retrieval, strict authorization, lifecycle operations, or AI-service calls.

### Security-Gated Pilot Path

1. Complete US1 to create published knowledge.
2. Complete US2 to prove filtered retrieval, QA, citations, and lifecycle exclusion.
3. Complete US3 before exposing sensitive or strictly controlled pilot content.
4. Complete US5 only after the governed retrieval and authorization decisions are stable.

### Incremental Delivery

1. Setup + Foundation -> local app shell, persistence, identity, audit, and authorization primitives.
2. US1 -> governed intake and publication MVP.
3. US2 -> search, QA, citations, and reuse.
4. US3 -> strict security, desensitization, authorization requests, and audit querying.
5. US4 -> quality and lifecycle operations.
6. US5 -> one governed upper-level AI service pilot.
7. Polish -> hardening, backups, monitoring, documentation, and full quickstart validation.

### Task Execution Rules

- Keep each task scoped to its named file.
- Commit after each small group that passes its local tests.
- Do not implement a later route by weakening authorization or audit checks.
- Do not expose sensitive or strictly controlled content through search, QA, export, download, or service calls without the US3 policy path.
- Keep OpenSearch and Qdrant as derived indexes; PostgreSQL remains the workflow, permission, audit, and metadata source of truth.
