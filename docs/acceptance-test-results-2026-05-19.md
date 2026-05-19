# Acceptance Test Results: 2026-05-19

**Scope**: [Acceptance Test Matrix](./acceptance-test-matrix.md) AT-001 through AT-220  
**Environment**: Local backend `http://127.0.0.1:8002`, local frontend `http://127.0.0.1:3006`  
**Backend mode**: in-memory pilot backend, `MODEL_PROVIDER=zhipu`, `ZHIPU_MODEL=glm-4.5-flash`  
**Frontend mode**: Vite dev server against local backend  
**Secret handling**: model key was provided through process environment only; repository secret scan found no key material.

## Executive Result

| Result Type | Count | Meaning |
| --- | ---: | --- |
| Pass | 156 | Executed locally or directly covered by passing automated suites/API smoke/viewport checks. |
| Gap or Deferred | 24 | Local implementation or test scope does not yet satisfy the matrix item; track before production or backlog explicitly. |
| Manual Required | 10 | Requires business, security, domain expert, or pilot-user sign-off. |
| Production Blocked | 30 | Requires a real deployment environment, persistent services, secret store, gateway, backups, and release process. |
| Total | 220 | Every matrix item is accounted for. |

**Local functional acceptance is partially complete**: all executable local tests passed after one frontend defect was fixed.  
**Production acceptance is not complete**: deployment/security/ops items AT-191 through AT-220 remain blocked until the deployment environment exists.

## Commands Executed

| Area | Command / Probe | Result |
| --- | --- | --- |
| Clean backend dependency install | temp venv install from `backend/requirements-dev.txt` + `pip check` | PASS, no broken requirements in temp venv |
| Backend contract tests | `python3 -m pytest tests/contract` | PASS, 23 passed |
| Backend integration tests | `python3 -m pytest tests/integration` | PASS, 16 passed |
| Backend full tests | `python3 -m pytest` | PASS, 47 passed |
| Backend full tests in temp venv | `/tmp/private-knowledge-acceptance-venv/bin/python -m pytest` | PASS, 47 passed |
| Frontend dependency dry run | `npm install --legacy-peer-deps --package-lock=false --dry-run` | PASS |
| Frontend lint | `npm run lint` | PASS with 0 errors and 6 known Fast Refresh warnings |
| Frontend build | `npm run build` | PASS with known chunk-size warning |
| Frontend e2e | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3006 npm run test:e2e` | PASS, 5 passed |
| API smoke | 29 local API probes | PASS, 29 passed |
| Extended enum/source/signal smoke | 21 local API probes | PASS, 21 passed |
| Viewport smoke | 9 routes x 2 viewports | PASS, 18 passed after fix |
| Secret scan | `rg` for provided key fragments and `ZHIPU_API_KEY` patterns | PASS, no matches |
| Whitespace check | `git diff --check` | PASS |

## Defect Found And Fixed

| Item | Finding | Fix | Retest |
| --- | --- | --- | --- |
| AT-189 | Mobile viewport check found `/audit` caused page-level horizontal overflow. | Wrapped the audit table in an internal horizontal scroll container and hid overflow at the card boundary in [audit.tsx](../frontend/src/routes/audit.tsx). | Viewport smoke rerun passed 18/18 routes/viewports. |

## API Smoke Evidence

| Probe Group | Result | Evidence |
| --- | --- | --- |
| Health and identity | PASS | `/health` returned `{"status":"ok"}`; `/me` returned stub user `user-knowledge-admin`. |
| Knowledge list/detail/version | PASS | list returned items; detail returned current version; versions returned effective version. |
| Submission and review | PASS | created intake `REV-*`, approved it, resulting knowledge status became `published`. |
| Required metadata validation | PASS | incomplete submission returned `422`. |
| Reject and rectification decisions | PASS | `reject` produced `rejected`; `request_rectification` produced `rectification_required`. |
| Knowledge types | PASS | `note`, `meeting_output`, `code_practice`, `review`, `link`, `form` submissions returned `202`. |
| Source types | PASS | `manual_upload`, `link_reference`, `shared_directory_readonly`, `project_sample_readonly`, `form` submissions returned `202`. |
| Business action bindings | PASS | `project_review`, `presales_archive`, `delivery_review`, `recruitment_evaluation` returned `201`. |
| Search and filters | PASS | keyword search returned results and audit ID; confidentiality filter returned matching result set. |
| Live Zhipu QA | PASS | `/qa` returned answer, two citations, audit ID, and no fallback cue. |
| Strict controlled QA | PASS | strict query returned metadata citation with `fragmentRef=metadata`. |
| Authorization flow | PASS | authorization request created, listed, approved, and reject path also passed. |
| Quality signals | PASS | `browse`, `favorite`, `cite`, `qa_hit`, `rating`, `feedback`, and `useful` returned `201`. |
| Operations summary | PASS | summary returned new knowledge, reuse, expiring count, quality distribution, weak areas. |
| Knowledge service | PASS | `/knowledge-service/query` and `/api/v1/knowledge/query` returned success with citations. |
| Application management | PASS | listed pilot app, rotated masked key, read and patched policies. |
| Audit events | PASS | audit events included `submit`, `publish`, `version_change`, `search`, `qa_call`, `service_call`, `access_denied`, all with retention metadata. |

## Frontend Evidence

| Probe | Result | Evidence |
| --- | --- | --- |
| Main journeys | PASS | Playwright e2e passed submit/review, library/QA, authorization, operations, integrations. |
| Route availability | PASS | `/`, `/submit`, `/review`, `/library`, `/ai-chat`, `/access`, `/audit`, `/operations`, `/integrations` returned 200 in desktop and mobile viewports. |
| Desktop overflow | PASS | 9/9 routes had no page-level horizontal overflow at 1366x900. |
| Mobile overflow | PASS | 9/9 routes had no page-level horizontal overflow at 390x844 after `/audit` fix. |
| Build | PASS | Client and SSR builds completed successfully. |

## Complete Matrix Result Register

The register below accounts for every item in [acceptance-test-matrix.md](./acceptance-test-matrix.md).

### Passed Items

| Matrix IDs | Result | Evidence |
| --- | --- | --- |
| AT-001-AT-015 | PASS | Clean temp venv install, frontend install dry run, service start, `/health`, `/me`, CORS setting, backend suites, frontend lint/build/e2e, secret scan. |
| AT-016-AT-030 | PASS | Submission UI/API, required metadata validation, supported document/link/form intake, intake creation, business binding smoke. |
| AT-033-AT-039 | PASS | Sensitive/security routing covered by integration tests; frontend submit feedback and dashboard/backend intake data covered by e2e/API smoke. |
| AT-041-AT-054 | PASS | Review queue, approve/reject/rectification, publish, detail, version, audit, rejected/rectification exclusion covered by tests and API smoke. |
| AT-057-AT-084 | PASS | Knowledge card metadata, search filters, QA, citations, lifecycle exclusion, detail page, quality signal actions covered by tests/API/e2e. |
| AT-089-AT-106 | PASS | Search/QA audit, confidentiality enums, permission filtering, strict metadata-only behavior, authorization request/approval, sensitive precheck covered. |
| AT-112-AT-117 | PASS | Application policy prohibits training, identity/local authorization checks, service auth path, success/failure audit fields covered. |
| AT-125 | PASS | Audit retention metadata present on all local audit events. |
| AT-127-AT-133 | PASS | Quality signal capture and operations expiring summary covered by API smoke/integration tests. |
| AT-139-AT-145 | PASS | Operations page/backend summary covers new knowledge, reuse, expiring, quality distribution, weak areas, active expert count. |
| AT-147-AT-150 | PASS | Knowledge service retrieve/QA endpoints and compatibility alias return success and citations. |
| AT-154-AT-168 | PASS | Service-call audit, integrations page, key rotation, application policies, stub/live model paths, fallback behavior, context scoping, default model covered by tests/API smoke/prior fallback smoke. |
| AT-171-AT-189 | PASS | Frontend routes, API wiring, e2e journeys, desktop/mobile viewport checks passed after `/audit` overflow fix. |

### Gap Or Deferred Items

| Matrix IDs | Result | Reason / Required Follow-up |
| --- | --- | --- |
| AT-031 | DEFERRED | Low-quality content detection is not separately implemented beyond current precheck stubs; define scoring rules before production. |
| AT-032 | DEFERRED | Duplicate detection service exists as a stub but no real similarity/duplicate threshold is implemented. |
| AT-085 | DEFERRED | Recommendation behavior is not independently validated as a distinct capability from QA/search. |
| AT-107-AT-111 | DEFERRED | Sensitive categories are covered broadly, but customer/contract/source-code/quote/personnel-specific classifiers are not separately implemented. |
| AT-118-AT-124 | GAP | `/audit-events` currently returns all events and does not implement user/item/project/department/time/type/application query filters. |
| AT-134-AT-137 | DEFERRED | Quality threshold, negative feedback trigger, remove, and restore are not real stateful lifecycle actions yet. |
| AT-138 | GAP | Lifecycle review actions currently record quality signals, not `lifecycle_change` audit events. |
| AT-151 | DEFERRED | `recommend` request type has no distinct acceptance behavior from QA in current pilot. |
| AT-152-AT-153 | GAP | Upper-level AI strict-content denial behavior is not separately enforced and audited at the service layer. |
| AT-190 | DEFERRED | Frontend form error guidance was only partially covered by API `422`; detailed UI validation copy still needs a manual/interaction test. |

### Manual Required Items

| Matrix IDs | Result | Required Owner |
| --- | --- | --- |
| AT-040 | MANUAL REQUIRED | Business owner must confirm submission fields cover real pilot intake needs. |
| AT-055-AT-056 | MANUAL REQUIRED | Domain expert and security admin must confirm review fields support quality/security review. |
| AT-086-AT-088 | MANUAL REQUIRED | Pilot users/business reviewers must judge recommendation value, 3-minute retrieval success, and citation correctness. |
| AT-126 | MANUAL REQUIRED | Security admin must sign off confidentiality, authorization, and desensitization policy. |
| AT-146 | MANUAL REQUIRED | Knowledge admin must confirm operations metrics support pilot retrospectives. |
| AT-169-AT-170 | MANUAL REQUIRED | Deployment owner must rotate the exposed model key and configure production secret storage. |

### Production Blocked Items

| Matrix IDs | Result | Required Environment |
| --- | --- | --- |
| AT-191-AT-220 | PRODUCTION BLOCKED | Requires real deployment architecture, PostgreSQL migration rehearsal, object storage, OpenSearch/Qdrant, Redis/Celery workers, identity integration, API gateway auth, secret store, backup/restore drills, alerts, retention policy, release plan, pilot scope, performance baseline, backlog triage, and final sign-off. |

## Non-Blocking Warnings

- Frontend lint has 6 existing Fast Refresh warnings from shared UI component exports.
- Frontend build has a Vite chunk-size warning for large bundles.
- System-global `pip check` reports unrelated package conflicts in the shared Python installation; the clean temp venv install and `pip check` pass, so this is not a project dependency blocker.

## Acceptance Conclusion

Local functional verification is **passed with documented gaps**. The current code is good enough for continued local pilot validation, but not yet production-ready. The main blockers before deployment are:

1. Implement or explicitly defer audit query filters AT-118-AT-124.
2. Implement or explicitly defer real lifecycle remove/restore and `lifecycle_change` audit AT-134-AT-138.
3. Decide whether recommendation and upper-level AI strict-denial behavior are required for this release AT-151-AT-153.
4. Complete manual business/security/pilot sign-offs.
5. Build the production environment and execute AT-191-AT-220.
