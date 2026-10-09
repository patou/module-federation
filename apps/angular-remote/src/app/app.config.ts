import { LocationStrategy } from "@angular/common";
import type { ApplicationConfig } from "@angular/core";
import { provideRouter, withDisabledInitialNavigation, type Routes } from "@angular/router";
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
      provideRouter(applicationRoutes, withDisabledInitialNavigation()),
      ...(options ? [{ provide: LocationStrategy, useClass: MemoryLocationStrategy }] : []),
    ],
  };
}

export const appConfig = createAppConfig();
