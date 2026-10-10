import { registerSW } from 'virtual:pwa-register';

/**
 * Service-worker registration (ADR 0007). A new version installs in the background
 * and waits; `onUpdateAvailable` lets the UpdateBar offer a reload. We never
 * reload by ourselves.
 */
type Listener = () => void;

let updateAvailable = false;
let applyUpdate: ((reload?: boolean) => Promise<void>) | undefined;
const listeners = new Set<Listener>();

export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  applyUpdate = registerSW({
    onNeedRefresh() {
      updateAvailable = true;
      for (const listener of listeners) listener();
    },
  });
}

export function isUpdateAvailable(): boolean {
  return updateAvailable;
}

export function onUpdateAvailable(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Activates the waiting service worker and reloads the page. */
export function reloadWithUpdate(): void {
  void applyUpdate?.(true);
}
