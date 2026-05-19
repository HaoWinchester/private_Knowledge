import type {
  ConfidentialityLevel,
  IntakeRequest,
  AuditEvent,
  AuthorizationRequest,
  KnowledgeCard,
  KnowledgeStatus,
  KnowledgeSubmissionCreate,
  KnowledgeType,
  SourceType,
} from "./api-types";
import type { Classification, KnowledgeItem } from "./mock-data";

export const confidentialityLabels: Record<ConfidentialityLevel, string> = {
  internal_public: "公开内部",
  department_visible: "部门可见",
  project_visible: "项目可见",
  sensitive: "敏感",
  strictly_controlled: "严格受控",
};

export const confidentialityValues: Record<string, ConfidentialityLevel> = {
  公开内部: "internal_public",
  部门可见: "department_visible",
  项目可见: "project_visible",
  敏感: "sensitive",
  严格受控: "strictly_controlled",
};

export const knowledgeStatusLabels: Record<KnowledgeStatus, string> = {
  draft: "草稿",
  pending_review: "待审核",
  published: "已发布",
  rejected: "已驳回",
  rectification_required: "整改中",
  archived: "已过期",
  removed: "已下架",
  restored: "已发布",
};

export const knowledgeTypeValues: Record<string, KnowledgeType> = {
  文档: "document",
  笔记: "note",
  会议纪要: "meeting_output",
  项目资料: "project_material",
  代码实践: "code_practice",
  复盘: "review",
  链接: "link",
  表单: "form",
};

export const sourceTypeValues: Record<string, SourceType> = {
  人工上传: "manual_upload",
  链接引用: "link_reference",
  共享目录: "shared_directory_readonly",
  项目样例: "project_sample_readonly",
  结构化表单: "form",
};

export function roleSummary(roles: string[]): string {
  if (roles.includes("knowledge_admin")) return "知识管理员";
  if (roles.includes("domain_expert")) return "领域专家";
  if (roles.includes("security_admin")) return "安全管理员";
  return "员工";
}

export function mapKnowledgeCardToUi(item: KnowledgeCard): KnowledgeItem {
  const classification = confidentialityLabels[item.confidentialityLevel] as Classification;
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    classification,
    status: knowledgeStatusLabels[item.status] as KnowledgeItem["status"],
    owner: "后端同步",
    submitter: "后端同步",
    department: "知识中台",
    domain: "通用",
    topic: item.tags[0] ?? "知识资产",
    tags: item.tags,
    version: item.currentVersionId,
    updatedAt: new Date().toISOString().slice(0, 10),
    views: 0,
    citations: 0,
    rating: 0,
    source: item.sourceDisplayName ?? "后端提交",
    scope: item.applicableScope ?? "",
    sourceType: "文档",
  };
}

export function mapSubmitFormToPayload(form: FormData, tags: string[]): KnowledgeSubmissionCreate {
  const sourceLabel = String(form.get("sourceLabel") ?? "文档");
  const sourceTypeLabel = sourceLabel === "链接引用" ? "链接引用" : "人工上传";
  return {
    title: String(form.get("title") ?? ""),
    knowledgeType: knowledgeTypeValues[sourceLabel] ?? "document",
    source: {
      sourceType: sourceTypeValues[sourceTypeLabel] ?? "manual_upload",
      displayName: String(form.get("sourceDisplayName") ?? sourceLabel),
      uri: String(form.get("sourceUri") ?? "") || undefined,
    },
    responsibleUserId: String(form.get("responsibleUserId") ?? "user-knowledge-admin"),
    roleDirection: String(form.get("roleDirection") ?? "售前"),
    businessTheme: String(form.get("businessTheme") ?? "知识提交"),
    customerOrProject: String(form.get("customerOrProject") ?? "") || undefined,
    confidentialityLevel:
      confidentialityValues[String(form.get("confidentialityLevel") ?? "部门可见")] ??
      "department_visible",
    summary: String(form.get("summary") ?? ""),
    suggestedTags: tags,
    applicableScope: String(form.get("applicableScope") ?? ""),
    validUntil: String(form.get("validUntil") ?? new Date().toISOString().slice(0, 10)),
  };
}

export function reviewGroupLabel(group?: IntakeRequest["reviewGroup"]) {
  if (group === "security_admin") return "安全管理员";
  if (group === "domain_expert") return "领域专家";
  return "知识管理员";
}

export const authorizationStatusLabels: Record<
  AuthorizationRequest["status"],
  "待审批" | "已通过" | "已拒绝"
> = {
  submitted: "待审批",
  approved: "已通过",
  rejected: "已拒绝",
  expired: "已拒绝",
};

export const auditResultLabels: Record<AuditEvent["result"], "成功" | "拒绝" | "降级"> = {
  success: "成功",
  denied: "拒绝",
  failed: "降级",
};

export const auditEventTypeLabels: Record<string, string> = {
  submit: "提交入库",
  review: "审核",
  publish: "发布",
  version_change: "发布新版本",
  search: "检索",
  browse: "浏览",
  cite: "引用",
  export: "导出",
  download: "下载",
  qa_call: "知识问答",
  service_call: "调用知识服务",
  access_denied: "访问拒绝",
  lifecycle_change: "生命周期变更",
};
