import { test } from "node:test";
import assert from "node:assert/strict";
import { ownerFor, routeOwnership } from "../apps/shell/src/route-ownership.ts";

test("migrates the list independently from its detail", () => {
  assert.equal(ownerFor("/clients", "partial"), "vue");
  assert.equal(ownerFor("/clients/1?source=liste#fiche", "partial"), "angular");
});

test("preserves all routes across before and after scenarios", () => {
  for (const route of routeOwnership) {
    const path = route.path.replace(":id", "42");
    assert.equal(ownerFor(path, "angular"), "angular");
    assert.equal(ownerFor(path, "vue"), "vue");
  }
});

test("matches whole routes, ignores query/fragment and accepts trailing slash", () => {
  assert.equal(ownerFor("/clients/?source=x#fiche", "partial"), "vue");
  assert.equal(ownerFor("/clients-other", "partial"), undefined);
  assert.equal(ownerFor("/clients/1/extra", "partial"), undefined);
  assert.equal(ownerFor("/unknown", "vue"), undefined);
});
