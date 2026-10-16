import type { RouteRecordRaw } from "vue-router";
import { NotFoundPage } from "@demo/vue-shared";
import Clients from "./pages/Clients.vue";
import ClientDetail from "./pages/ClientDetail.vue";

export const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/clients" },
  { path: "/clients", component: Clients },
  { path: "/clients/:id", component: ClientDetail },
  { path: "/:pathMatch(.*)*", component: NotFoundPage },
];
