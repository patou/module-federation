import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from "vue-router";
import Clients from "./pages/Clients.vue";
import ClientDetail from "./pages/ClientDetail.vue";
import Reports from "./pages/Reports.vue";
import Settings from "./pages/Settings.vue";

export function makeRouter(integrated: boolean, resolveHref?: (path: string) => string) {
  const history = integrated ? createMemoryHistory()
    : import.meta.env.VITE_ROUTER_MODE === "hash"
      ? createWebHashHistory(import.meta.env.BASE_URL)
      : createWebHistory(import.meta.env.BASE_URL);
  if (integrated && resolveHref) history.createHref = resolveHref;
  return createRouter({
    history,
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
