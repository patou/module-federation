import type { RouteRecordRaw } from "vue-router";
import { NotFoundPage } from "@demo/vue-shared";
import Reports from "./pages/Reports.vue";
import Settings from "./pages/Settings.vue";

export const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/rapports" },
  { path: "/rapports", component: Reports },
  { path: "/parametres", component: Settings },
  { path: "/:pathMatch(.*)*", component: NotFoundPage },
];
