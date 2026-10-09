import { APP_BASE_HREF, LocationStrategy } from "@angular/common";
import type { ApplicationConfig } from "@angular/core";
import { provideRouter, withDisabledInitialNavigation, withHashLocation, type Routes } from "@angular/router";
import type { RemoteOptions } from "@demo/contracts";
import { routes } from "./app.routes";
import { delegateNavigation, MemoryLocationStrategy } from "../navigation";

export function createAppConfig(options?: RemoteOptions): ApplicationConfig {
  const applicationRoutes: Routes = options ? [{
    path: "",
    canActivateChild: [delegateNavigation(options.onNavigate)],
    runGuardsAndResolvers: "always",
    children: routes.map((route) => ({ ...route, runGuardsAndResolvers: "always" })),
  }] : routes;
  return {
    providers: [
      provideRouter(applicationRoutes, withDisabledInitialNavigation(),
        ...(!options && import.meta.env.VITE_ROUTER_MODE === "hash" ? [withHashLocation()] : [])),
      ...(options ? [{
        provide: LocationStrategy,
        useFactory: () => new MemoryLocationStrategy(options.resolveHref),
      }] : [{
        provide: APP_BASE_HREF,
        useValue: import.meta.env.VITE_ROUTER_MODE === "hash"
          ? "/" : new URL(import.meta.env.BASE_URL, location.origin).pathname,
      }]),
    ],
  };
}

export const appConfig = createAppConfig();
