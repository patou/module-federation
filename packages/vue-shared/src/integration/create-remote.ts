import { createApp, type Component } from "vue";
import {
  createMemoryHistory, createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw,
} from "vue-router";
import type { RemoteHandle, RemoteOptions } from "@demo/contracts";
import { defineDemoElements } from "@demo/shared/ui";
import { bridgeNavigation } from "./router-bridge";

export interface VueRemoteDefinition {
  component: Component;
  routes: RouteRecordRaw[];
}

export interface VueRemote {
  /** Federated entry point called by the shell. */
  mount(container: HTMLElement, options: RemoteOptions): Promise<RemoteHandle>;
  /** Standalone entry point: the application owns the browser URL. */
  startStandalone(container: HTMLElement): Promise<RemoteHandle>;
}

export function createVueRemote(definition: VueRemoteDefinition): VueRemote {
  return {
    async mount(container, options) {
      defineDemoElements();
      // The shell owns the browser history: the remote keeps its location in memory.
      const history = createMemoryHistory();
      if (options.resolveHref) history.createHref = options.resolveHref;
      const router = createRouter({ history, routes: definition.routes });
      await router.push(options.initialPath);
      const bridge = bridgeNavigation(router, options.onNavigate);
      const app = createApp(definition.component).use(router);
      app.mount(container);
      return {
        navigate: bridge.navigate,
        unmount() { bridge.dispose(); app.unmount(); },
      };
    },
    async startStandalone(container) {
      defineDemoElements();
      // BASE_URL is absolute (http://localhost:5001/ or the Pages URL): the history needs its path only.
      const base = new URL(import.meta.env.BASE_URL, location.origin).pathname;
      const history = import.meta.env.VITE_ROUTER_MODE === "hash"
        ? createWebHashHistory(base)
        : createWebHistory(base);
      const router = createRouter({ history, routes: definition.routes });
      const app = createApp(definition.component).use(router);
      await router.isReady();
      app.mount(container);
      return {
        navigate: async (path) => { await router.push(path); },
        unmount: () => app.unmount(),
      };
    },
  };
}
