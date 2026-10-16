import { test } from "node:test";
import assert from "node:assert/strict";
import { createFavoritesStore } from "../packages/shared/src/services/favorites.ts";
import { summarize } from "../packages/shared/src/services/reports.ts";
import type { Client } from "../packages/shared/src/services/clients.ts";

test("favorites store notifies subscribers immediately and on change", () => {
  const store = createFavoritesStore();
  const seen: (readonly string[])[] = [];
  const unsubscribe = store.subscribe((ids) => seen.push(ids));
  store.toggle("1");
  store.toggle("2");
  store.toggle("1");
  unsubscribe();
  store.clear();
  assert.deepEqual(seen, [[], ["1"], ["1", "2"], ["2"]]);
  assert.deepEqual(store.list(), []);
});

test("clearing an empty store does not notify", () => {
  const store = createFavoritesStore();
  let calls = 0;
  store.subscribe(() => calls++);
  store.clear();
  assert.equal(calls, 1);
});

test("summarize counts active clients, revenue and favorites", () => {
  const base = { email: "", company: "", city: "", since: "2020-01-01" };
  const clients: Client[] = [
    { ...base, id: "1", name: "A", status: "Actif", revenue: 100 },
    { ...base, id: "2", name: "B", status: "En pause", revenue: 50 },
  ];
  assert.deepEqual(summarize(clients, ["2", "unknown"]), { total: 2, active: 1, revenue: 150, favorites: 1 });
});
