import { DestroyRef, Injectable, computed, inject, signal } from "@angular/core";
import { favorites } from "@demo/shared";

/** Exposes the favorites store shared by all applications as Angular signals. */
@Injectable({ providedIn: "root" })
export class FavoritesService {
  private readonly state = signal<readonly string[]>([]);
  readonly ids = this.state.asReadonly();
  readonly count = computed(() => this.state().length);

  constructor() {
    const unsubscribe = favorites.subscribe((ids) => this.state.set(ids));
    inject(DestroyRef).onDestroy(unsubscribe);
  }

  has(id: string): boolean {
    return this.state().includes(id);
  }

  toggle(id: string): void {
    favorites.toggle(id);
  }

  clear(): void {
    favorites.clear();
  }
}
