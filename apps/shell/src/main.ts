import { createApp } from "vue";
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import App from "./App.vue";

const router = createRouter({
  history: import.meta.env.VITE_ROUTER_MODE === "hash"
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/clients" },
    { path: "/:pathMatch(.*)*", component: { template: "<span />" } },
  ],
});
const app = createApp(App);
app.use(router);
await router.isReady();
app.mount("#app");
