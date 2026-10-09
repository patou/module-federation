<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import type { RemoteHandle, RemoteApplication } from "@demo/contracts";
import type { RemoteName } from "./route-ownership";

const props = defineProps<{ owner?: RemoteName; path: string }>();
const router = useRouter();
const container = ref<HTMLElement>();
const loading = ref(false);
const error = ref("");
const retry = ref(0);
let handle: RemoteHandle | undefined;
let mountedOwner: RemoteName | undefined;
let generation = 0;
let stopped = false;
let pending = Promise.resolve();

const loaders: Record<RemoteName, () => Promise<RemoteApplication>> = {
  vue: () => import("vue_remote/app"),
  angular: () => import("angular_remote/app"),
};

function clearRemote() {
  handle?.unmount();
  handle = undefined;
  mountedOwner = undefined;
  container.value?.replaceChildren();
}

watch(() => [props.owner, props.path, retry.value] as const, ([owner, path]) => {
  const request = ++generation;
  loading.value = !!owner;
  error.value = "";
  // Serialize lifecycle changes; discard results made obsolete while importing or mounting.
  pending = pending.then(async () => {
    if (stopped || request !== generation) return;
    try {
      if (!owner) {
        clearRemote();
        return;
      }
      if (handle && mountedOwner === owner) {
        await handle.navigate(path);
        return;
      }
      clearRemote();
      const remote = await loaders[owner]();
      if (stopped || request !== generation) return;
      if (!container.value) throw new Error("Conteneur du remote absent");
      const next = await remote.mount(container.value, {
        initialPath: path,
        resolveHref: (path) => router.resolve(path).href,
        onNavigate: (target) => {
          if (!stopped && handle === next) void router.push(target);
        },
      });
      if (stopped || request !== generation) {
        next.unmount();
        container.value?.replaceChildren();
        return;
      }
      handle = next;
      mountedOwner = owner;
    } catch (cause) {
      clearRemote();
      console.error("Erreur du remote", cause);
      if (request === generation) {
        error.value = cause instanceof Error ? cause.message : String(cause);
      }
    } finally {
      if (request === generation) loading.value = false;
    }
  });
}, { immediate: true, flush: "post" });

onBeforeUnmount(() => {
  stopped = true;
  ++generation;
  clearRemote();
});
</script>

<template>
  <p v-if="!owner" role="status">404 — Cette URL ne correspond à aucune page.</p>
  <p v-if="loading" role="status">Chargement de l’application {{ owner }}…</p>
  <div v-if="error" role="alert" class="error">
    <p>Impossible d’afficher l’application {{ owner }} : {{ error }}</p>
    <button @click="retry++">Réessayer</button>
    <p>Vérifiez que le remote est démarré. Aucun basculement automatique ne masque cette erreur.</p>
  </div>
  <div ref="container" :aria-busy="loading" />
</template>

<style scoped>
.error { padding: 16px; border: 1px solid #bf3434; border-radius: 8px; background: #fff1f1; }
</style>
