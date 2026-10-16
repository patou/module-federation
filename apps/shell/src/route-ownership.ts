export type RemoteName = "angular-clients" | "angular-backoffice" | "vue-clients" | "vue-backoffice";
export type Scenario = "angular" | "partial" | "vue";

export interface OwnedRoute {
  path: string;
  label: string;
  owners: Record<Scenario, RemoteName>;
}

export const remoteLabels: Record<RemoteName, string> = {
  "angular-clients": "Angular 1",
  "angular-backoffice": "Angular 2",
  "vue-clients": "Vue 1",
  "vue-backoffice": "Vue 2",
};

// Match full segments: migrating /clients must not also migrate /clients/:id.
export const routeOwnership: OwnedRoute[] = [
  { path: "/clients", label: "Clients",
    owners: { angular: "angular-clients", partial: "vue-clients", vue: "vue-clients" } },
  { path: "/clients/:id", label: "Détail client",
    owners: { angular: "angular-clients", partial: "angular-clients", vue: "vue-clients" } },
  { path: "/rapports", label: "Rapports",
    owners: { angular: "angular-backoffice", partial: "vue-backoffice", vue: "vue-backoffice" } },
  { path: "/parametres", label: "Paramètres",
    owners: { angular: "angular-backoffice", partial: "angular-backoffice", vue: "vue-backoffice" } },
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
