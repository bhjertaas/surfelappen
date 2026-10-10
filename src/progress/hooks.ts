import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { memoryBackend } from './backends.ts';
import type { Progress } from './schema.ts';
import { createProgressStore, type ProgressStore, type StoreStatus } from './store.ts';

export const ProgressContext = createContext<ProgressStore>(createProgressStore(memoryBackend()));

export function useProgressStore(): ProgressStore {
  return useContext(ProgressContext);
}

/** Current progress and storage status; re-renders on every change. */
export function useProgress(): { progress: Progress; status: StoreStatus; store: ProgressStore } {
  const store = useProgressStore();
  const [snapshot, setSnapshot] = useState(() => ({
    progress: store.get(),
    status: store.status(),
  }));
  useEffect(() => {
    const update = () => setSnapshot({ progress: store.get(), status: store.status() });
    update();
    return store.subscribe(update);
  }, [store]);
  return { ...snapshot, store };
}
