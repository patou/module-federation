export interface RemoteOptions {
  initialPath: string;
  onNavigate: (path: string) => void;
  resolveHref?: (path: string) => string;
}

export interface RemoteHandle {
  navigate: (path: string) => Promise<void>;
  unmount: () => void;
}

export interface RemoteApplication {
  mount: (container: HTMLElement, options: RemoteOptions) => Promise<RemoteHandle>;
}
