import { computed, onScopeDispose, shallowRef } from "vue";
import { favorites } from "@demo/shared";

/** Reactive view of the favorites store shared by every application. */
export function useFavorites() {
  const ids = shallowRef<readonly string[]>(favorites.list());
  onScopeDispose(favorites.subscribe((next) => { ids.value = next; }));
  return {
    ids,
    count: computed(() => ids.value.length),
    has: (id: string) => ids.value.includes(id),
    toggle: (id: string) => favorites.toggle(id),
    clear: () => favorites.clear(),
  };
}
