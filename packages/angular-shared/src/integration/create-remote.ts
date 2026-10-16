import { APP_BASE_HREF, LocationStrategy } from "@angular/common";
import { reflectComponentType, type ApplicationConfig, type Type } from "@angular/core";
import { createApplication } from "@angular/platform-browser";
import {
  Router, provideRouter, withComponentInputBinding, withDisabledInitialNavigation, withHashLocation, type Routes,
} from "@angular/router";
import type { RemoteHandle, RemoteOptions } from "@demo/contracts";
import { defineDemoElements } from "@demo/shared/ui";
import { delegateNavigation, MemoryLocationStrategy, shellNavigation } from "./navigation";

export interface AngularRemoteDefinition {
  root: Type<unknown>;
  routes: Routes;
}

export interface AngularRemote {
  /** Federated entry point called by the shell. */
  mount(container: HTMLElement, options: RemoteOptions): Promise<RemoteHandle>;
  /** Standalone entry point: the application owns the browser URL. */
  startStandalone(container: HTMLElement): Promise<RemoteHandle>;
}

const hashMode = import.meta.env.VITE_ROUTER_MODE === "hash";

function createConfig(routes: Routes, options?: RemoteOptions): ApplicationConfig {
  // In the shell, every page route is wrapped so that navigations are delegated before activation.
  const applicationRoutes: Routes = options ? [{
    path: "",
    canActivateChild: [delegateNavigation(options.onNavigate)],
    runGuardsAndResolvers: "always",
    children: routes.map((route) => ({ ...route, runGuardsAndResolvers: "always" })),
  }] : routes;
  return {
    providers: [
      provideRouter(applicationRoutes, withDisabledInitialNavigation(), withComponentInputBinding(),
        ...(!options && hashMode ? [withHashLocation()] : [])),
      ...(options ? [{
        provide: LocationStrategy,
        useFactory: () => new MemoryLocationStrategy(options.resolveHref),
      }] : [{
        provide: APP_BASE_HREF,
        useValue: hashMode ? "/" : new URL(import.meta.env.BASE_URL, location.origin).pathname,
      }]),
    ],
  };
}

async function bootstrap(
  definition: AngularRemoteDefinition,
  container: HTMLElement,
  options?: RemoteOptions,
): Promise<RemoteHandle> {
  defineDemoElements();
  const selector = reflectComponentType(definition.root)?.selector;
  if (!selector) throw new Error("Le composant racine Angular doit déclarer un sélecteur");

  const app = await createApplication(createConfig(definition.routes, options));
  const host = document.createElement(selector);
  container.append(host);
  let destroyed = false;
  const unmount = (): void => {
    if (destroyed) return;
    destroyed = true;
    app.destroy();
    host.remove();
  };

  try {
    app.bootstrap(definition.root, host);
    const router = app.injector.get(Router);
    // Neither the initial nor shell-driven navigations are sent back to the shell.
    await router.navigateByUrl(
      options?.initialPath ?? (hashMode
        ? location.hash.slice(1) || "/"
        : `${location.pathname}${location.search}${location.hash}`),
      { replaceUrl: true, info: shellNavigation },
    );
    return {
      async navigate(path: string): Promise<void> {
        if (destroyed) throw new Error("Application Angular déjà démontée");
        await router.navigateByUrl(path, { info: shellNavigation });
      },
      unmount,
    };
  } catch (error) {
    unmount();
    throw error;
  }
}

export function createAngularRemote(definition: AngularRemoteDefinition): AngularRemote {
  return {
    mount: (container, options) => bootstrap(definition, container, options),
    startStandalone: (container) => bootstrap(definition, container),
  };
}
