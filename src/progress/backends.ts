/** Where progress is kept (ADR 0006). A future account sync is another backend. */
export interface StorageBackend {
  read(): string | null;
  write(value: string): void;
  clear(): void;
}

export const STORAGE_KEY = 'surfelappen:progress';

export function memoryBackend(initial: string | null = null): StorageBackend {
  let value = initial;
  return {
    read: () => value,
    write: (next) => {
      value = next;
    },
    clear: () => {
      value = null;
    },
  };
}

/** Returns a localStorage backend, or null if storage is unavailable or throws. */
export function localStorageBackend(key = STORAGE_KEY): StorageBackend | null {
  try {
    const storage = window.localStorage;
    const probe = `${key}:probe`;
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return {
      read: () => storage.getItem(key),
      write: (value) => storage.setItem(key, value),
      clear: () => storage.removeItem(key),
    };
  } catch {
    return null;
  }
}
