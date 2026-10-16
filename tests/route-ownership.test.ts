import { test } from "node:test";
import assert from "node:assert/strict";
import { ownerFor, remoteLabels, routeOwnership } from "../apps/shell/src/route-ownership.ts";

test("migrates the list independently from its detail", () => {
  assert.equal(ownerFor("/clients", "partial"), "vue-clients");
  assert.equal(ownerFor("/clients/1?source=liste#fiche", "partial"), "angular-clients");
});

test("migrates the back-office page by page", () => {
  assert.equal(ownerFor("/rapports", "partial"), "vue-backoffice");
  assert.equal(ownerFor("/parametres", "partial"), "angular-backoffice");
});

test("preserves all routes across before and after scenarios", () => {
  for (const route of routeOwnership) {
    const path = route.path.replace(":id", "42");
    assert.match(ownerFor(path, "angular") ?? "", /^angular-/);
    assert.match(ownerFor(path, "vue") ?? "", /^vue-/);
  }
});

test("labels every remote", () => {
  for (const route of routeOwnership) {
    for (const owner of Object.values(route.owners)) assert.ok(remoteLabels[owner]);
  }
});

test("matches whole routes, ignores query/fragment and accepts trailing slash", () => {
  assert.equal(ownerFor("/clients/?source=x#fiche", "partial"), "vue-clients");
  assert.equal(ownerFor("/clients-other", "partial"), undefined);
  assert.equal(ownerFor("/clients/1/extra", "partial"), undefined);
  assert.equal(ownerFor("/unknown", "vue"), undefined);
});
