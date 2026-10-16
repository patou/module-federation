import { createVueRemote } from "@demo/vue-shared";
import App from "./App.vue";
import { routes } from "./routes";

export const app = createVueRemote({ component: App, routes });
