import { createApp } from "vue";
import App from "./App.vue";
import { makeRouter } from "./router";

const router = makeRouter(false);
const app = createApp(App);
app.use(router);
await router.isReady();
app.mount("#app");
