export type ClientStatus = "Actif" | "En pause";

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  city: string;
  status: ClientStatus;
  since: string;
  revenue: number;
}

const clients: readonly Client[] = [
  {
    id: "1", name: "Alice Martin", email: "alice.martin@example.test", company: "Atelier Horizon",
    city: "Lyon", status: "Actif", since: "2021-03-15", revenue: 48200,
  },
  {
    id: "2", name: "Karim Bernard", email: "karim.bernard@example.test", company: "Studio Rivage",
    city: "Nantes", status: "Actif", since: "2022-09-01", revenue: 31750,
  },
  {
    id: "3", name: "Chloé Dubois", email: "chloe.dubois@example.test", company: "Maison Ardoise",
    city: "Lille", status: "En pause", since: "2020-01-20", revenue: 12900,
  },
];

// Asynchronous API so that the fake data can later be replaced by HTTP calls without changing consumers.
export const clientService = {
  async list(): Promise<readonly Client[]> {
    return clients;
  },
  async get(id: string): Promise<Client | undefined> {
    return clients.find((client) => client.id === id);
  },
};
