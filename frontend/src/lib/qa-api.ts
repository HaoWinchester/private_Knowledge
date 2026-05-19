import { apiRequest } from "./api-client";
import type { QAResponse } from "./api-types";

export function answerQuestion(question: string, businessContext = "frontend-ai-chat") {
  return apiRequest<QAResponse>("/qa", {
    method: "POST",
    body: { question, businessContext },
  });
}
