export const queryKeys = {
  health: ["health"] as const,
  me: ["me"] as const,
  knowledge: {
    all: ["knowledge"] as const,
    list: (filters: Record<string, unknown>) => ["knowledge", "list", filters] as const,
    detail: (id: string) => ["knowledge", "detail", id] as const,
  },
  review: {
    requests: (status?: string) => ["review", "requests", status ?? "all"] as const,
  },
  access: {
    requests: ["access", "requests"] as const,
  },
  audit: {
    events: (filters: Record<string, unknown>) => ["audit", "events", filters] as const,
  },
  operations: {
    summary: ["operations", "summary"] as const,
  },
  integrations: {
    applications: ["integrations", "applications"] as const,
    policies: ["integrations", "policies"] as const,
  },
};
