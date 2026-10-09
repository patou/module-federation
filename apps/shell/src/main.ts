import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/clients" },
    { path: "/:pathMatch(.*)*", component: { template: "<span />" } },
  ],
});
const app = createApp(App);
app.use(router);
await router.isReady();
app.mount("#app");
