# Frontend Integration: frontend/

## Source Location

- Repository: `https://github.com/HaoWinchester/private_Knowledge.git`
- Local path: `/Users/menghao/Documents/幻谱/普华科技/企业内部知识库/frontend`
- Frontend stack: TanStack Start, TanStack Router, Vite, React 19, React Query, Tailwind CSS, shadcn/Radix UI, lucide-react, sonner

## Integration Principle

The backend must integrate with this co-located UI instead of creating another frontend. The UI started as a complete prototype that read from `src/lib/mock-data.ts`; implementation adds API clients, field mappers, React Query hooks, and route-level mutations/queries while preserving the existing page layout and interaction model.

## Existing UI Routes

| UI route | Current file | Backend capability to connect |
| --- | --- | --- |
| `/` | `frontend/src/routes/index.tsx` | dashboard KPIs, pending reviews, trending knowledge |
| `/library` | `frontend/src/routes/library.tsx` | permission-filtered knowledge list and filters |
| `/library/$id` | `frontend/src/routes/library.$id.tsx` | knowledge detail, versions, restricted metadata, quality actions |
| `/submit` | `frontend/src/routes/submit.tsx` | create knowledge submission and submit new version |
| `/review` | `frontend/src/routes/review.tsx` | intake request queue and review decisions |
| `/access` | `frontend/src/routes/access.tsx` | authorization request creation and approval |
| `/audit` | `frontend/src/routes/audit.tsx` | audit event query and export |
| `/ai-chat` | `frontend/src/routes/ai-chat.tsx` | QA with citations and strict-control blocked responses |
| `/operations` | `frontend/src/routes/operations.tsx` | quality/lifecycle operations dashboard |
| `/integrations` | `frontend/src/routes/integrations.tsx` | governed knowledge service endpoint, pilot apps, keys, call metrics |

## Field Mapping

### Classification

| UI label | API enum |
| --- | --- |
| `公开内部` | `internal_public` |
| `部门可见` | `department_visible` |
| `项目可见` | `project_visible` |
| `敏感` | `sensitive` |
| `严格受控` | `strictly_controlled` |

### Knowledge Status

| UI label | API enum |
| --- | --- |
| `草稿` | `draft` |
| `待审核` | `pending_review` |
| `已发布` | `published` |
| `整改中` | `rectification_required` |
| `已驳回` | `rejected` |
| `已下架` | `removed` |
| `已过期` | `archived` or derived from `validUntil` |

### Knowledge Type

Submit payloads MUST send this as `knowledgeType`.

| UI label | API enum |
| --- | --- |
| `文档` | `document` |
| `笔记` | `note` |
| `会议纪要` | `meeting_output` |
| `项目资料` | `project_material` |
| `代码实践` | `code_practice` |
| `复盘` | `review` |
| `链接` | `link` |
| `表单` | `form` |

### Source Channel

Submit payloads MUST send this as `source.sourceType`.

| UI label | API enum |
| --- | --- |
| `人工上传` | `manual_upload` |
| `链接引用` | `link_reference` |
| `共享目录` | `shared_directory_readonly` |
| `项目样例` | `project_sample_readonly` |
| `结构化表单` | `form` |

### Review Type

| UI label | API enum |
| --- | --- |
| `知识管理员` | `knowledge_admin` |
| `领域专家` | `domain_expert` |
| `安全管理员` | `security_admin` |

### Authorization Status

| UI label | API enum |
| --- | --- |
| `待审批` | `submitted` |
| `已通过` | `approved` |
| `已拒绝` | `rejected` |

### Audit Result

| UI label | API enum |
| --- | --- |
| `成功` | `success` |
| `拒绝` | `denied` |
| `降级` | `failed` |

## Frontend Integration Files To Add

- `frontend/.env.example`: API base URL and mode flags
- `frontend/src/lib/api-config.ts`: API base URL resolution
- `frontend/src/lib/api-client.ts`: fetch wrapper with bearer token and JSON error handling
- `frontend/src/lib/api-types.ts`: TypeScript API DTOs mirroring OpenAPI schemas
- `frontend/src/lib/api-mappers.ts`: DTO-to-UI label mappers
- `frontend/src/lib/query-keys.ts`: React Query key factory
- `frontend/src/lib/knowledge-api.ts`: knowledge list/detail/submission/version API calls
- `frontend/src/lib/review-api.ts`: intake request and review API calls
- `frontend/src/lib/access-api.ts`: authorization request API calls
- `frontend/src/lib/audit-api.ts`: audit query API calls
- `frontend/src/lib/qa-api.ts`: QA API calls
- `frontend/src/lib/operations-api.ts`: quality and operations API calls
- `frontend/src/lib/integrations-api.ts`: governed knowledge service and pilot application API calls

## Backend Alignment Notes

- Keep `contracts/openapi.yaml` as the backend contract, but add adapter-friendly fields where useful instead of changing UI labels into backend storage values.
- Knowledge submission adapters must map the UI category to `knowledgeType` and the intake source/channel selector to `source.sourceType`; these two values are intentionally separate.
- Enable CORS for the Vite dev origin used by the frontend.
- Support both `POST /knowledge-service/query` and the existing UI-facing alias `POST /api/v1/knowledge/query`; every service request must include `applicationId`, `requesterUserId`, `businessContext`, and `input`, with `projectContext` included when the business action is project-scoped.
- Return `metadataOnly` and `authorizationRequestAvailable` for strictly controlled knowledge so `/library/$id` and `/ai-chat` can render the existing restricted banners.
- Always include citation IDs, version numbers, scope, and audit event IDs in QA/service responses because the UI already displays these concepts.
- Provide `GET /operations/summary` for the operations page, and `GET /applications`, `POST /applications/{applicationId}/keys/rotate`, `GET /application-policies`, and `PATCH /application-policies` for the integrations page.
- Provide `POST /business-action-bindings` so project review, presales archive, delivery review, and recruitment evaluation scenarios can be wired as knowledge intake triggers instead of being treated as ordinary manual submissions.

## Implemented Frontend Wiring

- `/submit` posts `KnowledgeSubmissionCreate` to `POST /knowledge-items`.
- `/review` reads `GET /intake-requests` and posts review decisions to `POST /intake-requests/{id}/review`.
- `/library` reads `GET /knowledge-items` with keyword, status, and confidentiality filters.
- `/library/$id` reads `GET /knowledge-items/{id}`, renders backend versions, posts new versions, quality signals, and strict access requests.
- `/ai-chat` posts to `/qa`, or to `/api/v1/knowledge/query` when `VITE_USE_GOVERNED_SERVICE=true`, and renders citations plus strict-control blocked states.
- `/access` reads and mutates authorization requests through `/authorization-requests`.
- `/audit` reads `/audit-events` and maps backend audit event/result labels to the UI.
- `/operations` reads `/operations/summary` and records lifecycle review actions through quality signals.
- `/integrations` reads pilot applications and application policies, and rotates keys through backend mutations.
