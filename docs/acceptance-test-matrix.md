# Acceptance Test Matrix: 企业内部知识库与受控流转体系

**Purpose**: 执行型验收测试矩阵，用于本地完整功能验证和部署前验收。  
**Created**: 2026-05-19  
**Feature Spec**: [spec.md](../specs/001-private-knowledge-flow/spec.md)  
**Related Quality Checklist**: [completion-acceptance.md](../specs/001-private-knowledge-flow/checklists/completion-acceptance.md)

## Usage

- `Priority`: P0 阻塞上线，P1 阻塞试点验收，P2 可进入后续增强但需记录结论。
- `Mode`: Auto 可自动化，Manual 需要人工观察或业务确认，Hybrid 自动化加人工复核。
- `Status`: 初始为 `Pending`，验收时改为 `Pass`、`Fail`、`Blocked` 或 `Deferred`。
- `Evidence`: 填写测试命令、截图、日志、审计事件 ID、API 响应片段或评审记录。
- 生产部署前不得在任何证据中粘贴明文密钥；模型密钥只记录为 secret 名称或脱敏值。

## A. 环境与基线

| ID | Priority | Mode | Acceptance Point | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| AT-001 | P0 | Auto | 后端依赖可在干净环境安装完成，`requirements-dev.txt` 无缺失包。 | `pip install -r backend/requirements-dev.txt` | Pending |
| AT-002 | P0 | Auto | 前端依赖可在干净环境安装完成，并使用约定的 `--legacy-peer-deps` 策略。 | `npm install --legacy-peer-deps --package-lock=false` | Pending |
| AT-003 | P0 | Auto | 后端应用可从仓库根目录说明启动，端口与 quickstart 一致。 | `uvicorn src.main:app --port 8002` | Pending |
| AT-004 | P0 | Auto | 前端应用可从 `frontend/` 启动，`VITE_API_BASE_URL` 指向后端。 | `npm run dev -- --port 3006` | Pending |
| AT-005 | P0 | Auto | `/health` 返回健康状态，且不依赖外部模型服务。 | `GET /health` | Pending |
| AT-006 | P0 | Auto | `/me` 返回统一身份 stub 用户上下文。 | `GET /me` | Pending |
| AT-007 | P0 | Auto | CORS 支持逗号分隔来源配置，前端本地端口可访问 API。 | `CORS_ALLOWED_ORIGINS=http://127.0.0.1:3006,http://localhost:3006` | Pending |
| AT-008 | P0 | Auto | 后端 contract suite 全部通过。 | `python3 -m pytest tests/contract` | Pending |
| AT-009 | P0 | Auto | 后端 integration suite 全部通过。 | `python3 -m pytest tests/integration` | Pending |
| AT-010 | P0 | Auto | 后端 full suite 全部通过。 | `python3 -m pytest` | Pending |
| AT-011 | P1 | Auto | 本次新增/修改 Python 文件通过 ruff，历史 lint 债务单独记录。 | `python3 -m ruff check <changed files>` | Pending |
| AT-012 | P0 | Auto | 前端 lint 无 error，仅允许记录过的 Fast Refresh warning。 | `npm run lint` | Pending |
| AT-013 | P0 | Auto | 前端 production build 成功，SSR 和 client 构建均通过。 | `npm run build` | Pending |
| AT-014 | P0 | Auto | 前端 Playwright e2e 全部通过。 | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3006 npm run test:e2e` | Pending |
| AT-015 | P0 | Auto | 仓库不包含明文模型 key、访问密钥或本地 `.env`。 | `rg` secret scan | Pending |

## B. 知识提交与受控入库

| ID | Priority | Mode | Acceptance Point | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| AT-016 | P0 | Hybrid | 员工可从前端提交知识入库申请。 | 页面截图 + `POST /knowledge-items` 响应 | Pending |
| AT-017 | P0 | Auto | 提交接口要求来源信息。 | 缺少 `source` 的 4xx 响应 | Pending |
| AT-018 | P0 | Auto | 提交接口要求提交人、责任人和业务主题。 | 缺少必填字段的 4xx 响应 | Pending |
| AT-019 | P0 | Auto | 提交接口要求客户或项目、适用范围和有效期。 | 缺少必填字段的 4xx 响应 | Pending |
| AT-020 | P0 | Auto | 提交接口要求密级和摘要。 | 缺少必填字段的 4xx 响应 | Pending |
| AT-021 | P1 | Auto | 支持文档类资料入库。 | `knowledgeType=document` 响应 | Pending |
| AT-022 | P1 | Auto | 支持笔记或会议纪要入库。 | `knowledgeType=note/meeting` 响应 | Pending |
| AT-023 | P1 | Auto | 支持代码实践类资料入库。 | `knowledgeType=code_practice` 响应 | Pending |
| AT-024 | P1 | Auto | 支持项目复盘类资料入库。 | `knowledgeType=retrospective` 响应 | Pending |
| AT-025 | P1 | Auto | 支持链接引用入库。 | `sourceType=link` 响应 | Pending |
| AT-026 | P1 | Auto | 支持结构化表单入库。 | `sourceType=form` 响应 | Pending |
| AT-027 | P1 | Auto | 售前归档可绑定为业务触发场景。 | `POST /business-action-bindings` 响应 | Pending |
| AT-028 | P1 | Auto | 交付复盘可绑定为业务触发场景。 | binding 响应 | Pending |
| AT-029 | P1 | Auto | 招聘评估可绑定为业务触发场景。 | binding 响应 | Pending |
| AT-030 | P0 | Auto | 新提交知识生成入库申请。 | intake request ID | Pending |
| AT-031 | P0 | Auto | 低质量资料进入人工复核，不直接发布。 | intake status + review group | Pending |
| AT-032 | P0 | Auto | 疑似重复资料进入人工复核或标记重复风险。 | duplicate precheck evidence | Pending |
| AT-033 | P0 | Auto | 疑似敏感资料进入安全复核。 | security review group | Pending |
| AT-034 | P1 | Hybrid | 提交成功后前端展示待审核反馈。 | toast/screen evidence | Pending |
| AT-035 | P1 | Hybrid | 首页待审核列表能反映新入库申请。 | screenshot + API response | Pending |
| AT-036 | P1 | Auto | 入库申请列表支持读取待审核记录。 | `GET /intake-requests` | Pending |
| AT-037 | P1 | Auto | 入库申请保留来源、责任人和分类元数据。 | response fields | Pending |
| AT-038 | P1 | Auto | 入库申请保留有效期和适用范围。 | response fields | Pending |
| AT-039 | P1 | Auto | 入库申请状态从提交态进入审核态。 | status transition evidence | Pending |
| AT-040 | P1 | Manual | 业务人员确认提交表单字段覆盖试点资料入库所需信息。 | 业务评审记录 | Pending |

## C. 审核、发布与版本

| ID | Priority | Mode | Acceptance Point | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| AT-041 | P0 | Hybrid | 审核工作台可读取待办入库申请。 | page + `GET /intake-requests` | Pending |
| AT-042 | P0 | Auto | 审核人可审批通过。 | `POST /intake-requests/{id}/review` | Pending |
| AT-043 | P0 | Auto | 审核人可驳回申请并记录原因。 | review response + audit | Pending |
| AT-044 | P1 | Auto | 审核人可要求整改并记录意见。 | review response | Pending |
| AT-045 | P0 | Auto | 审核通过后生成发布知识卡片。 | `GET /knowledge-items/{id}` | Pending |
| AT-046 | P0 | Auto | 发布知识默认展示最新生效版本。 | detail response | Pending |
| AT-047 | P0 | Auto | 新版本提交后保留历史版本。 | `POST /knowledge-items/{id}/versions` | Pending |
| AT-048 | P0 | Auto | 历史版本包含版本号、变更说明和发布时间。 | `GET /knowledge-items/{id}/versions` | Pending |
| AT-049 | P1 | Hybrid | 前端详情页展示版本历史。 | screenshot | Pending |
| AT-050 | P0 | Auto | 审核动作记录审核人、结论、原因和时间。 | audit/review payload | Pending |
| AT-051 | P0 | Auto | 发布动作产生审计事件。 | audit event ID | Pending |
| AT-052 | P0 | Auto | 版本变更产生审计事件。 | audit event ID | Pending |
| AT-053 | P1 | Auto | 驳回知识不会出现在正式知识列表。 | list response | Pending |
| AT-054 | P1 | Auto | 整改状态不会被当作已发布知识复用。 | search/list response | Pending |
| AT-055 | P1 | Manual | 领域专家确认审核意见字段能支撑质量复核。 | 评审记录 | Pending |
| AT-056 | P1 | Manual | 安全管理员确认安全复核字段能支撑定密复核。 | 评审记录 | Pending |
| AT-057 | P1 | Auto | 知识卡片保留来源文件或链接。 | card/detail fields | Pending |
| AT-058 | P1 | Auto | 知识卡片保留提交人和责任人。 | card/detail fields | Pending |
| AT-059 | P1 | Auto | 知识卡片保留生命周期状态。 | card/detail fields | Pending |
| AT-060 | P1 | Auto | 知识卡片保留标签和分类信息。 | card/detail fields | Pending |

## D. 检索、问答、引用与复用

| ID | Priority | Mode | Acceptance Point | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| AT-061 | P0 | Hybrid | 知识库列表页面从后端读取知识卡片。 | page + `GET /knowledge-items` | Pending |
| AT-062 | P0 | Auto | 关键词检索返回授权范围内结果。 | `POST /search` | Pending |
| AT-063 | P1 | Auto | 标签检索返回匹配结果。 | `POST /search` filters | Pending |
| AT-064 | P1 | Auto | 岗位方向筛选返回匹配结果。 | filters evidence | Pending |
| AT-065 | P1 | Auto | 业务主题筛选返回匹配结果。 | filters evidence | Pending |
| AT-066 | P1 | Auto | 行业客户筛选返回匹配结果。 | filters evidence | Pending |
| AT-067 | P1 | Auto | 项目阶段筛选返回匹配结果。 | filters evidence | Pending |
| AT-068 | P1 | Auto | 技术栈筛选返回匹配结果。 | filters evidence | Pending |
| AT-069 | P1 | Auto | 密级筛选返回匹配结果。 | filters evidence | Pending |
| AT-070 | P1 | Auto | 生命周期状态筛选返回匹配结果。 | filters evidence | Pending |
| AT-071 | P0 | Auto | 检索结果包含 audit event ID。 | search response | Pending |
| AT-072 | P0 | Hybrid | AI chat 页面可向 `/qa` 提问。 | page + API response | Pending |
| AT-073 | P0 | Auto | 问答结果包含答案正文。 | `POST /qa` response | Pending |
| AT-074 | P0 | Auto | 问答结果至少包含一个引用来源。 | citations array | Pending |
| AT-075 | P0 | Auto | 引用来源包含知识条目 ID。 | citation fields | Pending |
| AT-076 | P0 | Auto | 引用来源包含知识版本 ID。 | citation fields | Pending |
| AT-077 | P1 | Auto | 引用来源包含片段引用或元数据引用。 | citation fields | Pending |
| AT-078 | P1 | Auto | 问答结果包含复核提示。 | reviewCue field | Pending |
| AT-079 | P0 | Auto | 过期知识不作为当前正式复用材料返回。 | lifecycle exclusion test | Pending |
| AT-080 | P0 | Auto | 下架知识不作为当前正式复用材料返回。 | lifecycle exclusion test | Pending |
| AT-081 | P0 | Auto | 被替代知识不作为当前正式复用材料返回。 | lifecycle exclusion test | Pending |
| AT-082 | P0 | Auto | 被驳回知识不作为当前正式复用材料返回。 | lifecycle exclusion test | Pending |
| AT-083 | P1 | Hybrid | 详情页可展示知识摘要、标签、版本和适用范围。 | screenshot | Pending |
| AT-084 | P1 | Hybrid | 详情页反馈、收藏、引用入口与后端质量信号连接。 | UI action + API response | Pending |
| AT-085 | P2 | Auto | 相似案例或推荐接口在有上下文时返回可复用资料。 | recommendation response | Pending |
| AT-086 | P2 | Manual | 业务人员确认推荐结果在试点场景中有实际复用价值。 | 业务评审记录 | Pending |
| AT-087 | P1 | Hybrid | 用户可在 3 分钟内通过典型任务找到可复用知识。 | 计时记录 | Pending |
| AT-088 | P1 | Manual | 抽样问答结果中引用来源可被人工核验。 | 抽样记录 | Pending |
| AT-089 | P1 | Auto | QA 调用产生 `qa_call` 审计事件。 | audit event | Pending |
| AT-090 | P1 | Auto | 搜索调用产生 `search` 审计事件。 | audit event | Pending |

## E. 权限、密级、脱敏与审计

| ID | Priority | Mode | Acceptance Point | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| AT-091 | P0 | Auto | 支持公开内部密级。 | enum/schema/API response | Pending |
| AT-092 | P0 | Auto | 支持部门可见密级。 | enum/schema/API response | Pending |
| AT-093 | P0 | Auto | 支持项目可见密级。 | enum/schema/API response | Pending |
| AT-094 | P0 | Auto | 支持敏感密级。 | enum/schema/API response | Pending |
| AT-095 | P0 | Auto | 支持严格受控密级。 | enum/schema/API response | Pending |
| AT-096 | P0 | Auto | 未授权用户检索不到项目可见知识内容。 | permission search test | Pending |
| AT-097 | P0 | Auto | 未授权用户问答不能使用受限知识片段。 | QA denial response | Pending |
| AT-098 | P0 | Auto | 严格受控知识未审批时仅返回元数据或授权入口。 | metadata-only response | Pending |
| AT-099 | P0 | Hybrid | 前端严格受控详情页展示授权申请入口。 | screenshot | Pending |
| AT-100 | P0 | Auto | 严格受控知识访问拒绝产生 `access_denied` 审计。 | audit event | Pending |
| AT-101 | P0 | Auto | 用户可提交授权申请。 | `POST /authorization-requests` | Pending |
| AT-102 | P0 | Auto | 授权申请列表可查询。 | `GET /authorization-requests` | Pending |
| AT-103 | P0 | Auto | 管理员可批准授权申请。 | review response | Pending |
| AT-104 | P1 | Auto | 管理员可拒绝授权申请并记录原因。 | review response | Pending |
| AT-105 | P0 | Auto | 显式审批后严格受控知识可按规则提供脱敏片段。 | approved QA response | Pending |
| AT-106 | P0 | Auto | 敏感知识默认触发脱敏或安全复核。 | precheck response | Pending |
| AT-107 | P0 | Auto | 客户资料类内容进入复核、脱敏或限制访问流程。 | sensitive precheck evidence | Pending |
| AT-108 | P0 | Auto | 合同信息进入复核、脱敏或限制访问流程。 | sensitive precheck evidence | Pending |
| AT-109 | P0 | Auto | 源代码进入复核、脱敏或限制访问流程。 | sensitive precheck evidence | Pending |
| AT-110 | P0 | Auto | 报价信息进入复核、脱敏或限制访问流程。 | sensitive precheck evidence | Pending |
| AT-111 | P0 | Auto | 敏感人员信息进入复核、脱敏或限制访问流程。 | sensitive precheck evidence | Pending |
| AT-112 | P0 | Auto | 高敏知识默认不进入模型训练用途。 | policy state | Pending |
| AT-113 | P0 | Auto | 展示知识前校验统一身份信息。 | auth dependency evidence | Pending |
| AT-114 | P0 | Auto | 展示知识前校验本地授权规则。 | authorization decision | Pending |
| AT-115 | P0 | Auto | 向上层应用提供知识前校验用户授权。 | service query evidence | Pending |
| AT-116 | P0 | Auto | 访问成功记录操作者、时间、对象和结果。 | audit event fields | Pending |
| AT-117 | P0 | Auto | 访问失败记录拒绝原因。 | audit event fields | Pending |
| AT-118 | P0 | Auto | 审计查询支持按用户过滤。 | `GET /audit-events?actor=` | Pending |
| AT-119 | P0 | Auto | 审计查询支持按知识条目过滤。 | `GET /audit-events?knowledgeItemId=` | Pending |
| AT-120 | P1 | Auto | 审计查询支持按项目过滤。 | query response | Pending |
| AT-121 | P1 | Auto | 审计查询支持按部门过滤。 | query response | Pending |
| AT-122 | P1 | Auto | 审计查询支持按时间段过滤。 | query response | Pending |
| AT-123 | P0 | Auto | 审计查询支持按操作类型过滤。 | query response | Pending |
| AT-124 | P1 | Auto | 审计查询支持按上层应用过滤。 | query response | Pending |
| AT-125 | P0 | Auto | 审计、审批、访问和调用记录带有至少 3 年留存元数据。 | retention fields | Pending |
| AT-126 | P1 | Manual | 安全管理员确认密级、授权、脱敏口径满足试点安全要求。 | 安全评审记录 | Pending |

## F. 知识质量与生命周期运营

| ID | Priority | Mode | Acceptance Point | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| AT-127 | P1 | Auto | 浏览行为可产生质量或使用信号。 | `POST /quality-signals` | Pending |
| AT-128 | P1 | Auto | 收藏行为可产生质量或使用信号。 | quality signal response | Pending |
| AT-129 | P1 | Auto | 引用行为可产生质量或使用信号。 | quality signal response | Pending |
| AT-130 | P1 | Auto | 问答命中可产生质量或使用信号。 | quality signal response | Pending |
| AT-131 | P1 | Auto | 评分行为可产生质量信号。 | quality signal response | Pending |
| AT-132 | P1 | Auto | 反馈行为可产生质量信号。 | quality signal response | Pending |
| AT-133 | P1 | Auto | 有效期临近的知识进入过期复核列表。 | operations summary | Pending |
| AT-134 | P1 | Auto | 质量评分低的知识进入复核或整改流程。 | lifecycle trigger evidence | Pending |
| AT-135 | P1 | Auto | 负面反馈触发复核任务。 | lifecycle trigger evidence | Pending |
| AT-136 | P1 | Auto | 管理员可下架知识并记录原因。 | lifecycle action response | Pending |
| AT-137 | P1 | Auto | 管理员可恢复知识并记录原因。 | lifecycle action response | Pending |
| AT-138 | P1 | Auto | 生命周期变更产生审计事件。 | audit event | Pending |
| AT-139 | P1 | Hybrid | 运营看板展示新增知识指标。 | page + API response | Pending |
| AT-140 | P1 | Hybrid | 运营看板展示热门知识指标。 | page + API response | Pending |
| AT-141 | P1 | Hybrid | 运营看板展示引用量和复用指标。 | page + API response | Pending |
| AT-142 | P1 | Hybrid | 运营看板展示即将过期知识。 | page + API response | Pending |
| AT-143 | P1 | Hybrid | 运营看板展示质量分布。 | page + API response | Pending |
| AT-144 | P2 | Hybrid | 运营看板展示薄弱领域。 | page + API response | Pending |
| AT-145 | P2 | Hybrid | 运营看板展示专家贡献。 | page + API response | Pending |
| AT-146 | P2 | Manual | 知识管理员确认运营指标能支撑试点复盘。 | 业务评审记录 | Pending |

## G. 上层 AI 服务与智谱模型

| ID | Priority | Mode | Acceptance Point | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| AT-147 | P0 | Auto | `/knowledge-service/query` 支持代表用户请求知识。 | API response | Pending |
| AT-148 | P0 | Auto | `/api/v1/knowledge/query` 兼容别名可用。 | API response | Pending |
| AT-149 | P0 | Auto | 上层应用 retrieve 请求返回权限过滤后的引用。 | service response | Pending |
| AT-150 | P0 | Auto | 上层应用 qa 请求返回输出和引用。 | service response | Pending |
| AT-151 | P1 | Auto | 上层应用 recommend 请求有明确结果或降级口径。 | service response | Pending |
| AT-152 | P0 | Auto | 上层应用请求严格受控知识且无权限时被拒绝。 | denied response | Pending |
| AT-153 | P0 | Auto | 上层应用拒绝请求记录拒绝原因。 | audit event | Pending |
| AT-154 | P0 | Auto | 每次上层应用调用记录 `service_call` 审计。 | audit event | Pending |
| AT-155 | P0 | Hybrid | 集成页面展示知识服务接入端点。 | screenshot | Pending |
| AT-156 | P0 | Hybrid | 集成页面展示试点应用列表。 | screenshot + `GET /applications` | Pending |
| AT-157 | P0 | Auto | 试点应用可轮换 key。 | `POST /applications/{id}/keys/rotate` | Pending |
| AT-158 | P0 | Hybrid | 前端 key 轮换后只展示脱敏 key。 | screenshot | Pending |
| AT-159 | P0 | Auto | 全局策略可读取。 | `GET /application-policies` | Pending |
| AT-160 | P0 | Auto | 全局策略可更新。 | `PATCH /application-policies` | Pending |
| AT-161 | P0 | Auto | `MODEL_PROVIDER=stub` 时 QA 不调用外部模型且可稳定返回。 | `POST /qa` response | Pending |
| AT-162 | P0 | Auto | `MODEL_PROVIDER=zhipu` 且配置 secret 时 QA 调用智谱模型。 | live smoke response | Pending |
| AT-163 | P0 | Auto | 智谱返回成功时答案使用模型输出并保留 citations。 | live smoke response | Pending |
| AT-164 | P0 | Auto | 智谱限流或失败时自动回退本地规则答案。 | fallback response | Pending |
| AT-165 | P0 | Auto | fallback 时 review cue 提示模型网关暂不可用。 | response field | Pending |
| AT-166 | P0 | Auto | 模型请求上下文仅包含授权知识摘要和引用信息。 | request audit/mock transport | Pending |
| AT-167 | P0 | Auto | 严格受控 metadata-only 响应不会发送正文给模型。 | mock transport assertion | Pending |
| AT-168 | P0 | Auto | 本地默认模型使用 `glm-4.5-flash` 或部署配置指定模型。 | settings evidence | Pending |
| AT-169 | P0 | Manual | 部署前已轮换聊天中暴露过的模型 key。 | secret rotation record | Pending |
| AT-170 | P0 | Manual | 生产 secret store 中配置模型 key，仓库和日志不出现明文。 | secret scan + platform evidence | Pending |

## H. 前端页面与用户体验

| ID | Priority | Mode | Acceptance Point | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| AT-171 | P1 | Hybrid | 首页从后端读取待审核和热门知识数据。 | screenshot + API response | Pending |
| AT-172 | P1 | Hybrid | 侧边栏用户信息来自 `/me`。 | screenshot + API response | Pending |
| AT-173 | P0 | Hybrid | 提交页面提交动作调用后端 mutation。 | network trace | Pending |
| AT-174 | P0 | Hybrid | 审核页面审批动作调用后端 mutation。 | network trace | Pending |
| AT-175 | P0 | Hybrid | 知识库列表搜索框联动后端查询。 | network trace | Pending |
| AT-176 | P1 | Hybrid | 知识库筛选项联动后端查询参数。 | network trace | Pending |
| AT-177 | P1 | Hybrid | 知识详情页从后端读取详情。 | network trace | Pending |
| AT-178 | P1 | Hybrid | 知识详情页显示后端版本列表。 | screenshot | Pending |
| AT-179 | P0 | Hybrid | AI chat 页面调用 `/qa` 并展示 citations。 | network trace + screenshot | Pending |
| AT-180 | P0 | Hybrid | AI chat 严格受控 blocked 状态展示授权入口。 | screenshot | Pending |
| AT-181 | P0 | Hybrid | 授权申请页面提交动作调用后端。 | network trace | Pending |
| AT-182 | P1 | Hybrid | 授权审批按钮调用后端 mutation。 | network trace | Pending |
| AT-183 | P1 | Hybrid | 审计页面数据来自后端查询。 | network trace | Pending |
| AT-184 | P1 | Hybrid | 审计页面过滤条件联动后端参数。 | network trace | Pending |
| AT-185 | P1 | Hybrid | 运营页面 KPI 来自后端 summary。 | network trace | Pending |
| AT-186 | P1 | Hybrid | 运营页面生命周期操作调用后端。 | network trace | Pending |
| AT-187 | P0 | Hybrid | 集成页面策略开关读取和更新后端策略。 | network trace | Pending |
| AT-188 | P1 | Manual | 页面在 1366px 桌面视口无明显文字遮挡。 | screenshot | Pending |
| AT-189 | P1 | Manual | 页面在移动视口核心信息不溢出。 | screenshot | Pending |
| AT-190 | P1 | Manual | 表单错误提示能指导用户补齐必填项。 | screenshot | Pending |

## I. 部署、安全与运维准备

| ID | Priority | Mode | Acceptance Point | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| AT-191 | P0 | Manual | 生产部署拓扑确认前后端、数据库、对象存储、检索、向量库、Redis 和模型服务边界。 | 架构评审记录 | Pending |
| AT-192 | P0 | Manual | 生产环境使用正式 PostgreSQL 或等效持久化数据库。 | deployment config | Pending |
| AT-193 | P0 | Manual | Alembic migration 可在空库执行。 | migration log | Pending |
| AT-194 | P0 | Manual | Alembic migration 可在测试数据环境回滚或重建。 | migration rehearsal log | Pending |
| AT-195 | P0 | Manual | 对象存储 bucket 私有且启用服务端加密或等效控制。 | storage config evidence | Pending |
| AT-196 | P0 | Manual | OpenSearch 索引规划和权限边界已确认。 | index config | Pending |
| AT-197 | P0 | Manual | Qdrant collection 规划和向量维度已确认。 | collection config | Pending |
| AT-198 | P0 | Manual | Redis/Celery worker 部署方式和重试策略已确认。 | worker config | Pending |
| AT-199 | P0 | Manual | 统一身份正式接入方案已确认。 | identity integration record | Pending |
| AT-200 | P0 | Manual | API 网关或后端已启用 bearer auth，不对公网裸露管理接口。 | gateway config | Pending |
| AT-201 | P0 | Manual | 生产模型 key 放入 secret store，不写入镜像、仓库或日志。 | secret evidence | Pending |
| AT-202 | P0 | Auto | 部署包或镜像 secret scan 无明文密钥。 | scanner output | Pending |
| AT-203 | P0 | Manual | 数据库备份脚本或平台备份策略已验证。 | backup log | Pending |
| AT-204 | P0 | Manual | 对象存储备份脚本或平台备份策略已验证。 | backup log | Pending |
| AT-205 | P0 | Manual | 恢复演练可恢复数据库关键表。 | restore log | Pending |
| AT-206 | P0 | Manual | 恢复演练可恢复原始文件或派生文件。 | restore log | Pending |
| AT-207 | P1 | Manual | 健康检查纳入部署平台。 | platform healthcheck | Pending |
| AT-208 | P1 | Manual | 审计事件和模型调用失败纳入日志查询。 | log query evidence | Pending |
| AT-209 | P1 | Manual | service-call spike 告警阈值已设置。 | alert config | Pending |
| AT-210 | P1 | Manual | 访问拒绝异常增长告警阈值已设置。 | alert config | Pending |
| AT-211 | P0 | Manual | 审计、审批、访问、调用记录 3 年留存策略已配置。 | retention policy | Pending |
| AT-212 | P0 | Manual | 归档或下架知识历史版本 3 年留存策略已配置。 | retention policy | Pending |
| AT-213 | P0 | Manual | 生产发布前有回滚步骤和责任人。 | release runbook | Pending |
| AT-214 | P0 | Manual | 生产发布前有变更窗口和通知对象。 | release plan | Pending |
| AT-215 | P1 | Manual | 试点用户、试点数据范围和试点上层应用名单已确认。 | pilot scope record | Pending |
| AT-216 | P1 | Manual | 试点验收抽样方法已确认。 | sampling plan | Pending |
| AT-217 | P1 | Manual | 非阻断 warnings 已记录并确认不影响试点。 | risk record | Pending |
| AT-218 | P1 | Manual | 性能容量基线已定义，包括并发用户、检索延迟和问答延迟。 | performance baseline | Pending |
| AT-219 | P2 | Manual | 推荐能力增强、消息提醒、正式多系统接入已进入后续任务池。 | backlog link | Pending |
| AT-220 | P0 | Manual | 最终上线评审明确通过、延期或阻塞项。 | sign-off record | Pending |
