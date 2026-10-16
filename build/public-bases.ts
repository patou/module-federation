/** Federated applications, their local port and the folder used on GitHub Pages. */
export const remoteApps = {
  "vue-clients": { federationName: "vue_clients", port: 5001 },
  "angular-clients": { federationName: "angular_clients", port: 5002 },
  "vue-backoffice": { federationName: "vue_backoffice", port: 5003 },
  "angular-backoffice": { federationName: "angular_backoffice", port: 5004 },
} as const;

export type RemoteApp = keyof typeof remoteApps;

export const remoteAppNames = Object.keys(remoteApps) as RemoteApp[];

export function publicBases(pagesUrl?: string): { shell: string; remotes: Record<RemoteApp, string> } {
  if (!pagesUrl) {
    return {
      shell: "/",
      remotes: Object.fromEntries(remoteAppNames.map((app) =>
        [app, `http://localhost:${remoteApps[app].port}/`])) as Record<RemoteApp, string>,
    };
  }
  const url = new URL(pagesUrl);
  if (!["https:", "http:"].includes(url.protocol) || url.search || url.hash) {
    throw new Error("PAGES_BASE_URL must be an HTTP(S) URL without query or fragment");
  }
  const base = url.href.endsWith("/") ? url.href : `${url.href}/`;
  return {
    shell: base,
    remotes: Object.fromEntries(remoteAppNames.map((app) =>
      [app, new URL(`remotes/${app}/`, base).href])) as Record<RemoteApp, string>,
  };
}
