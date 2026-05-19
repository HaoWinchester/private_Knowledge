export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8001";

export const API_TOKEN = import.meta.env.VITE_API_TOKEN ?? "";

export const USE_GOVERNED_SERVICE = import.meta.env.VITE_USE_GOVERNED_SERVICE === "true";
