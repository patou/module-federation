import type { RemoteApplication } from "@demo/contracts";
import { app } from "./application";

export const mount: RemoteApplication["mount"] = (container, options) => app.mount(container, options);
