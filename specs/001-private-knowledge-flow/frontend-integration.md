# Frontend Integration: puhua_KnowledgeUI

## Source Repository

- GitHub: `https://github.com/HaoWinchester/puhua_KnowledgeUI.git`
- Local sibling path used for inspection: `/Users/menghao/Documents/幻谱/普华科技/puhua_KnowledgeUI`
- Frontend stack: TanStack Start, TanStack Router, Vite, React 19, React Query, Tailwind CSS, shadcn/Radix UI, lucide-react, sonner

## Integration Principle

The backend must integrate with this existing UI instead of creating a new frontend. The current UI is a complete prototype that reads from `src/lib/mock-data.ts`; implementation should add API clients, field mappers, React Query hooks, and route-level mutations/queries while preserving the existing page layout and interaction model.

## Existing UI Routes

| UI route | Current file | Backend capability to connect |
| --- | --- | --- |
| `/` | `../puhua_KnowledgeUI/src/routes/index.tsx` | dashboard KPIs, pending reviews, trending knowledge |
| `/library` | `../puhua_KnowledgeUI/src/routes/library.tsx` | permission-filtered knowledge list and filters |
| `/library/$id` | `../puhua_KnowledgeUI/src/routes/library.$id.tsx` | knowledge detail, versions, restricted metadata, quality actions |
| `/submit` | `../puhua_KnowledgeUI/src/routes/submit.tsx` | create knowledge submission and submit new version |
| `/review` | `../puhua_KnowledgeUI/src/routes/review.tsx` | intake request queue and review decisions |
| `/access` | `../puhua_KnowledgeUI/src/routes/access.tsx` | authorization request creation and approval |
| `/audit` | `../puhua_KnowledgeUI/src/routes/audit.tsx` | audit event query and export |
| `/ai-chat` | `../puhua_KnowledgeUI/src/routes/ai-chat.tsx` | QA with citations and strict-control blocked responses |
| `/operations` | `../puhua_KnowledgeUI/src/routes/operations.tsx` | quality/lifecycle operations dashboard |
| `/integrations` | `../puhua_KnowledgeUI/src/routes/integrations.tsx` | governed knowledge service endpoint, pilot apps, keys, call metrics |

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

### Source Type

| UI label | API enum |
| --- | --- |
| `文档` | `manual_upload` |
| `笔记` | `form` |
| `会议纪要` | `form` |
| `项目资料` | `project_sample_readonly` |
| `代码实践` | `project_sample_readonly` |
| `复盘` | `project_sample_readonly` |
| `链接` | `link_reference` |
| `表单` | `form` |

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

- `../puhua_KnowledgeUI/.env.example`: API base URL and mode flags
- `../puhua_KnowledgeUI/src/lib/api-config.ts`: API base URL resolution
- `../puhua_KnowledgeUI/src/lib/api-client.ts`: fetch wrapper with bearer token and JSON error handling
- `../puhua_KnowledgeUI/src/lib/api-types.ts`: TypeScript API DTOs mirroring OpenAPI schemas
- `../puhua_KnowledgeUI/src/lib/api-mappers.ts`: DTO-to-UI label mappers
- `../puhua_KnowledgeUI/src/lib/query-keys.ts`: React Query key factory
- `../puhua_KnowledgeUI/src/lib/knowledge-api.ts`: knowledge list/detail/submission/version API calls
- `../puhua_KnowledgeUI/src/lib/review-api.ts`: intake request and review API calls
- `../puhua_KnowledgeUI/src/lib/access-api.ts`: authorization request API calls
- `../puhua_KnowledgeUI/src/lib/audit-api.ts`: audit query API calls
- `../puhua_KnowledgeUI/src/lib/qa-api.ts`: QA API calls
- `../puhua_KnowledgeUI/src/lib/operations-api.ts`: quality and operations API calls
- `../puhua_KnowledgeUI/src/lib/integrations-api.ts`: governed knowledge service and pilot application API calls

## Backend Alignment Notes

- Keep `contracts/openapi.yaml` as the backend contract, but add adapter-friendly fields where useful instead of changing UI labels into backend storage values.
- Enable CORS for the Vite dev origin used by the frontend.
- Support both `POST /knowledge-service/query` and the existing UI-facing alias `POST /api/v1/knowledge/query`.
- Return `metadataOnly` and `authorizationRequestAvailable` for strictly controlled knowledge so `/library/$id` and `/ai-chat` can render the existing restricted banners.
- Always include citation IDs, version numbers, scope, and audit event IDs in QA/service responses because the UI already displays these concepts.
- Provide dashboard and operations summary endpoints or a thin BFF-style aggregation route if route-level composition becomes too chatty.
