import type { RemoteApplication } from "@demo/contracts";
import { app } from "./app/app";

export const mount: RemoteApplication["mount"] = (container, options) => app.mount(container, options);
