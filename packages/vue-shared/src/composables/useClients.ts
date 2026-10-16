import { shallowRef, toValue, watchEffect, type MaybeRefOrGetter } from "vue";
import { clientService, type Client } from "@demo/shared";

export function useClientList() {
  const clients = shallowRef<readonly Client[]>();
  clientService.list().then((list) => { clients.value = list; });
  return clients;
}

export function useClient(id: MaybeRefOrGetter<string>) {
  const client = shallowRef<Client>();
  const loading = shallowRef(true);
  watchEffect((onCleanup) => {
    let cancelled = false;
    onCleanup(() => { cancelled = true; });
    loading.value = true;
    clientService.get(toValue(id)).then((found) => {
      if (cancelled) return;
      client.value = found;
      loading.value = false;
    });
  });
  return { client, loading };
}
