import { apiRequest } from "./api-client";
import type { IntakeRequest, ReviewDecision, ReviewDecisionCreate } from "./api-types";

export function listIntakeRequests(status?: string) {
  const params = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<{ items: IntakeRequest[] }>(`/intake-requests${params}`);
}

export function reviewIntakeRequest(id: string, payload: ReviewDecisionCreate) {
  return apiRequest<ReviewDecision>(`/intake-requests/${id}/review`, {
    method: "POST",
    body: payload,
  });
}
