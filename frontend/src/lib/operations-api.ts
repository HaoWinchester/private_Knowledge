import { apiRequest } from "./api-client";
import type { OperationsSummary } from "./api-types";

export function getOperationsSummary() {
  return apiRequest<OperationsSummary>("/operations/summary");
}
