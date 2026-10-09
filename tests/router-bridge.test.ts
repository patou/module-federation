import { test } from "node:test";
import assert from "node:assert/strict";
import { createRouter, createMemoryHistory } from "vue-router";
import { bridgeNavigation } from "../apps/vue-remote/src/router-bridge.ts";

test("native remote navigation delegates to the shell without activating locally", async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:pathMatch(.*)*", component: { render: () => null } }],
  });
  await router.push("/clients");
  const requests: string[] = [];
  const bridge = bridgeNavigation(router, (path) => requests.push(path));
  await router.push({ path: "/clients/1", query: { source: "liste" }, hash: "#fiche" });
  assert.deepEqual(requests, ["/clients/1?source=liste#fiche"]);
  assert.equal(router.currentRoute.value.fullPath, "/clients");
  await bridge.navigate("/clients/1?source=liste#fiche");
  assert.equal(router.currentRoute.value.fullPath, "/clients/1?source=liste#fiche");
  assert.equal(requests.length, 1);
  await router.replace("/rapports");
  assert.deepEqual(requests, ["/clients/1?source=liste#fiche", "/rapports"]);
  await bridge.navigate("/rapports");
  await router.push("/parametres");
  assert.equal(requests.at(-1), "/parametres");
  bridge.dispose();
  await router.push("/parametres");
  assert.equal(router.currentRoute.value.fullPath, "/parametres");
  assert.equal(requests.length, 3);
});
