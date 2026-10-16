export type FavoritesListener = (ids: readonly string[]) => void;

export interface FavoritesStore {
  list(): readonly string[];
  has(id: string): boolean;
  toggle(id: string): void;
  clear(): void;
  /** Calls the listener immediately, then on every change. Returns the unsubscribe function. */
  subscribe(listener: FavoritesListener): () => void;
}

export function createFavoritesStore(initial: readonly string[] = []): FavoritesStore {
  let ids: readonly string[] = [...new Set(initial)];
  const listeners = new Set<FavoritesListener>();

  function set(next: readonly string[]) {
    ids = next;
    for (const listener of [...listeners]) listener(ids);
  }

  return {
    list: () => ids,
    has: (id) => ids.includes(id),
    toggle(id) {
      set(ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id]);
    },
    clear() {
      if (ids.length) set([]);
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(ids);
      return () => { listeners.delete(listener); };
    },
  };
}

// Module-level instance: it is shared by every application only because Module Federation
// declares @demo/shared as a singleton. A bundled copy would get its own, separate state.
export const favorites = createFavoritesStore();
