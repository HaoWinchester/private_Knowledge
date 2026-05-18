# Quickstart: 企业内部知识库与受控流转体系

This quickstart validates the first-phase closed loop described by the specification and implementation plan. Commands are proposed for the planned repository structure; actual commands may be adjusted when implementation files are created.

## Prerequisites

- Private or controlled-network development environment
- Python 3.11+
- Node.js 20+
- PostgreSQL
- Redis
- S3-compatible object storage such as MinIO
- OpenSearch
- Qdrant

## Environment Variables

```bash
export DATABASE_URL="postgresql+asyncpg://knowledge:knowledge@localhost:5432/knowledge"
export REDIS_URL="redis://localhost:6379/0"
export OBJECT_STORAGE_ENDPOINT="http://localhost:9000"
export OBJECT_STORAGE_BUCKET="knowledge"
export OPENSEARCH_URL="http://localhost:9200"
export QDRANT_URL="http://localhost:6333"
export IDENTITY_MODE="stub"
export MODEL_GATEWAY_URL="http://localhost:8088"
export CORS_ALLOWED_ORIGINS="http://localhost:3004"
```

## Planned Local Services

```bash
docker compose -f infra/docker/docker-compose.dev.yml up -d postgres redis minio opensearch qdrant
```

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
alembic upgrade head
pytest
uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
```

During local foundation testing, the backend defaults to `sqlite+aiosqlite:///./knowledge_dev.db` if `DATABASE_URL` is not set. Use the PostgreSQL URL above when validating migrations against the full local service stack.

Health check:

```bash
curl http://localhost:8001/health
```

## Existing Frontend

```bash
cd ../puhua_KnowledgeUI
npm install
npm run lint
cp .env.example .env.local
npm run dev -- --host 0.0.0.0 --port 3004
```

Open:

```text
http://localhost:3004
```

The frontend repository is `https://github.com/HaoWinchester/puhua_KnowledgeUI.git`. It already contains the user and admin pages for the pilot. Backend implementation should replace its current `src/lib/mock-data.ts` usage through API clients and mappers rather than creating a new frontend.

## Contract Validation

```bash
cd backend
pytest tests/contract
```

The contract tests should validate the OpenAPI flows in `specs/001-private-knowledge-flow/contracts/openapi.yaml`.

## Scenario Validation

### Scenario 1: Submit and publish knowledge

1. Login as a pilot employee from unified identity stub.
2. Submit a knowledge item using manual upload or link reference.
3. Provide source, owner, responsible user, role direction, business theme, project/customer context, confidentiality, summary, tags, scope, and validity period.
4. Confirm the item enters review.
5. Login as knowledge administrator or domain expert.
6. Approve the item.
7. Confirm the published knowledge card shows latest version, source, owner, scope, confidentiality, and lifecycle status.

### Scenario 2: Permission-filtered retrieval

1. Create two users: one authorized for the project and one unauthorized.
2. Publish one project-visible item and one strictly controlled item.
3. As the authorized user, search for the project-visible item and confirm content visibility.
4. As the unauthorized user, search for the same item and confirm it is excluded.
5. Search for the strictly controlled item without explicit approval and confirm only metadata and authorization entry are returned.

### Scenario 3: QA with citations

1. Ask a question that can be answered from published authorized knowledge.
2. Confirm the answer includes citation source, version, applicable scope, and review cue.
3. Confirm expired, removed, rejected, or superseded knowledge is not used as current formal reuse content.

### Scenario 4: Audit and retention

1. Browse, cite, export, and call knowledge through the pilot service path.
2. Confirm audit events include actor, time, operation, target, result, and reason when denied.
3. Confirm audit/approval/access/call records and archived/downstream historical versions have retention metadata of at least 3 years.

### Scenario 5: Upper-level AI pilot

1. Register one pilot upper-level AI application.
2. Call the governed knowledge service on behalf of a user.
3. Confirm the response is permission-filtered and includes citations.
4. Confirm the call is logged and denial behavior is recorded for restricted content.

## Expected Completion Signal

The first-phase plan is validated when the system can demonstrate:

- submission -> review -> publication
- permission-filtered search and QA
- citation and version traceability
- sensitive and strictly controlled knowledge behavior
- audit record retention metadata
- one governed upper-level AI service call path
