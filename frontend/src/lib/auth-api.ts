import { apiRequest } from "./api-client";
import { saveStoredAuthToken } from "./auth-session";
import type { UserContext } from "./api-types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  displayName: string;
  departmentName: string;
  role: "knowledge_admin" | "domain_expert" | "security_admin" | "employee";
}

export interface AuthResponse {
  token: string;
  user: UserContext;
}

export function saveAuthSession(response: AuthResponse) {
  saveStoredAuthToken(response.token);
}

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
    token: "",
  });
}

export function register(payload: RegisterPayload) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
    token: "",
  });
}
