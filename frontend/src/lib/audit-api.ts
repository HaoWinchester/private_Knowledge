import { apiRequest } from "./api-client";
import type { AuditEvent } from "./api-types";

export function listAuditEvents() {
  return apiRequest<{ items: AuditEvent[] }>("/audit-events");
}
