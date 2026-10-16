import type { Client } from "./clients";

export interface ReportSummary {
  total: number;
  active: number;
  revenue: number;
  favorites: number;
}

export function summarize(clients: readonly Client[], favoriteIds: readonly string[]): ReportSummary {
  return {
    total: clients.length,
    active: clients.filter((client) => client.status === "Actif").length,
    revenue: clients.reduce((sum, client) => sum + client.revenue, 0),
    favorites: clients.filter((client) => favoriteIds.includes(client.id)).length,
  };
}
