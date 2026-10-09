export function publicBases(pagesUrl?: string) {
  if (!pagesUrl) {
    return {
      shell: "/",
      vue: "http://localhost:5001/",
      angular: "http://localhost:5002/",
    };
  }
  const url = new URL(pagesUrl);
  if (!["https:", "http:"].includes(url.protocol) || url.search || url.hash) {
    throw new Error("PAGES_BASE_URL must be an HTTP(S) URL without query or fragment");
  }
  const base = url.href.endsWith("/") ? url.href : `${url.href}/`;
  return {
    shell: base,
    vue: new URL("remotes/vue/", base).href,
    angular: new URL("remotes/angular/", base).href,
  };
}
