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
  domain: string;
  topic: string;
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
  source: string;
  scope: string;
  sourceType: "文档" | "笔记" | "会议纪要" | "项目资料" | "代码实践" | "复盘" | "链接" | "表单";
}

export interface ReviewTask {
  id: string;
  knowledgeId: string;
  title: string;
  submitter: string;
  submittedAt: string;
  reviewer: string;
  priority: "高" | "中";
  classification: Classification;
  reviewType: string;
  reason?: string;
  status: string;
}

export interface AccessRequestRow {
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

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
  citations?: { id: string; title: string; version: string; scope: string }[];
  blocked?: { reason: string; requestable: boolean; knowledgeId?: string };
}

export const classificationColor: Record<Classification, string> = {
  公开内部: "bg-muted text-muted-foreground border border-border",
  部门可见: "bg-info/10 text-info border border-info/30",
  项目可见: "bg-chart-5/10 text-chart-5 border border-chart-5/30",
  敏感: "bg-warning/15 text-warning-foreground border border-warning/30",
  严格受控: "bg-destructive/10 text-destructive border border-destructive/30",
};

export const statusColor: Record<KnowledgeStatus, string> = {
  草稿: "bg-muted text-muted-foreground",
  待审核: "bg-info/10 text-info",
  已发布: "bg-success/15 text-success",
  整改中: "bg-warning/15 text-warning-foreground",
  已驳回: "bg-destructive/10 text-destructive",
  已下架: "bg-muted text-muted-foreground",
  已过期: "bg-muted text-muted-foreground",
};
