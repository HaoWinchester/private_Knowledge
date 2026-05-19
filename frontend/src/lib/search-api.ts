import { apiRequest } from "./api-client";
import type { KnowledgeCard } from "./api-types";

export function searchKnowledge(query: string) {
  return apiRequest<{ items: KnowledgeCard[]; auditEventId: string }>("/search", {
    method: "POST",
    body: { query },
  });
}
