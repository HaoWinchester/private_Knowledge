import { apiRequest } from "./api-client";
import type {
  IntakeRequest,
  KnowledgeCard,
  KnowledgeItemDetail,
  KnowledgeSubmissionCreate,
  KnowledgeVersion,
  KnowledgeVersionCreate,
  ConfidentialityLevel,
  KnowledgeStatus,
} from "./api-types";

export function listKnowledgeItems(
  filters: {
    q?: string;
    status?: KnowledgeStatus;
    confidentialityLevel?: ConfidentialityLevel;
  } = {},
) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.status) params.set("status", filters.status);
  if (filters.confidentialityLevel)
    params.set("confidentialityLevel", filters.confidentialityLevel);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<{ items: KnowledgeCard[] }>(`/knowledge-items${suffix}`);
}

export function getKnowledgeItem(id: string) {
  return apiRequest<KnowledgeItemDetail>(`/knowledge-items/${id}`);
}

export function createKnowledgeSubmission(payload: KnowledgeSubmissionCreate) {
  return apiRequest<IntakeRequest>("/knowledge-items", {
    method: "POST",
    body: payload,
  });
}

export function listKnowledgeVersions(id: string) {
  return apiRequest<{ versions: KnowledgeVersion[] }>(`/knowledge-items/${id}/versions`);
}

export function createKnowledgeVersion(id: string, payload: KnowledgeVersionCreate) {
  return apiRequest<IntakeRequest>(`/knowledge-items/${id}/versions`, {
    method: "POST",
    body: payload,
  });
}
