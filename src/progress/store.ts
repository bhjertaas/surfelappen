import type { StorageBackend } from './backends.ts';
import { load } from './migrations.ts';
import { emptyProgress, type Progress } from './schema.ts';

/**
 * The only owner of saved progress (ADR 0006). Updates are immutable: pass a
 * function that returns the next Progress. Writes are synchronous and tiny.
 *
 * Status:
 * - `ok`: saving works.
 * - `unavailable`: no storage (or a write failed); the game plays, nothing is kept.
 * - `newer-version`: stored data comes from a newer release (e.g. an old tab).
 *   We play from a fresh state in memory and never overwrite the newer data.
 */
export type StoreStatus = 'ok' | 'unavailable' | 'newer-version';

export interface ProgressStore {
  get(): Progress;
  update(next: (current: Progress) => Progress): void;
  subscribe(listener: () => void): () => void;
  /**
   * Called after each `update` in this tab with the state before and after. Not
   * called for `reload` (another tab) or `reset`, so effects like a sticker
   * celebration happen only where the sticker was earned.
   */
  onUpdate(listener: (before: Progress, after: Progress) => void): () => void;
  /** Clears everything, including stored data. Only after the player confirms. */
  reset(): void;
  /** Re-reads stored data, e.g. after another tab changed it. */
  reload(): void;
  status(): StoreStatus;
}

/**
 * @param derive applied after every update, e.g. to award stickers; must return
 *   the same object when it changes nothing.
 */
export function createProgressStore(
  backend: StorageBackend | null,
  derive: (progress: Progress) => Progress = (p) => p,
): ProgressStore {
  const listeners = new Set<() => void>();
  const updateListeners = new Set<(before: Progress, after: Progress) => void>();
  let status: StoreStatus = backend ? 'ok' : 'unavailable';
  let state = emptyProgress();

  const notify = () => {
    for (const listener of listeners) listener();
  };

  const readFromBackend = () => {
    if (!backend) return;
    let raw: string | null;
    try {
      raw = backend.read();
    } catch {
      status = 'unavailable';
      return;
    }
    const result = load(raw);
    switch (result.kind) {
      case 'ok':
        state = result.progress;
        status = 'ok';
        break;
      case 'empty':
      case 'corrupt':
        // Nothing usable; the next save replaces it.
        state = emptyProgress();
        status = 'ok';
        break;
      case 'newer':
        state = emptyProgress();
        status = 'newer-version';
        break;
    }
  };

  const persist = () => {
    if (!backend || status !== 'ok') return;
    try {
      backend.write(JSON.stringify(state));
    } catch {
      status = 'unavailable';
    }
  };

  readFromBackend();

  return {
    get: () => state,
    update(next) {
      const before = state;
      const updated = derive(next(state));
      if (updated === state) return;
      state = updated;
      persist();
      notify();
      for (const listener of updateListeners) listener(before, updated);
    },
    onUpdate(listener) {
      updateListeners.add(listener);
      return () => updateListeners.delete(listener);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    reset() {
      state = emptyProgress();
      if (backend) {
        try {
          backend.clear();
          status = 'ok';
        } catch {
          status = 'unavailable';
        }
      }
      notify();
    },
    reload() {
      readFromBackend();
      notify();
    },
    status: () => status,
  };
}
