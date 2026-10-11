import type { Spot, Verdict } from '../../content/types.ts';

/**
 * Checking one picture: search for older copies, tap the parts of the picture,
 * then say what it is. The verdict opens once the search is done and every clue
 * is found; a wrong verdict can be tried again.
 */
export interface PictureCheck {
  readonly searched: boolean;
  /** Spots tapped so far, clues and others. */
  readonly tapped: readonly string[];
  /** The spot whose explanation is showing. */
  readonly showing: string | null;
  readonly verdict: Verdict | null;
}

export const FRESH: PictureCheck = { searched: false, tapped: [], showing: null, verdict: null };

export function search(check: PictureCheck): PictureCheck {
  return check.searched ? check : { ...check, searched: true };
}

export function tap(check: PictureCheck, spotId: string): PictureCheck {
  const tapped = check.tapped.includes(spotId) ? check.tapped : [...check.tapped, spotId];
  return { ...check, tapped, showing: spotId };
}

export function cluesFound(spots: readonly Spot[], check: PictureCheck): number {
  return spots.filter((s) => s.clue && check.tapped.includes(s.id)).length;
}

export function clueCount(spots: readonly Spot[]): number {
  return spots.filter((s) => s.clue).length;
}

export function canJudge(spots: readonly Spot[], check: PictureCheck): boolean {
  return check.searched && cluesFound(spots, check) === clueCount(spots);
}

export function judge(check: PictureCheck, verdict: Verdict): PictureCheck {
  return { ...check, verdict };
}

export function retry(check: PictureCheck): PictureCheck {
  return { ...check, verdict: null };
}
