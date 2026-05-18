# Tasks: 企业内部知识库与受控流转体系

**Input**: Design documents from `/specs/001-private-knowledge-flow/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`, `frontend-integration.md`, `quickstart.md`

**Tests**: Included. `research.md` requires contract and integration tests before implementation for permission filtering, citations, lifecycle exclusions, and service-call auditing.

**Frontend Decision**: Use the existing external frontend repository `https://github.com/HaoWinchester/puhua_KnowledgeUI.git` at `../puhua_KnowledgeUI`. Do not scaffold a new frontend in this repository.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently after the shared foundation is complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel after this phase's prerequisites are ready because it touches a different file or isolated concern
- **[Story]**: User story label for story phases only
- Every task includes an exact repository-relative or sibling-repository path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create backend, infrastructure, and external frontend integration skeletons required by the implementation plan.

- [X] T001 Create backend package entrypoint in `backend/src/__init__.py`
- [X] T002 Create FastAPI application shell in `backend/src/main.py`
- [X] T003 [P] Create backend API package marker in `backend/src/api/__init__.py`
- [X] T004 [P] Create backend route package marker in `backend/src/api/routes/__init__.py`
- [X] T005 [P] Create backend dependency package marker in `backend/src/api/dependencies/__init__.py`
- [X] T006 [P] Create backend core package marker in `backend/src/core/__init__.py`
- [X] T007 [P] Create backend model package marker in `backend/src/models/__init__.py`
- [X] T008 [P] Create backend schema package marker in `backend/src/schemas/__init__.py`
- [X] T009 [P] Create backend service package marker in `backend/src/services/__init__.py`
- [X] T010 [P] Create backend integration package marker in `backend/src/integrations/__init__.py`
- [X] T011 [P] Create backend worker package marker in `backend/src/workers/__init__.py`
- [X] T012 Define backend runtime dependencies in `backend/requirements.txt`
- [X] T013 Define backend development dependencies in `backend/requirements-dev.txt`
- [X] T014 Configure pytest defaults in `backend/pytest.ini`
- [X] T015 Configure Alembic entrypoint in `backend/alembic.ini`
- [X] T016 Create Alembic environment loader in `infra/migrations/env.py`
- [X] T017 [P] Create backend contract test package marker in `backend/tests/contract/__init__.py`
- [X] T018 [P] Create backend integration test package marker in `backend/tests/integration/__init__.py`
- [X] T019 [P] Create backend unit test package marker in `backend/tests/unit/__init__.py`
- [X] T020 Create local service compose file in `infra/docker/docker-compose.dev.yml`
- [X] T021 Document backend environment variables in `.env.example`
- [X] T022 Add frontend API environment template in `../puhua_KnowledgeUI/.env.example`
- [X] T023 Add frontend API base config file in `../puhua_KnowledgeUI/src/lib/api-config.ts`
- [X] T024 Add frontend typed API client shell in `../puhua_KnowledgeUI/src/lib/api-client.ts`
- [X] T025 Add frontend query key factory shell in `../puhua_KnowledgeUI/src/lib/query-keys.ts`
- [X] T026 Add frontend DTO mapper shell in `../puhua_KnowledgeUI/src/lib/api-mappers.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared backend configuration, persistence, identity, authorization primitives, audit plumbing, CORS, and frontend integration primitives.

**Critical**: No user story work starts until this phase is complete.

- [X] T027 Implement typed environment settings in `backend/src/core/settings.py`
- [X] T028 Implement structured logging configuration in `backend/src/core/logging.py`
- [X] T029 Implement application error types in `backend/src/core/errors.py`
- [X] T030 Implement API exception handlers in `backend/src/api/dependencies/error_handlers.py`
- [X] T031 Configure async SQLAlchemy engine in `backend/src/core/database.py`
- [X] T032 Create declarative model base in `backend/src/models/base.py`
- [X] T033 Create shared timestamp mixin in `backend/src/models/mixins.py`
- [X] T034 Create first Alembic revision placeholder in `infra/migrations/versions/0001_initial.py`
- [X] T035 Implement database session dependency in `backend/src/api/dependencies/session.py`
- [X] T036 Implement repository transaction helper in `backend/src/services/unit_of_work.py`
- [X] T037 Define shared enum values in `backend/src/models/enums.py`
- [X] T038 Define shared Pydantic config base in `backend/src/schemas/base.py`
- [X] T039 Implement request correlation middleware in `backend/src/api/dependencies/request_context.py`
- [X] T040 Implement CORS middleware configuration for Vite frontend in `backend/src/api/dependencies/cors.py`
- [X] T041 Implement bearer token parsing dependency in `backend/src/api/dependencies/auth.py`
- [X] T042 Implement unified identity stub client in `backend/src/integrations/identity_stub.py`
- [X] T043 Implement current user resolver service in `backend/src/services/identity_service.py`
- [X] T044 Implement `/health` route in `backend/src/api/routes/health.py`
- [X] T045 Implement `/me` route in `backend/src/api/routes/me.py`
- [X] T046 Register base routes and middleware in `backend/src/main.py`
- [X] T047 Define UserIdentity model in `backend/src/models/user_identity.py`
- [X] T048 Define AuditEvent model in `backend/src/models/audit_event.py`
- [X] T049 Define PermissionRule model in `backend/src/models/permission_rule.py`
- [X] T050 Define AuthorizationRequest model in `backend/src/models/authorization_request.py`
- [X] T051 Implement audit retention date helper in `backend/src/services/retention_service.py`
- [X] T052 Implement append-only audit service in `backend/src/services/audit_service.py`
- [X] T053 Implement authorization decision value object in `backend/src/services/authorization_types.py`
- [X] T054 Implement local permission rule evaluator in `backend/src/services/authorization_service.py`
- [X] T055 Implement object storage client wrapper in `backend/src/integrations/object_storage.py`
- [X] T056 Implement OpenSearch client wrapper in `backend/src/integrations/opensearch_client.py`
- [X] T057 Implement Qdrant client wrapper in `backend/src/integrations/qdrant_client.py`
- [X] T058 Implement Redis client wrapper in `backend/src/integrations/redis_client.py`
- [X] T059 Implement Celery application setup in `backend/src/workers/celery_app.py`
- [X] T060 Create backend test fixtures in `backend/tests/conftest.py`
- [X] T061 Create seed identity users in `infra/seed/users.json`
- [X] T062 Create seed confidentiality roles in `infra/seed/roles.json`
- [X] T063 Define frontend API DTO types in `../puhua_KnowledgeUI/src/lib/api-types.ts`
- [X] T064 Implement frontend JSON fetch wrapper in `../puhua_KnowledgeUI/src/lib/api-client.ts`
- [X] T065 Implement frontend API error normalizer in `../puhua_KnowledgeUI/src/lib/api-errors.ts`
- [X] T066 Implement frontend enum label mappers in `../puhua_KnowledgeUI/src/lib/api-mappers.ts`
- [X] T067 Add React Query client provider to root route in `../puhua_KnowledgeUI/src/routes/__root.tsx`
- [X] T068 Add current-user API module in `../puhua_KnowledgeUI/src/lib/me-api.ts`
- [X] T069 Replace hard-coded current user display with `/me` query in `../puhua_KnowledgeUI/src/components/app-sidebar.tsx`
- [X] T070 Add frontend API health smoke helper in `../puhua_KnowledgeUI/src/lib/health-api.ts`
- [X] T071 Add local backend URL notes to frontend README in `../puhua_KnowledgeUI/README.md`
- [X] T072 Add backend/frontend startup notes to quickstart in `specs/001-private-knowledge-flow/quickstart.md`

**Checkpoint**: Backend app starts, `/health` and `/me` are callable from the existing Vite frontend, database sessions work, and frontend API client primitives exist.

---

## Phase 3: User Story 1 - 知识提交与受控入库 (Priority: P1) MVP

**Goal**: Users can submit knowledge with required metadata, route it through review, publish it as a traceable knowledge card, and submit later versions from the existing UI.

**Independent Test**: Use `../puhua_KnowledgeUI/src/routes/submit.tsx` and `../puhua_KnowledgeUI/src/routes/review.tsx` to submit one manual upload or link-reference item, approve it, and confirm the published card appears in the existing library UI.

### Tests for User Story 1

> Write these tests first and confirm they fail before implementation.

- [ ] T073 [P] [US1] Add contract test for `POST /knowledge-items` in `backend/tests/contract/test_knowledge_submission_contract.py`
- [ ] T074 [P] [US1] Add contract test for `GET /intake-requests` in `backend/tests/contract/test_intake_requests_contract.py`
- [ ] T075 [P] [US1] Add contract test for `POST /intake-requests/{id}/review` in `backend/tests/contract/test_intake_review_contract.py`
- [ ] T076 [P] [US1] Add contract tests for `POST /knowledge-items/{id}/versions` in `backend/tests/contract/test_knowledge_versions_contract.py` and `POST /business-action-bindings` in `backend/tests/contract/test_business_action_bindings_contract.py`
- [ ] T077 [P] [US1] Add integration test for submit-review-publish flow in `backend/tests/integration/test_submit_review_publish_flow.py`
- [ ] T078 [P] [US1] Add integration test for required metadata validation in `backend/tests/integration/test_submission_metadata_validation.py`
- [ ] T079 [P] [US1] Add integration test for business-action binding intake and sensitive precheck routing in `backend/tests/integration/test_sensitive_submission_precheck.py`
- [ ] T080 [P] [US1] Add frontend submission journey test in `../puhua_KnowledgeUI/tests/e2e/submit-review-publish.spec.ts`

### Implementation for User Story 1

- [ ] T081 [P] [US1] Define KnowledgeSource and BusinessActionBinding models in `backend/src/models/knowledge_source.py` and `backend/src/models/business_action_binding.py`
- [ ] T082 [P] [US1] Define KnowledgeItem model in `backend/src/models/knowledge_item.py`
- [ ] T083 [P] [US1] Define KnowledgeVersion model in `backend/src/models/knowledge_version.py`
- [ ] T084 [P] [US1] Define IntakeRequest model in `backend/src/models/intake_request.py`
- [ ] T085 [P] [US1] Define ReviewDecision model in `backend/src/models/review_decision.py`
- [ ] T086 [P] [US1] Define ClassificationAssignment model in `backend/src/models/classification_assignment.py`
- [ ] T087 [US1] Add knowledge intake and business-action binding tables to migration in `infra/migrations/versions/0001_initial.py`
- [ ] T088 [P] [US1] Define knowledge source and business-action binding schemas in `backend/src/schemas/knowledge_source.py` and `backend/src/schemas/business_action_binding.py`
- [ ] T089 [P] [US1] Define knowledge item schemas in `backend/src/schemas/knowledge_item.py`
- [ ] T090 [P] [US1] Define knowledge version schemas in `backend/src/schemas/knowledge_version.py`
- [ ] T091 [P] [US1] Define intake request schemas in `backend/src/schemas/intake_request.py`
- [ ] T092 [P] [US1] Define review decision schemas in `backend/src/schemas/review_decision.py`
- [ ] T093 [US1] Implement source registration and business-action binding service in `backend/src/services/source_service.py`
- [ ] T094 [US1] Implement submission metadata validator in `backend/src/services/submission_validation_service.py`
- [ ] T095 [US1] Implement duplicate precheck service in `backend/src/services/duplicate_precheck_service.py`
- [ ] T096 [US1] Implement confidentiality precheck service in `backend/src/services/confidentiality_precheck_service.py`
- [ ] T097 [US1] Implement reviewer routing service in `backend/src/services/reviewer_routing_service.py`
- [ ] T098 [US1] Implement intake workflow service in `backend/src/services/intake_service.py`
- [ ] T099 [US1] Implement publication service in `backend/src/services/publication_service.py`
- [ ] T100 [US1] Implement versioning service in `backend/src/services/version_service.py`
- [ ] T101 [US1] Implement classification assignment service in `backend/src/services/classification_service.py`
- [ ] T102 [US1] Implement document extraction worker stub in `backend/src/workers/document_extraction.py`
- [ ] T103 [US1] Implement source checksum worker stub in `backend/src/workers/source_integrity.py`
- [ ] T104 [US1] Implement `POST /knowledge-items` in `backend/src/api/routes/knowledge_items.py` and `POST /business-action-bindings` in `backend/src/api/routes/business_action_bindings.py`
- [ ] T105 [US1] Implement `PATCH /knowledge-items/{knowledgeItemId}` route in `backend/src/api/routes/knowledge_items.py`
- [ ] T106 [US1] Implement `GET /knowledge-items/{knowledgeItemId}/versions` route in `backend/src/api/routes/knowledge_versions.py`
- [ ] T107 [US1] Implement `POST /knowledge-items/{knowledgeItemId}/versions` route in `backend/src/api/routes/knowledge_versions.py`
- [ ] T108 [US1] Implement `GET /intake-requests` route in `backend/src/api/routes/intake_requests.py`
- [ ] T109 [US1] Implement `POST /intake-requests/{intakeRequestId}/review` route in `backend/src/api/routes/intake_requests.py`
- [ ] T110 [US1] Emit submit audit events in `backend/src/services/intake_service.py`
- [ ] T111 [US1] Emit review and publish audit events in `backend/src/services/intake_service.py`
- [ ] T112 [US1] Emit version_change audit events in `backend/src/services/version_service.py`
- [ ] T113 [US1] Add knowledge API methods for submit and versioning in `../puhua_KnowledgeUI/src/lib/knowledge-api.ts`
- [ ] T114 [US1] Add intake API methods for queue and decisions in `../puhua_KnowledgeUI/src/lib/review-api.ts`
- [ ] T115 [US1] Map submit form values to `KnowledgeSubmissionCreate`, including separate `knowledgeType` and `source.sourceType`, in `../puhua_KnowledgeUI/src/lib/api-mappers.ts`
- [ ] T116 [US1] Replace mock submit handler and business-action binding tab actions with mutations in `../puhua_KnowledgeUI/src/routes/submit.tsx`
- [ ] T117 [US1] Load intake queue from backend in `../puhua_KnowledgeUI/src/routes/review.tsx`
- [ ] T118 [US1] Replace review decision toast-only action with API mutation in `../puhua_KnowledgeUI/src/routes/review.tsx`
- [ ] T119 [US1] Refresh dashboard pending-review list from backend in `../puhua_KnowledgeUI/src/routes/index.tsx`
- [ ] T120 [US1] Support new-version submission entry from detail page in `../puhua_KnowledgeUI/src/routes/library.$id.tsx`
- [ ] T121 [US1] Add seed submission examples in `infra/seed/knowledge_submissions.json`
- [ ] T122 [US1] Add seed review tasks in `infra/seed/intake_requests.json`
- [ ] T123 [US1] Document submit-review-publish API calls in `specs/001-private-knowledge-flow/quickstart.md`
- [ ] T124 [US1] Document UI field mapping decisions in `specs/001-private-knowledge-flow/frontend-integration.md`

**Checkpoint**: User Story 1 is fully functional through the existing frontend and independently demonstrable as the MVP.

---

## Phase 4: User Story 2 - 可信检索、问答与复用 (Priority: P1)

**Goal**: Authorized users can filter, search, ask questions, see citations, and receive reusable recommendations through the existing library and AI chat pages.

**Independent Test**: Publish authorized and lifecycle-excluded knowledge, search with filters in `/library`, ask a question in `/ai-chat`, verify only authorized current material appears, and confirm answers include citations with version, scope, and review cue.

### Tests for User Story 2

> Write these tests first and confirm they fail before implementation.

- [ ] T125 [P] [US2] Add contract test for `GET /knowledge-items` filtering in `backend/tests/contract/test_list_knowledge_items_contract.py`
- [ ] T126 [P] [US2] Add contract test for `GET /knowledge-items/{id}` detail in `backend/tests/contract/test_get_knowledge_item_contract.py`
- [ ] T127 [P] [US2] Add contract test for `POST /search` in `backend/tests/contract/test_search_contract.py`
- [ ] T128 [P] [US2] Add contract test for `POST /qa` in `backend/tests/contract/test_qa_contract.py`
- [ ] T129 [P] [US2] Add integration test for permission-filtered search in `backend/tests/integration/test_permission_filtered_search.py`
- [ ] T130 [P] [US2] Add integration test for QA citations in `backend/tests/integration/test_qa_citations.py`
- [ ] T131 [P] [US2] Add integration test for lifecycle exclusion in `backend/tests/integration/test_lifecycle_exclusion.py`
- [ ] T132 [P] [US2] Add frontend library and AI chat journey test in `../puhua_KnowledgeUI/tests/e2e/search-qa-reuse.spec.ts`

### Implementation for User Story 2

- [ ] T133 [P] [US2] Define search request and response schemas in `backend/src/schemas/search.py`
- [ ] T134 [P] [US2] Define QA request and response schemas in `backend/src/schemas/qa.py`
- [ ] T135 [P] [US2] Define citation schemas in `backend/src/schemas/citation.py`
- [ ] T136 [US2] Define Citation model in `backend/src/models/citation.py`
- [ ] T137 [US2] Add citation table to migration in `infra/migrations/versions/0001_initial.py`
- [ ] T138 [US2] Implement lifecycle eligibility filter in `backend/src/services/lifecycle_filter_service.py`
- [ ] T139 [US2] Implement knowledge list query service in `backend/src/services/knowledge_query_service.py`
- [ ] T140 [US2] Implement metadata filter builder in `backend/src/services/metadata_filter_service.py`
- [ ] T141 [US2] Implement full-text retrieval service in `backend/src/services/fulltext_search_service.py`
- [ ] T142 [US2] Implement semantic retrieval service in `backend/src/services/vector_search_service.py`
- [ ] T143 [US2] Implement retrieval result merge service in `backend/src/services/retrieval_merge_service.py`
- [ ] T144 [US2] Implement citation assembly service in `backend/src/services/citation_service.py`
- [ ] T145 [US2] Implement answer generation adapter stub in `backend/src/integrations/model_gateway.py`
- [ ] T146 [US2] Implement QA orchestration service in `backend/src/services/qa_service.py`
- [ ] T147 [US2] Implement recommendation service in `backend/src/services/recommendation_service.py`
- [ ] T148 [US2] Implement `GET /knowledge-items` route in `backend/src/api/routes/knowledge_items.py`
- [ ] T149 [US2] Implement `GET /knowledge-items/{knowledgeItemId}` route in `backend/src/api/routes/knowledge_items.py`
- [ ] T150 [US2] Implement `POST /search` route in `backend/src/api/routes/search.py`
- [ ] T151 [US2] Implement `POST /qa` route in `backend/src/api/routes/qa.py`
- [ ] T152 [US2] Emit search audit events in `backend/src/services/knowledge_query_service.py`
- [ ] T153 [US2] Emit qa_call audit events in `backend/src/services/qa_service.py`
- [ ] T154 [US2] Implement indexing worker for published versions in `backend/src/workers/indexing.py`
- [ ] T155 [US2] Implement embedding worker for sanitized fragments in `backend/src/workers/embedding.py`
- [ ] T156 [US2] Add knowledge list/detail API methods in `../puhua_KnowledgeUI/src/lib/knowledge-api.ts`
- [ ] T157 [US2] Add search API methods in `../puhua_KnowledgeUI/src/lib/search-api.ts`
- [ ] T158 [US2] Add QA API methods in `../puhua_KnowledgeUI/src/lib/qa-api.ts`
- [ ] T159 [US2] Map backend knowledge cards to UI `KnowledgeItem` shape in `../puhua_KnowledgeUI/src/lib/api-mappers.ts`
- [ ] T160 [US2] Replace mock library list with backend query in `../puhua_KnowledgeUI/src/routes/library.tsx`
- [ ] T161 [US2] Wire library keyword and domain filters to backend query in `../puhua_KnowledgeUI/src/routes/library.tsx`
- [ ] T162 [US2] Wire library confidentiality and status filters to backend query in `../puhua_KnowledgeUI/src/routes/library.tsx`
- [ ] T163 [US2] Replace detail route mock loader with backend detail query in `../puhua_KnowledgeUI/src/routes/library.$id.tsx`
- [ ] T164 [US2] Render backend version list in detail tabs in `../puhua_KnowledgeUI/src/routes/library.$id.tsx`
- [ ] T165 [US2] Replace AI chat mock response with `/qa` mutation in `../puhua_KnowledgeUI/src/routes/ai-chat.tsx`
- [ ] T166 [US2] Render backend citation response cards in `../puhua_KnowledgeUI/src/routes/ai-chat.tsx`
- [ ] T167 [US2] Render backend blocked response state in `../puhua_KnowledgeUI/src/routes/ai-chat.tsx`
- [ ] T168 [US2] Refresh dashboard trending knowledge from backend in `../puhua_KnowledgeUI/src/routes/index.tsx`
- [ ] T169 [US2] Add searchable seed knowledge in `infra/seed/published_knowledge.json`
- [ ] T170 [US2] Document search and QA scenario commands in `specs/001-private-knowledge-flow/quickstart.md`
- [ ] T171 [US2] Document citation payload expectations in `specs/001-private-knowledge-flow/frontend-integration.md`

**Checkpoint**: User Story 2 works independently with authorized current knowledge, citations, recommendations, and lifecycle exclusions in the existing UI.

---

## Phase 5: User Story 3 - 权限、密级、脱敏与审计 (Priority: P1)

**Goal**: The system enforces unified identity plus local authorization rules, handles sensitive and strictly controlled knowledge safely, and powers the existing access and audit pages.

**Independent Test**: Unauthorized users cannot discover or consume restricted content; strictly controlled results expose metadata and an authorization entry until explicit approval; administrators can query access, denial, citation, export, service, and lifecycle audit events in `/audit`.

### Tests for User Story 3

> Write these tests first and confirm they fail before implementation.

- [ ] T172 [P] [US3] Add contract test for `POST /authorization-requests` in `backend/tests/contract/test_create_authorization_request_contract.py`
- [ ] T173 [P] [US3] Add contract test for `GET /authorization-requests` in `backend/tests/contract/test_list_authorization_requests_contract.py`
- [ ] T174 [P] [US3] Add contract test for `POST /authorization-requests/{id}/review` in `backend/tests/contract/test_review_authorization_request_contract.py`
- [ ] T175 [P] [US3] Add contract test for `GET /audit-events` in `backend/tests/contract/test_audit_events_contract.py`
- [ ] T176 [P] [US3] Add integration test for restricted search denial in `backend/tests/integration/test_restricted_search_denial.py`
- [ ] T177 [P] [US3] Add integration test for strictly controlled metadata-only behavior in `backend/tests/integration/test_strictly_controlled_metadata_only.py`
- [ ] T178 [P] [US3] Add integration test for explicit strict access approval in `backend/tests/integration/test_strict_access_approval.py`
- [ ] T179 [P] [US3] Add integration test for audit retention metadata in `backend/tests/integration/test_audit_retention.py`
- [ ] T180 [P] [US3] Add frontend restricted authorization journey test in `../puhua_KnowledgeUI/tests/e2e/restricted-authorization.spec.ts`

### Implementation for User Story 3

- [ ] T181 [P] [US3] Define authorization request schemas in `backend/src/schemas/authorization_request.py`
- [ ] T182 [P] [US3] Define permission rule schemas in `backend/src/schemas/permission_rule.py`
- [ ] T183 [P] [US3] Define audit event schemas in `backend/src/schemas/audit_event.py`
- [ ] T184 [US3] Add permission and authorization indexes to migration in `infra/migrations/versions/0001_initial.py`
- [ ] T185 [US3] Implement confidentiality policy matrix in `backend/src/services/confidentiality_policy.py`
- [ ] T186 [US3] Implement sensitive content classifier stub in `backend/src/services/sensitive_content_service.py`
- [ ] T187 [US3] Implement desensitization service in `backend/src/services/desensitization_service.py`
- [ ] T188 [US3] Implement strict-control metadata projection in `backend/src/services/restricted_projection_service.py`
- [ ] T189 [US3] Implement authorization request service in `backend/src/services/authorization_request_service.py`
- [ ] T190 [US3] Implement authorization review service in `backend/src/services/authorization_review_service.py`
- [ ] T191 [US3] Extend authorization evaluator with project rules in `backend/src/services/authorization_service.py`
- [ ] T192 [US3] Extend authorization evaluator with confidentiality rules in `backend/src/services/authorization_service.py`
- [ ] T193 [US3] Extend authorization evaluator with exception rules in `backend/src/services/authorization_service.py`
- [ ] T194 [US3] Enforce permission filter in knowledge query service in `backend/src/services/knowledge_query_service.py`
- [ ] T195 [US3] Enforce permission filter in full-text retrieval service in `backend/src/services/fulltext_search_service.py`
- [ ] T196 [US3] Enforce permission filter in vector retrieval service in `backend/src/services/vector_search_service.py`
- [ ] T197 [US3] Enforce desensitized fragment rules in QA service in `backend/src/services/qa_service.py`
- [ ] T198 [US3] Emit access_denied audit events in authorization service in `backend/src/services/authorization_service.py`
- [ ] T199 [US3] Implement `POST /authorization-requests` route in `backend/src/api/routes/authorization_requests.py`
- [ ] T200 [US3] Implement `GET /authorization-requests` route in `backend/src/api/routes/authorization_requests.py`
- [ ] T201 [US3] Implement `POST /authorization-requests/{authorizationRequestId}/review` route in `backend/src/api/routes/authorization_requests.py`
- [ ] T202 [US3] Implement `GET /audit-events` route in `backend/src/api/routes/audit_events.py`
- [ ] T203 [US3] Create audit query service in `backend/src/services/audit_query_service.py`
- [ ] T204 [US3] Add authorization API methods in `../puhua_KnowledgeUI/src/lib/access-api.ts`
- [ ] T205 [US3] Add audit API methods in `../puhua_KnowledgeUI/src/lib/audit-api.ts`
- [ ] T206 [US3] Map authorization statuses to UI labels in `../puhua_KnowledgeUI/src/lib/api-mappers.ts`
- [ ] T207 [US3] Map audit event types and results to UI labels in `../puhua_KnowledgeUI/src/lib/api-mappers.ts`
- [ ] T208 [US3] Replace access request mock list with backend query in `../puhua_KnowledgeUI/src/routes/access.tsx`
- [ ] T209 [US3] Replace access request dialog submit with API mutation in `../puhua_KnowledgeUI/src/routes/access.tsx`
- [ ] T210 [US3] Replace access approval buttons with API mutation in `../puhua_KnowledgeUI/src/routes/access.tsx`
- [ ] T211 [US3] Replace audit mock table with backend query in `../puhua_KnowledgeUI/src/routes/audit.tsx`
- [ ] T212 [US3] Wire audit filters to backend query parameters in `../puhua_KnowledgeUI/src/routes/audit.tsx`
- [ ] T213 [US3] Wire strict-control detail access dialog to backend request in `../puhua_KnowledgeUI/src/routes/library.$id.tsx`
- [ ] T214 [US3] Wire AI chat blocked response access link to authorization flow in `../puhua_KnowledgeUI/src/routes/ai-chat.tsx`
- [ ] T215 [US3] Add restricted-access seed data in `infra/seed/restricted_knowledge.json`
- [ ] T216 [US3] Document authorization and audit scenario commands in `specs/001-private-knowledge-flow/quickstart.md`

**Checkpoint**: User Story 3 proves the security boundary with denials, strict-access approvals, desensitization, and audit visibility in the existing UI.

---

## Phase 6: User Story 4 - 知识质量与生命周期运营 (Priority: P2)

**Goal**: Administrators and experts can collect quality signals, identify stale or weak knowledge, trigger lifecycle actions, and view operational statistics in the existing operations page.

**Independent Test**: Record quality and usage signals from `/library/$id`, trigger expiration or low-quality review, remove or restore an item, and confirm `/operations` reflects counts, quality distribution, weak areas, and expert contribution.

### Tests for User Story 4

> Write these tests first and confirm they fail before implementation.

- [ ] T217 [P] [US4] Add contract test for `POST /quality-signals` in `backend/tests/contract/test_quality_signals_contract.py`
- [ ] T218 [P] [US4] Add integration test for quality signal capture in `backend/tests/integration/test_quality_signal_capture.py`
- [ ] T219 [P] [US4] Add integration test for expiration review trigger in `backend/tests/integration/test_expiration_review_trigger.py`
- [ ] T220 [P] [US4] Add integration test for lifecycle remove and restore in `backend/tests/integration/test_lifecycle_remove_restore.py`
- [ ] T221 [P] [US4] Add frontend operations dashboard journey test in `../puhua_KnowledgeUI/tests/e2e/operations-dashboard.spec.ts`

### Implementation for User Story 4

- [ ] T222 [P] [US4] Define QualitySignal model in `backend/src/models/quality_signal.py`
- [ ] T223 [P] [US4] Define quality signal schemas in `backend/src/schemas/quality_signal.py`
- [ ] T224 [US4] Add quality signal table to migration in `infra/migrations/versions/0001_initial.py`
- [ ] T225 [US4] Implement quality signal service in `backend/src/services/quality_signal_service.py`
- [ ] T226 [US4] Implement lifecycle review trigger service in `backend/src/services/lifecycle_review_service.py`
- [ ] T227 [US4] Implement lifecycle action service in `backend/src/services/lifecycle_action_service.py`
- [ ] T228 [US4] Implement operations statistics service in `backend/src/services/operations_stats_service.py`
- [ ] T229 [US4] Implement expiration scan worker in `backend/src/workers/expiration_scan.py`
- [ ] T230 [US4] Implement quality aggregation worker in `backend/src/workers/quality_aggregation.py`
- [ ] T231 [US4] Implement `POST /quality-signals` route in `backend/src/api/routes/quality_signals.py`
- [ ] T232 [US4] Implement lifecycle action handlers in `backend/src/api/routes/knowledge_items.py`
- [ ] T233 [US4] Implement `GET /operations/summary` route in `backend/src/api/routes/operations.py`
- [ ] T234 [US4] Emit lifecycle_change audit events in `backend/src/services/lifecycle_action_service.py`
- [ ] T235 [US4] Add quality signal API methods in `../puhua_KnowledgeUI/src/lib/quality-api.ts`
- [ ] T236 [US4] Add operations dashboard API methods in `../puhua_KnowledgeUI/src/lib/operations-api.ts`
- [ ] T237 [US4] Wire detail feedback buttons to quality-signal API in `../puhua_KnowledgeUI/src/routes/library.$id.tsx`
- [ ] T238 [US4] Wire detail favorite and citation actions to quality-signal API in `../puhua_KnowledgeUI/src/routes/library.$id.tsx`
- [ ] T239 [US4] Replace operations static KPI cards with backend summary in `../puhua_KnowledgeUI/src/routes/operations.tsx`
- [ ] T240 [US4] Replace operations quality distribution with backend summary in `../puhua_KnowledgeUI/src/routes/operations.tsx`
- [ ] T241 [US4] Replace operations weak-area list with backend summary in `../puhua_KnowledgeUI/src/routes/operations.tsx`
- [ ] T242 [US4] Wire operations lifecycle action buttons to backend in `../puhua_KnowledgeUI/src/routes/operations.tsx`
- [ ] T243 [US4] Add lifecycle seed scenarios in `infra/seed/lifecycle_scenarios.json`
- [ ] T244 [US4] Document lifecycle and operations scenario commands in `specs/001-private-knowledge-flow/quickstart.md`

**Checkpoint**: User Story 4 enables quality and lifecycle operations without changing the MVP submission/search/security guarantees.

---

## Phase 7: User Story 5 - 面向上层 AI 应用的受控知识服务 (Priority: P2)

**Goal**: One pilot upper-level AI application can call a governed knowledge service, and `/integrations` can show endpoint, pilot apps, keys, call counts, denials, and global policies.

**Independent Test**: Register one pilot application, call the governed service as an authorized and unauthorized user, verify filtered citations and denied responses, and confirm `/integrations` and `/audit` show service_call records.

### Tests for User Story 5

> Write these tests first and confirm they fail before implementation.

- [ ] T245 [P] [US5] Add contract tests for `POST /knowledge-service/query`, `POST /api/v1/knowledge/query`, `GET /applications`, `POST /applications/{id}/keys/rotate`, and application policy routes in `backend/tests/contract/test_knowledge_service_contract.py`
- [ ] T246 [P] [US5] Add integration test for governed retrieve request in `backend/tests/integration/test_knowledge_service_retrieve.py`
- [ ] T247 [P] [US5] Add integration test for governed QA request in `backend/tests/integration/test_knowledge_service_qa.py`
- [ ] T248 [P] [US5] Add integration test for AI-service denial audit in `backend/tests/integration/test_knowledge_service_denial_audit.py`
- [ ] T249 [P] [US5] Add frontend integrations journey test in `../puhua_KnowledgeUI/tests/e2e/integrations-pilot.spec.ts`

### Implementation for User Story 5

- [ ] T250 [P] [US5] Define KnowledgeServiceRequest model in `backend/src/models/knowledge_service_request.py`
- [ ] T251 [P] [US5] Define knowledge service schemas in `backend/src/schemas/knowledge_service.py`
- [ ] T252 [US5] Add knowledge service request table to migration in `infra/migrations/versions/0001_initial.py`
- [ ] T253 [US5] Extend Citation model for generated output references in `backend/src/models/citation.py`
- [ ] T254 [US5] Implement pilot application registry service in `backend/src/services/application_registry_service.py`
- [ ] T255 [US5] Implement application key service in `backend/src/services/application_key_service.py`
- [ ] T256 [US5] Implement knowledge service request logger in `backend/src/services/knowledge_service_log_service.py`
- [ ] T257 [US5] Implement governed retrieve service in `backend/src/services/governed_retrieve_service.py`
- [ ] T258 [US5] Implement governed QA service in `backend/src/services/governed_qa_service.py`
- [ ] T259 [US5] Implement governed recommendation service in `backend/src/services/governed_recommendation_service.py`
- [ ] T260 [US5] Enforce application permission rules in `backend/src/services/authorization_service.py`
- [ ] T261 [US5] Emit service_call audit events in `backend/src/services/knowledge_service_log_service.py`
- [ ] T262 [US5] Implement `POST /knowledge-service/query` route and `/api/v1/knowledge/query` compatibility alias in `backend/src/api/routes/knowledge_service.py`
- [ ] T263 [US5] Implement `GET /applications` pilot application listing route in `backend/src/api/routes/applications.py`
- [ ] T264 [US5] Implement `POST /applications/{applicationId}/keys/rotate` route in `backend/src/api/routes/applications.py`
- [ ] T265 [US5] Add governed service API methods in `../puhua_KnowledgeUI/src/lib/integrations-api.ts`
- [ ] T266 [US5] Replace integrations endpoint card with backend config in `../puhua_KnowledgeUI/src/routes/integrations.tsx`
- [ ] T267 [US5] Replace integrations app table with backend app list in `../puhua_KnowledgeUI/src/routes/integrations.tsx`
- [ ] T268 [US5] Wire API key reveal and rotation actions to backend in `../puhua_KnowledgeUI/src/routes/integrations.tsx`
- [ ] T269 [US5] Wire global strategy switches to `GET /application-policies` and `PATCH /application-policies` in `../puhua_KnowledgeUI/src/routes/integrations.tsx`
- [ ] T270 [US5] Ensure AI chat can call governed service mode when configured in `../puhua_KnowledgeUI/src/routes/ai-chat.tsx`
- [ ] T271 [US5] Add pilot application seed data in `infra/seed/pilot_applications.json`
- [ ] T272 [US5] Document governed service request examples in `specs/001-private-knowledge-flow/quickstart.md`
- [ ] T273 [US5] Document integrations UI mapping in `specs/001-private-knowledge-flow/frontend-integration.md`
- [ ] T274 [US5] Add service-call audit seed examples in `infra/seed/service_call_audit_events.json`

**Checkpoint**: User Story 5 validates the governed knowledge-service path for one upper-level AI pilot.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, verification, documentation, and readiness checks that span multiple stories and both repositories.

- [ ] T275 [P] Add OpenAPI schema validation test in `backend/tests/contract/test_openapi_schema_validation.py`
- [ ] T276 [P] Add backend unit tests for authorization edge cases in `backend/tests/unit/test_authorization_service.py`
- [ ] T277 [P] Add backend unit tests for retention calculations in `backend/tests/unit/test_retention_service.py`
- [ ] T278 [P] Add backend unit tests for lifecycle filtering in `backend/tests/unit/test_lifecycle_filter_service.py`
- [ ] T279 [P] Add backend unit tests for desensitization rules in `backend/tests/unit/test_desensitization_service.py`
- [ ] T280 Configure backend lint command in `backend/pyproject.toml`
- [ ] T281 Configure frontend Playwright dependencies in `../puhua_KnowledgeUI/package.json`
- [ ] T282 Configure frontend Playwright project in `../puhua_KnowledgeUI/playwright.config.ts`
- [ ] T283 Add database backup script in `infra/docker/backup-postgres.sh`
- [ ] T284 Add object storage backup script in `infra/docker/backup-minio.sh`
- [ ] T285 Add local restore script in `infra/docker/restore-dev.sh`
- [ ] T286 Add service healthcheck definitions in `infra/docker/docker-compose.dev.yml`
- [ ] T287 Add observability configuration in `infra/docker/observability.yml`
- [ ] T288 Add security hardening checklist in `docs/security-hardening.md`
- [ ] T289 Add operations runbook in `docs/operations-runbook.md`
- [ ] T290 Add pilot acceptance checklist in `docs/pilot-acceptance.md`
- [ ] T291 Update backend repository implementation notes in `AGENTS.md`
- [ ] T292 Update frontend repository integration notes in `../puhua_KnowledgeUI/AGENTS.md`
- [ ] T293 Run backend contract suite and record command in `specs/001-private-knowledge-flow/quickstart.md`
- [ ] T294 Run backend integration suite and record command in `specs/001-private-knowledge-flow/quickstart.md`
- [ ] T295 Run existing frontend lint suite and record command in `specs/001-private-knowledge-flow/quickstart.md`
- [ ] T296 Run frontend journey suite and record command in `specs/001-private-knowledge-flow/quickstart.md`
- [ ] T297 Run full backend/frontend quickstart validation and record completion signal in `specs/001-private-knowledge-flow/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 US1**: Depends on Phase 2 and delivers the MVP through the existing UI.
- **Phase 4 US2**: Depends on Phase 2; can run after or in parallel with US1 if seed data exists.
- **Phase 5 US3**: Depends on Phase 2; must be validated before exposing sensitive or strictly controlled pilot content.
- **Phase 6 US4**: Depends on Phase 2 and benefits from US1 published items plus US2 usage signals.
- **Phase 7 US5**: Depends on Phase 2 and benefits from US2 retrieval plus US3 authorization.
- **Phase 8 Polish**: Depends on the user stories selected for the release.

### User Story Dependencies

- **US1 (P1)**: No story dependency after foundation; recommended MVP.
- **US2 (P1)**: Independent after foundation if seed data exists; naturally reuses published knowledge from US1.
- **US3 (P1)**: Independent after foundation; required before sensitive pilot use.
- **US4 (P2)**: Independent after foundation with seed data; more valuable after US1/US2.
- **US5 (P2)**: Independent service shell after foundation; complete validation depends on US2 retrieval and US3 authorization.

### Within Each User Story

- Contract and integration tests come before implementation.
- Backend models and schemas come before migrations, services, and routes.
- Backend services come before API routes.
- Frontend API modules and mappers come before route-level integration.
- Route-level integration comes before frontend journey validation.
- Audit and retention behavior must be validated before a story checkpoint is accepted.

---

## Parallel Opportunities

- Setup tasks T003-T011 and T017-T019 can run in parallel after T001-T002.
- Frontend integration shell tasks T022-T026 can run in parallel with backend setup tasks T012-T021.
- Foundational backend client wrappers T055-T058 can run in parallel after settings are defined.
- Frontend foundational files T063-T066 can run in parallel after T023-T026.
- US1 model tasks T081-T086 and schema tasks T088-T092 can run in parallel.
- US2 retrieval services T141-T144 can split across full-text, vector, merge, and citation work.
- US3 authorization, audit, access UI, and audit UI tasks can split across separate files after policy services exist.
- US4 worker, operations API, and operations UI tasks can split after the quality model is created.
- US5 pilot app registry, governed service, and integrations route work can split after the service contract is stable.

## Parallel Example: User Story 1

```bash
Task: "T081 [P] [US1] Define KnowledgeSource model in backend/src/models/knowledge_source.py"
Task: "T082 [P] [US1] Define KnowledgeItem model in backend/src/models/knowledge_item.py"
Task: "T088 [P] [US1] Define knowledge source schemas in backend/src/schemas/knowledge_source.py"
Task: "T113 [US1] Add knowledge API methods for submit and versioning in ../puhua_KnowledgeUI/src/lib/knowledge-api.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T127 [P] [US2] Add contract test for POST /search in backend/tests/contract/test_search_contract.py"
Task: "T128 [P] [US2] Add contract test for POST /qa in backend/tests/contract/test_qa_contract.py"
Task: "T141 [US2] Implement full-text retrieval service in backend/src/services/fulltext_search_service.py"
Task: "T142 [US2] Implement semantic retrieval service in backend/src/services/vector_search_service.py"
```

## Parallel Example: User Story 3

```bash
Task: "T181 [P] [US3] Define authorization request schemas in backend/src/schemas/authorization_request.py"
Task: "T182 [P] [US3] Define permission rule schemas in backend/src/schemas/permission_rule.py"
Task: "T204 [US3] Add authorization API methods in ../puhua_KnowledgeUI/src/lib/access-api.ts"
Task: "T205 [US3] Add audit API methods in ../puhua_KnowledgeUI/src/lib/audit-api.ts"
```

## Parallel Example: User Story 4

```bash
Task: "T217 [P] [US4] Add contract test for POST /quality-signals in backend/tests/contract/test_quality_signals_contract.py"
Task: "T225 [US4] Implement quality signal service in backend/src/services/quality_signal_service.py"
Task: "T229 [US4] Implement expiration scan worker in backend/src/workers/expiration_scan.py"
Task: "T236 [US4] Add operations dashboard API methods in ../puhua_KnowledgeUI/src/lib/operations-api.ts"
```

## Parallel Example: User Story 5

```bash
Task: "T245 [P] [US5] Add contract test for POST /knowledge-service/query in backend/tests/contract/test_knowledge_service_contract.py"
Task: "T257 [US5] Implement governed retrieve service in backend/src/services/governed_retrieve_service.py"
Task: "T258 [US5] Implement governed QA service in backend/src/services/governed_qa_service.py"
Task: "T265 [US5] Add governed service API methods in ../puhua_KnowledgeUI/src/lib/integrations-api.ts"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational.
3. Complete Phase 3 US1.
4. Stop and validate submit-review-publish through `../puhua_KnowledgeUI`.
5. Demo the MVP before adding retrieval, strict authorization, lifecycle operations, or AI-service calls.

### Frontend Integration Strategy

1. Preserve the existing route and visual structure in `../puhua_KnowledgeUI`.
2. Add API client, DTO types, mappers, and React Query hooks.
3. Replace `src/lib/mock-data.ts` usage route by route.
4. Keep UI labels in Chinese and map them to backend enum values at the API boundary.
5. Validate every replaced route against the FastAPI backend before removing fallback mock behavior.

### Security-Gated Pilot Path

1. Complete US1 to create published knowledge.
2. Complete US2 to prove filtered retrieval, QA, citations, and lifecycle exclusion.
3. Complete US3 before exposing sensitive or strictly controlled pilot content.
4. Complete US5 only after governed retrieval and authorization decisions are stable.

### Incremental Delivery

1. Setup + Foundation -> local app shell, persistence, identity, audit, authorization primitives, and frontend API client.
2. US1 -> governed intake and publication MVP through the existing UI.
3. US2 -> search, QA, citations, and reuse.
4. US3 -> strict security, desensitization, authorization requests, and audit querying.
5. US4 -> quality and lifecycle operations.
6. US5 -> one governed upper-level AI service pilot.
7. Polish -> hardening, backups, monitoring, documentation, and full quickstart validation.

### Task Execution Rules

- Keep each task scoped to its named file.
- Do not create a new frontend under this backend repository.
- Do not rewrite existing UI pages unless the task is explicitly replacing mock data with API integration.
- Commit backend repository changes and frontend repository changes separately.
- Do not implement a later route by weakening authorization or audit checks.
- Do not expose sensitive or strictly controlled content through search, QA, export, download, or service calls without the US3 policy path.
- Keep OpenSearch and Qdrant as derived indexes; PostgreSQL remains the workflow, permission, audit, and metadata source of truth.
