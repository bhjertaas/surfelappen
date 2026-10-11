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

/**
 * Fetches a lesson's media in the background when the lesson opens, so the service
 * worker caches it and the whole lesson works offline from then on (ADR 0017).
 * Failures don't matter: the pictures load normally when shown.
 */
export function usePrefetchLesson(mission: MissionStructure | undefined) {
  useEffect(() => {
    if (!mission || !navigator.onLine) return;
    const sources = [...artUsedBy(mission).map((id) => artFor(id)?.src), ...audioUsedBy(mission)];
    for (const src of sources) if (src) fetch(src).catch(() => undefined);
  }, [mission]);
}
