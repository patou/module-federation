import { test } from "node:test";
import assert from "node:assert/strict";
import { publicBases } from "../build/public-bases.ts";

test("keeps the local three-server configuration", () => {
  assert.deepEqual(publicBases(), {
    shell: "/", vue: "http://localhost:5001/", angular: "http://localhost:5002/",
  });
});

test("builds URLs for repository Pages, root Pages and custom domains", () => {
  for (const base of ["https://example.github.io/demo", "https://example.github.io/", "https://demo.example.test"]) {
    const normalized = base.endsWith("/") ? base : `${base}/`;
    assert.deepEqual(publicBases(base), {
      shell: normalized,
      vue: `${normalized}remotes/vue/`,
      angular: `${normalized}remotes/angular/`,
    });
  }
});

test("rejects invalid public URLs instead of building broken assets", () => {
  for (const base of ["relative/path", "file:///demo", "https://example.test/?query=1", "https://example.test/#fragment"]) {
    assert.throws(() => publicBases(base));
  }
});
