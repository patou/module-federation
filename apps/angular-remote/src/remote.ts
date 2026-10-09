import type { RemoteHandle, RemoteOptions } from "@demo/contracts";
import { bootstrap } from "./bootstrap";

export function mount(container: HTMLElement, options: RemoteOptions): Promise<RemoteHandle> {
  return bootstrap(container, options);
}
