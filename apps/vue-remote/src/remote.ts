import { createApp } from "vue";
import type { RemoteOptions, RemoteHandle } from "@demo/contracts";
import App from "./App.vue";
import { makeRouter } from "./router";
import { bridgeNavigation } from "./router-bridge";

export async function mount(container: HTMLElement, options: RemoteOptions): Promise<RemoteHandle> {
  const router = makeRouter(true);
  await router.push(options.initialPath);
  const bridge = bridgeNavigation(router, options.onNavigate);
  const app = createApp(App);
  app.use(router);
  app.mount(container);
  return {
    navigate: bridge.navigate,
    unmount() { bridge.dispose(); app.unmount(); },
  };
}
