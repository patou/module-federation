export interface RemoteOptions {
  initialPath: string;
  onNavigate: (path: string) => void;
}

export interface RemoteHandle {
  navigate: (path: string) => Promise<void>;
  unmount: () => void;
}

export interface RemoteApplication {
  mount: (container: HTMLElement, options: RemoteOptions) => Promise<RemoteHandle>;
}
