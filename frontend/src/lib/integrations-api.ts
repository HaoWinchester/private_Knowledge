import { apiRequest } from "./api-client";
import type {
  ApplicationKeyRotationResponse,
  ApplicationPolicyState,
  ApplicationSummary,
  KnowledgeServiceResponse,
} from "./api-types";

export function listApplications() {
  return apiRequest<{ items: ApplicationSummary[] }>("/applications");
}

export function rotateApplicationKey(applicationId: string) {
  return apiRequest<ApplicationKeyRotationResponse>(`/applications/${applicationId}/keys/rotate`, {
    method: "POST",
  });
}

export function getApplicationPolicies() {
  return apiRequest<ApplicationPolicyState>("/application-policies");
}

export function updateApplicationPolicies(body: Partial<ApplicationPolicyState>) {
  return apiRequest<ApplicationPolicyState>("/application-policies", {
    method: "PATCH",
    body,
  });
}

export function queryKnowledgeService(body: {
  applicationId: string;
  requesterUserId: string;
  requestType: "retrieve" | "qa" | "recommend";
  businessContext: string;
  projectContext?: string;
  input: string;
}) {
  return apiRequest<KnowledgeServiceResponse>("/api/v1/knowledge/query", {
    method: "POST",
    body,
  });
}
