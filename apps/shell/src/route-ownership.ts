export type RemoteName = "angular" | "vue";
export type Scenario = "angular" | "partial" | "vue";

export interface OwnedRoute {
  path: string;
  label: string;
  owners: Record<Scenario, RemoteName>;
}

// Match full segments: migrating /clients must not also migrate /clients/:id.
export const routeOwnership: OwnedRoute[] = [
  { path: "/clients", label: "Clients", owners: { angular: "angular", partial: "vue", vue: "vue" } },
  { path: "/clients/:id", label: "Détail client", owners: { angular: "angular", partial: "angular", vue: "vue" } },
  { path: "/rapports", label: "Rapports", owners: { angular: "angular", partial: "angular", vue: "vue" } },
  { path: "/parametres", label: "Paramètres", owners: { angular: "angular", partial: "angular", vue: "vue" } },
];

export function ownerFor(path: string, scenario: Scenario): RemoteName | undefined {
  const pathname = path.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
  const segments = pathname.split("/");
  return routeOwnership.find((route) => {
    const pattern = route.path.split("/");
    return pattern.length === segments.length &&
      pattern.every((part, index) => part.startsWith(":") ? segments[index].length > 0 : part === segments[index]);
  })?.owners[scenario];
}
