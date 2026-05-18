# Implementation Plan: 企业内部知识库与受控流转体系

**Branch**: `001-private-knowledge-flow` | **Date**: 2026-05-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-private-knowledge-flow/spec.md`

## Summary

建设一个私有化企业知识中台，先交付知识提交、人工审核、分类定密、版本追踪、权限过滤、检索问答、引用溯源、审计留痕和 1 个上层 AI 应用试点调用闭环。技术路线采用前后端分离 Web 应用：FastAPI 承载业务 API、权限/工作流/审计/RAG 编排；Next.js 承载员工端与管理员端；PostgreSQL 管元数据和流程状态；对象存储保存原文；OpenSearch 和 Qdrant 分别支撑关键词/全文检索与语义检索；Celery/Redis 处理文档解析、索引、脱敏、过期复核和质量运营任务。

## Technical Context

**Language/Version**: Python 3.11+ for backend and workers; TypeScript 5.x for frontend

**Primary Dependencies**: FastAPI, Pydantic v2, SQLAlchemy async, Alembic, Celery, Redis, Next.js 14, React 18, Ant Design 5, Zustand, Playwright, pytest

**Storage**: PostgreSQL for metadata/workflow/audit/RBAC; S3-compatible object storage such as MinIO for source files and derived artifacts; OpenSearch for full-text retrieval; Qdrant for vector retrieval; Redis for async coordination and short-lived caches

**Testing**: pytest for backend unit/integration/contract tests; Playwright for frontend smoke and journey tests; OpenAPI schema validation for API contracts

**Target Platform**: Private Linux server or internal container environment; browser-based internal web client; controlled network deployment

**Project Type**: Web application with backend API, async workers, frontend admin/user portal, and integration contracts

**Performance Goals**: Search and filtered list results should return within 3 seconds for pilot datasets; QA responses should stream or return first useful response within 10 seconds when retrieval succeeds; permission denial and metadata-only restricted results should return within 1 second; async indexing should complete within 15 minutes for typical pilot document batches

**Constraints**: Production data stays in private/controlled network; every search/QA/service response is permission-filtered before content exposure; sensitive knowledge can be used only as authorized desensitized fragments; strictly controlled knowledge returns metadata and authorization entry until explicit approval; audit/approval/access/call records and archived/downstream historical versions are retained for at least 3 years; first phase uses manual upload/link/readonly source access plus human review, not automatic full-system sync

**Scale/Scope**: First phase targets a pilot knowledge scope across sales, consulting, delivery, development, and HR scenarios; supports one upper-level AI application pilot call path; architecture should leave room for later OA/project/code/document-system integrations without making them first-phase blockers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The current `.specify/memory/constitution.md` is still the unfilled template and contains no ratified project principles. No binding constitutional gates can be evaluated yet.

- **Gate result before Phase 0**: PASS WITH ADVISORY. No enforceable violations detected because the constitution is not established.
- **Advisory**: Run `speckit-constitution` before implementation if this repository will be used as a long-lived delivery project.
- **Post-design re-check**: PASS WITH SAME ADVISORY. The generated design keeps scope incremental, includes auditability, security boundaries, testable contracts, and clear first-phase limits.

## Project Structure

### Documentation (this feature)

```text
specs/001-private-knowledge-flow/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   └── dependencies/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── integrations/
│   ├── workers/
│   └── main.py
└── tests/
    ├── contract/
    ├── integration/
    └── unit/

frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── services/
│   └── state/
└── tests/
    └── e2e/

infra/
├── docker/
├── migrations/
└── seed/
```

**Structure Decision**: Use a web application layout with separate `backend/`, `frontend/`, and `infra/` directories. This matches the feature's need for internal browser workflows, server-side authorization/RAG orchestration, async processing, and independent contract/E2E testing. `tasks.md` should create these directories only when implementation begins.

## Phase 0: Research Summary

Research output is captured in [research.md](./research.md). All planning unknowns were resolved without adding `NEEDS CLARIFICATION` markers.

Key decisions:

- Use FastAPI + Next.js monorepo rather than a document-only or script-only system.
- Use PostgreSQL as the source of truth for metadata, lifecycle, workflow, authorization rules, audit records, and service-call logs.
- Use object storage for original and derived files, plus OpenSearch and Qdrant for separate lexical and semantic retrieval paths.
- Implement local authorization rules on top of unified identity: identity supplies user/department/role, while the knowledge base owns project authorization, confidentiality authorization, and exceptions.
- Keep first-phase external source access read-only and human-reviewed.
- Expose one governed knowledge-service pilot path instead of trying to deliver all AI applications in phase one.

## Phase 1: Design & Contracts

Design artifacts:

- [data-model.md](./data-model.md)
- [contracts/openapi.yaml](./contracts/openapi.yaml)
- [quickstart.md](./quickstart.md)

The API contract is intentionally broad enough for the later implementation task generator to split work by user story while keeping first-phase scope bounded.

## Agent Context Update

The current Spec Kit installation does not include `.specify/scripts/bash/update-agent-context.sh`, so the scripted context update step could not be executed. The repository-level [AGENTS.md](../../AGENTS.md) already tells agents to read the current plan for technology and structure. A manual update was avoided to preserve the generated Speckit marker block.

## Complexity Tracking

No constitution violations require justification. The selected architecture has multiple persistence/indexing components, but they map directly to distinct requirements: metadata/workflow/audit, source files, full-text retrieval, semantic retrieval, and async processing. A simpler single-store design was rejected because it would weaken citation, retrieval quality, retention, and permission-filtered RAG requirements.
