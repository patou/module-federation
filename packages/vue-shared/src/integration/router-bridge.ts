import type { Router } from "vue-router";

export function bridgeNavigation(router: Router, onNavigate: (path: string) => void) {
  let shellPath: string | undefined;
  const removeGuard = router.beforeEach((to) => {
    if (to.fullPath === shellPath) return true;
    onNavigate(to.fullPath);
    return false;
  });
  return {
    async navigate(path: string) {
      shellPath = router.resolve(path).fullPath;
      try { await router.push(path); }
      finally { shellPath = undefined; }
    },
    dispose: removeGuard,
  };
}
