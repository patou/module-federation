export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
}

export const clients: readonly Client[] = [
  { id: "1", name: "Alice Martin", email: "alice.martin@example.test", company: "Atelier Horizon", status: "Actif" },
  { id: "2", name: "Karim Bernard", email: "karim.bernard@example.test", company: "Studio Rivage", status: "Actif" },
];
