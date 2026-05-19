import { apiRequest } from "./api-client";

export function getHealth() {
  return apiRequest<{ status: "ok" }>("/health");
}
