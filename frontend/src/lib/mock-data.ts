// Mock data for the enterprise knowledge base prototype.
export type Classification = "公开内部" | "部门可见" | "项目可见" | "敏感" | "严格受控";
export type KnowledgeStatus =
  | "草稿"
  | "待审核"
  | "已发布"
  | "整改中"
  | "已驳回"
  | "已下架"
  | "已过期";

export interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  classification: Classification;
  status: KnowledgeStatus;
  owner: string;
  submitter: string;
  department: string;
  domain: string; // 岗位方向
  topic: string; // 业务主题
  customer?: string;
  project?: string;
  tags: string[];
  version: string;
  publishedAt?: string;
  updatedAt: string;
  expiresAt?: string;
  views: number;
  citations: number;
  rating: number;
  source: string; // 来源
  scope: string; // 适用范围
  sourceType: "文档" | "笔记" | "会议纪要" | "项目资料" | "代码实践" | "复盘" | "链接" | "表单";
}

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: "K-2026-0142",
    title: "央企集团客户售前调研框架 v3.2",
    summary:
      "面向央国企客户的售前调研模板，涵盖客户背景、IT 现状、采购流程、关键决策人和合规要求。",
    classification: "项目可见",
    status: "已发布",
    owner: "李晓楠",
    submitter: "王志远",
    department: "售前咨询部",
    domain: "售前咨询",
    topic: "客户调研",
    customer: "国家电网",
    project: "智慧能源平台",
    tags: ["售前", "央企", "调研模板", "合规"],
    version: "v3.2",
    publishedAt: "2026-04-12",
    updatedAt: "2026-05-08",
    expiresAt: "2027-04-12",
    views: 1284,
    citations: 47,
    rating: 4.7,
    source: "售前归档系统 / SAL-2026-0033",
    scope: "售前、客户经理、方案架构师",
    sourceType: "文档",
  },
  {
    id: "K-2026-0138",
    title: "数据中台微服务部署最佳实践",
    summary: "K8s + Istio 微服务架构在央企内网环境的部署清单、网络策略和灾备方案。",
    classification: "部门可见",
    status: "已发布",
    owner: "陈思远",
    submitter: "陈思远",
    department: "技术研发部",
    domain: "研发",
    topic: "架构实践",
    tags: ["K8s", "微服务", "部署", "最佳实践"],
    version: "v2.0",
    publishedAt: "2026-03-28",
    updatedAt: "2026-04-30",
    expiresAt: "2027-03-28",
    views: 962,
    citations: 31,
    rating: 4.5,
    source: "GitLab / infra-handbook",
    scope: "全体研发、运维",
    sourceType: "代码实践",
  },
  {
    id: "K-2026-0156",
    title: "[ ! ] 国网招标项目合同条款定稿",
    summary: "国网 2026 智慧能源项目合同关键条款、违约责任与付款节奏。",
    classification: "严格受控",
    status: "已发布",
    owner: "周静",
    submitter: "周静",
    department: "法务合规部",
    domain: "法务",
    topic: "合同条款",
    customer: "国家电网",
    project: "智慧能源平台",
    tags: ["合同", "严格受控", "法务"],
    version: "v1.0",
    publishedAt: "2026-05-02",
    updatedAt: "2026-05-02",
    expiresAt: "2029-05-02",
    views: 18,
    citations: 2,
    rating: 0,
    source: "OA / CON-2026-0712",
    scope: "项目负责人、法务、CFO",
    sourceType: "文档",
  },
  {
    id: "K-2026-0161",
    title: "AI 产品经理岗位面试评估框架",
    summary: "AI 产品经理候选人评估维度、追问清单和典型反例。",
    classification: "部门可见",
    status: "待审核",
    owner: "HR · 林珊",
    submitter: "林珊",
    department: "人力资源部",
    domain: "HR",
    topic: "面试评估",
    tags: ["招聘", "AI产品", "面试"],
    version: "v0.9",
    updatedAt: "2026-05-15",
    views: 0,
    citations: 0,
    rating: 0,
    source: "人工提交 / 林珊",
    scope: "HR、面试官",
    sourceType: "表单",
  },
  {
    id: "K-2026-0119",
    title: "金融客户私有化部署交付复盘",
    summary: "某股份制银行私有化部署项目的实施节奏、踩坑清单与改进建议。",
    classification: "敏感",
    status: "已发布",
    owner: "高扬",
    submitter: "高扬",
    department: "交付实施部",
    domain: "交付",
    topic: "项目复盘",
    customer: "某股份制银行",
    project: "智慧风控平台",
    tags: ["交付", "复盘", "私有化", "金融"],
    version: "v1.1",
    publishedAt: "2026-02-18",
    updatedAt: "2026-04-02",
    expiresAt: "2027-02-18",
    views: 538,
    citations: 22,
    rating: 4.3,
    source: "项目目录 / DEL-2026-009",
    scope: "交付、售前、研发",
    sourceType: "复盘",
  },
  {
    id: "K-2025-0998",
    title: "运维值班 SOP（旧版）",
    summary: "2025 年生产环境运维值班标准作业流程，已被 v2.0 取代。",
    classification: "公开内部",
    status: "已过期",
    owner: "运维组",
    submitter: "赵强",
    department: "运维部",
    domain: "运维",
    topic: "SOP",
    tags: ["SOP", "运维", "已过期"],
    version: "v1.4",
    publishedAt: "2025-06-01",
    updatedAt: "2026-01-10",
    expiresAt: "2026-04-01",
    views: 2042,
    citations: 0,
    rating: 3.2,
    source: "Wiki / OPS",
    scope: "全体运维",
    sourceType: "文档",
  },
  {
    id: "K-2026-0170",
    title: "Agent 平台调用知识服务接入指南",
    summary: "上层多 Agent 平台如何通过受控知识服务进行权限过滤、引用溯源和审计回写。",
    classification: "部门可见",
    status: "已发布",
    owner: "陈思远",
    submitter: "刘洋",
    department: "技术研发部",
    domain: "研发",
    topic: "AI 接入",
    tags: ["AI", "Agent", "知识服务", "接入"],
    version: "v1.0",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-10",
    expiresAt: "2027-05-10",
    views: 213,
    citations: 5,
    rating: 4.6,
    source: "人工提交 / 刘洋",
    scope: "AI 应用研发",
    sourceType: "文档",
  },
  {
    id: "K-2026-0172",
    title: "[整改] 内部薪酬结构说明",
    summary: "薪酬结构说明文档被反馈缺少最新调整内容，进入整改流程。",
    classification: "敏感",
    status: "整改中",
    owner: "HR · 林珊",
    submitter: "林珊",
    department: "人力资源部",
    domain: "HR",
    topic: "薪酬",
    tags: ["HR", "薪酬", "整改"],
    version: "v1.2",
    updatedAt: "2026-05-14",
    views: 89,
    citations: 1,
    rating: 3.0,
    source: "HR 系统",
    scope: "HR、Manager",
    sourceType: "文档",
  },
];

export const classificationColor: Record<Classification, string> = {
  公开内部: "bg-muted text-muted-foreground border border-border",
  部门可见: "bg-info/10 text-info border border-info/30",
  项目可见: "bg-chart-5/10 text-chart-5 border border-chart-5/30",
  敏感: "bg-warning/15 text-warning-foreground border border-warning/40",
  严格受控: "bg-destructive/10 text-destructive border border-destructive/30",
};

export const statusColor: Record<KnowledgeStatus, string> = {
  草稿: "bg-muted text-muted-foreground",
  待审核: "bg-info/10 text-info",
  已发布: "bg-success/15 text-success",
  整改中: "bg-warning/15 text-warning-foreground",
  已驳回: "bg-destructive/10 text-destructive",
  已下架: "bg-muted text-muted-foreground line-through",
  已过期: "bg-muted text-muted-foreground",
};

export interface ReviewTask {
  id: string;
  knowledgeId: string;
  title: string;
  submitter: string;
  submittedAt: string;
  classification: Classification;
  reviewer: string;
  reviewType: "知识管理员" | "领域专家" | "安全管理员";
  priority: "高" | "中" | "低";
  reason?: string;
}

export const reviewTasks: ReviewTask[] = [
  {
    id: "REV-0461",
    knowledgeId: "K-2026-0161",
    title: "AI 产品经理岗位面试评估框架",
    submitter: "林珊",
    submittedAt: "2026-05-15 14:22",
    classification: "部门可见",
    reviewer: "你",
    reviewType: "知识管理员",
    priority: "中",
  },
  {
    id: "REV-0459",
    knowledgeId: "K-2026-0172",
    title: "内部薪酬结构说明（整改）",
    submitter: "林珊",
    submittedAt: "2026-05-14 10:08",
    classification: "敏感",
    reviewer: "你",
    reviewType: "安全管理员",
    priority: "高",
    reason: "用户反馈缺少最新调整内容",
  },
  {
    id: "REV-0458",
    knowledgeId: "K-2026-0170",
    title: "Agent 平台调用知识服务接入指南",
    submitter: "刘洋",
    submittedAt: "2026-05-10 09:30",
    classification: "部门可见",
    reviewer: "陈思远",
    reviewType: "领域专家",
    priority: "中",
  },
  {
    id: "REV-0455",
    knowledgeId: "K-PENDING-001",
    title: "某银行核心系统迁移方案（疑似重复）",
    submitter: "高扬",
    submittedAt: "2026-05-09 18:45",
    classification: "敏感",
    reviewer: "你",
    reviewType: "知识管理员",
    priority: "中",
    reason: "与 K-2026-0119 相似度 78%",
  },
];

export interface AccessRequest {
  id: string;
  knowledgeId: string;
  knowledgeTitle: string;
  requester: string;
  requesterDept: string;
  reason: string;
  requestedAt: string;
  status: "待审批" | "已通过" | "已拒绝";
  validUntil?: string;
}

export const accessRequests: AccessRequest[] = [
  {
    id: "REQ-2026-0231",
    knowledgeId: "K-2026-0156",
    knowledgeTitle: "国网招标项目合同条款定稿",
    requester: "王志远",
    requesterDept: "售前咨询部",
    reason: "需要在售前方案中引用付款条款片段，用于客户答疑。",
    requestedAt: "2026-05-16 09:12",
    status: "待审批",
  },
  {
    id: "REQ-2026-0228",
    knowledgeId: "K-2026-0119",
    knowledgeTitle: "金融客户私有化部署交付复盘",
    requester: "新员工 · 张佳",
    requesterDept: "交付实施部",
    reason: "新入职熟悉历史项目经验。",
    requestedAt: "2026-05-15 16:40",
    status: "已通过",
    validUntil: "2026-08-15",
  },
  {
    id: "REQ-2026-0225",
    knowledgeId: "K-2026-0156",
    knowledgeTitle: "国网招标项目合同条款定稿",
    requester: "外部顾问 · 何明",
    requesterDept: "—",
    reason: "—",
    requestedAt: "2026-05-13 11:02",
    status: "已拒绝",
  },
];

export interface AuditEvent {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  context: string;
  result: "成功" | "拒绝" | "降级";
}

export const auditEvents: AuditEvent[] = [
  {
    id: "EVT-100231",
    time: "2026-05-16 14:32:18",
    actor: "王志远",
    action: "检索",
    target: "K-2026-0156",
    context: "关键词：付款条款",
    result: "拒绝",
  },
  {
    id: "EVT-100230",
    time: "2026-05-16 14:30:02",
    actor: "Agent 平台 (代:张佳)",
    action: "调用知识服务",
    target: "K-2026-0119",
    context: "Agent: 方案生成 v0.4",
    result: "成功",
  },
  {
    id: "EVT-100229",
    time: "2026-05-16 14:21:55",
    actor: "陈思远",
    action: "发布新版本",
    target: "K-2026-0138 v2.0",
    context: "变更说明：补充灾备",
    result: "成功",
  },
  {
    id: "EVT-100228",
    time: "2026-05-16 13:18:30",
    actor: "高扬",
    action: "导出",
    target: "K-2026-0119",
    context: "PDF / 引用至客户汇报",
    result: "成功",
  },
  {
    id: "EVT-100227",
    time: "2026-05-16 11:02:04",
    actor: "外部顾问 · 何明",
    action: "授权申请",
    target: "K-2026-0156",
    context: "原因不充分",
    result: "拒绝",
  },
  {
    id: "EVT-100226",
    time: "2026-05-16 10:45:12",
    actor: "林珊",
    action: "提交入库",
    target: "K-2026-0161",
    context: "面试评估框架 v0.9",
    result: "成功",
  },
  {
    id: "EVT-100225",
    time: "2026-05-16 09:30:08",
    actor: "运维监控",
    action: "降级",
    target: "语义检索服务",
    context: "向量库延迟 > 800ms",
    result: "降级",
  },
];

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
  citations?: { id: string; title: string; version: string; scope: string }[];
  blocked?: { reason: string; requestable: boolean; knowledgeId?: string };
}
