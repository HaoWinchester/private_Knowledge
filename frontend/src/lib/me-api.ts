import { apiRequest } from "./api-client";
import type { UserContext } from "./api-types";

export function getCurrentUser() {
  return apiRequest<UserContext>("/me");
}
