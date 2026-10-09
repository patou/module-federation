import { createRouter, createMemoryHistory, createWebHistory } from "vue-router";
import Clients from "./pages/Clients.vue";
import ClientDetail from "./pages/ClientDetail.vue";
import Reports from "./pages/Reports.vue";
import Settings from "./pages/Settings.vue";

export function makeRouter(integrated: boolean) {
  return createRouter({
    history: integrated ? createMemoryHistory() : createWebHistory(),
    routes: [
      { path: "/", redirect: "/clients" },
      { path: "/clients", component: Clients },
      { path: "/clients/:id", component: ClientDetail },
      { path: "/rapports", component: Reports },
      { path: "/parametres", component: Settings },
      { path: "/:pathMatch(.*)*", component: { template: "<h2>Page Vue introuvable</h2>" } },
    ],
  });
}
