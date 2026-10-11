import { useEffect } from 'preact/hooks';
import { artFor, artUsedBy } from '../content/art.ts';
import type { MissionStructure } from '../content/types.ts';

/**
 * Fetches a lesson's media in the background when the lesson opens, so the service
 * worker caches it and the whole lesson works offline from then on (ADR 0017).
 * Failures don't matter: the pictures load normally when shown.
 */
export function usePrefetchLesson(mission: MissionStructure | undefined) {
  useEffect(() => {
    if (!mission || !navigator.onLine) return;
    for (const id of artUsedBy(mission)) {
      const src = artFor(id)?.src;
      if (src) fetch(src).catch(() => undefined);
    }
  }, [mission]);
}
