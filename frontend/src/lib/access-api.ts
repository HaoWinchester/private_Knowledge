import { apiRequest } from "./api-client";
import type { AuthorizationRequest } from "./api-types";

export function listAuthorizationRequests() {
  return apiRequest<{ items: AuthorizationRequest[] }>("/authorization-requests");
}

export function createAuthorizationRequest(body: {
  knowledgeItemId: string;
  requestedPermission: string;
  businessContext: string;
}) {
  return apiRequest<AuthorizationRequest>("/authorization-requests", { method: "POST", body });
}

export function reviewAuthorizationRequest(
  authorizationRequestId: string,
  body: { decision: "approve" | "reject"; reviewComment?: string; expiresAt?: string },
) {
  return apiRequest<AuthorizationRequest>(
    `/authorization-requests/${authorizationRequestId}/review`,
    {
      method: "POST",
      body,
    },
  );
}
