import { publicBases, remoteApps, type RemoteApp } from "./public-bases";

/**
 * Packages shared at runtime by Module Federation.
 * `@demo/shared` is a singleton: the shell and every remote use the same instance,
 * so stores such as `favorites` hold one state for the whole page.
 */
export const sharedPureLib = {
  "@demo/shared": { singleton: true, requiredVersion: "^1.0.0" },
} as const;

export const vueShared = {
  vue: { singleton: true, requiredVersion: "^3.5.0" },
  ...sharedPureLib,
} as const;

const angularShare = { singleton: true, requiredVersion: "21.2.0" } as const;

// Every Angular package imported by the applications must be listed. Do not use
// @angular/core/rxjs-interop (toSignal, takeUntilDestroyed...): it imports private chunks of
// @angular/core instead of "@angular/core" itself, so when it comes from another remote than the
// shared core it gets its own injection context and fails with NG0203.
export const angularShared = {
  "@angular/core": angularShare,
  "@angular/common": angularShare,
  "@angular/router": angularShare,
  "@angular/platform-browser": angularShare,
  rxjs: { singleton: true, requiredVersion: "^7.8.2" },
  ...sharedPureLib,
} as const;

/** Vite options common to every remote: base URL, port, CORS and federation name. */
export function remoteSettings(app: RemoteApp) {
  const { port, federationName } = remoteApps[app];
  return {
    federationName,
    base: publicBases(process.env.PAGES_BASE_URL).remotes[app],
    server: { port, strictPort: true, cors: true, origin: `http://localhost:${port}` },
    preview: { port, strictPort: true, cors: true },
  };
}
