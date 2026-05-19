import { apiRequest } from "./api-client";
import type { QualitySignal } from "./api-types";

export function createQualitySignal(body: {
  knowledgeItemId: string;
  signalType: string;
  value?: string;
  comment?: string;
}) {
  return apiRequest<QualitySignal>("/quality-signals", { method: "POST", body });
}
