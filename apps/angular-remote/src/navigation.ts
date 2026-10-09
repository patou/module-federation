import { LocationStrategy, type LocationChangeListener } from "@angular/common";
import { inject } from "@angular/core";
import { Router, type CanActivateChildFn } from "@angular/router";
import type { RemoteOptions } from "@demo/contracts";

export const shellNavigation = Symbol("shell navigation");

export function delegateNavigation(onNavigate: RemoteOptions["onNavigate"]): CanActivateChildFn {
  return (_route, state) => {
    const router = inject(Router);
    if (router.currentNavigation()?.extras.info === shellNavigation) return true;
    onNavigate(state.url);
    return false;
  };
}

// The integrated router must never write to the shell's browser history.
export class MemoryLocationStrategy extends LocationStrategy {
  constructor(private readonly resolveHref: (path: string) => string = (path) => path) {
    super();
  }
  private currentPath = "/";
  private currentState: unknown = null;

  override path(): string { return this.currentPath; }
  override getState(): unknown { return this.currentState; }
  override prepareExternalUrl(path: string): string { return this.resolveHref(path); }
  override getBaseHref(): string { return "/"; }
  override pushState(state: unknown, _title: string, url: string, query: string): void {
    this.currentPath = url + (query ? `?${query}` : "");
    this.currentState = state;
  }
  override replaceState(state: unknown, title: string, url: string, query: string): void {
    this.pushState(state, title, url, query);
  }
  override onPopState(_listener: LocationChangeListener): void {}
  override back(): void {}
  override forward(): void {}
  override historyGo(_position = 0): void {}
}
