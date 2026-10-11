import { useEffect } from 'preact/hooks';
import { artFor, artUsedBy } from '../content/art.ts';
import { audioFor } from '../content/audio.ts';
import type { MissionStructure } from '../content/types.ts';

/** Every narration source mentioned anywhere in a mission structure. */
function audioUsedBy(value: unknown): string[] {
  if (typeof value === 'string') {
    const src = audioFor(value);
    return src ? [src] : [];
  }
  if (Array.isArray(value)) return value.flatMap(audioUsedBy);
  if (value && typeof value === 'object') return Object.values(value).flatMap(audioUsedBy);
  return [];
}

/** True when the browser says the player wants to save data or is on a slow link. */
function savingData(): boolean {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  return Boolean(connection?.saveData) || /2g/.test(connection?.effectiveType ?? '');
}

/**
 * Fetches a lesson's media in the background when the lesson opens, so the service
 * worker caches it and the whole lesson works offline from then on (ADR 0017).
 * Online play comes first: it waits until the browser is idle, fetches one file at a
 * time at low priority, stops when the lesson closes, and skips data-saving
 * connections. Failures don't matter: the pictures load normally when shown.
 */
export function usePrefetchLesson(mission: MissionStructure | undefined) {
  useEffect(() => {
    if (!mission || !navigator.onLine || savingData()) return;
    const sources = [
      ...new Set(
        [...artUsedBy(mission).map((id) => artFor(id)?.src), ...audioUsedBy(mission)].filter(
          (src): src is string => Boolean(src),
        ),
      ),
    ];
    let stopped = false;
    const next = async () => {
      for (const src of sources) {
        if (stopped) return;
        await fetch(src, { priority: 'low' } as RequestInit).catch(() => undefined);
      }
    };
    const idle = window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 2000));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => void next(), { timeout: 5000 });
    return () => {
      stopped = true;
      cancel(handle);
    };
  }, [mission]);
}
