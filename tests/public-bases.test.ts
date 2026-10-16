import { test } from "node:test";
import assert from "node:assert/strict";
import { publicBases } from "../build/public-bases.ts";

test("keeps the local five-server configuration", () => {
  assert.deepEqual(publicBases(), {
    shell: "/",
    remotes: {
      "vue-clients": "http://localhost:5001/",
      "angular-clients": "http://localhost:5002/",
      "vue-backoffice": "http://localhost:5003/",
      "angular-backoffice": "http://localhost:5004/",
    },
  });
});

test("builds URLs for repository Pages, root Pages and custom domains", () => {
  for (const base of ["https://example.github.io/demo", "https://example.github.io/", "https://demo.example.test"]) {
    const normalized = base.endsWith("/") ? base : `${base}/`;
    assert.deepEqual(publicBases(base), {
      shell: normalized,
      remotes: {
        "vue-clients": `${normalized}remotes/vue-clients/`,
        "angular-clients": `${normalized}remotes/angular-clients/`,
        "vue-backoffice": `${normalized}remotes/vue-backoffice/`,
        "angular-backoffice": `${normalized}remotes/angular-backoffice/`,
      },
    });
  }
});

test("rejects invalid public URLs instead of building broken assets", () => {
  for (const base of ["relative/path", "file:///demo", "https://example.test/?query=1", "https://example.test/#fragment"]) {
    assert.throws(() => publicBases(base));
  }
});
