import { createApplication } from "@angular/platform-browser";
import { Router } from "@angular/router";
import type { RemoteHandle, RemoteOptions } from "@demo/contracts";
import { AppComponent } from "./app/app.component";
import { createAppConfig } from "./app/app.config";
import { shellNavigation } from "./navigation";

export async function bootstrap(
  container: HTMLElement,
  options?: RemoteOptions,
): Promise<RemoteHandle> {
  const app = await createApplication(createAppConfig(options));
  const host = document.createElement("angular-remote-root");
  container.append(host);
  let destroyed = false;
  const unmount = (): void => {
    if (destroyed) return;
    destroyed = true;
    app.destroy();
    host.remove();
  };

  try {
    app.bootstrap(AppComponent, host);
    const router = app.injector.get(Router);
    // Neither initial nor shell-driven navigation emits a host navigation request.
    await router.navigateByUrl(
      options?.initialPath ?? `${location.pathname}${location.search}${location.hash}`,
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
