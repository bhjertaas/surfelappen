import type { Audience, BuildingId, MissionId, StepId, StickerId } from '../content/types.ts';

/**
 * Saved progress, version 1 (ADR 0006). Only IDs, booleans and a best accuracy:
 * no timestamps, no device info, nothing the player typed.
 */

export const CURRENT_VERSION = 1;

/** A playthrough of a link-inspect mission. Only finished steps are recorded. */
export interface LinkInspectRun {
  readonly interaction: 'link-inspect';
  /** Finished case, choice and info steps, in the order they were finished. */
  readonly solved: readonly StepId[];
  /** Cases answered correctly with no hint and no earlier wrong answer. */
  readonly firstTry: readonly StepId[];
  /** Transfer cases answered wrongly at least once, so their backup is due. */
  readonly missedTransfer: readonly StepId[];
}

/** A playthrough of a typing mission. */
export interface TypingRun {
  readonly interaction: 'typing';
  readonly done: readonly StepId[];
  /** The player accepted the layout hint: match keys by physical position. */
  readonly positional: boolean;
  /** Best accuracy on the final step in this playthrough, whole percent. */
  readonly finalAccuracy?: number;
  /** Wrong keystrokes on the final step's best attempt. */
  readonly finalErrors?: number;
}

export type Run = LinkInspectRun | TypingRun;

export interface MissionProgress {
  readonly completedOnce: boolean;
  readonly run: Run;
}

export interface ProgressV1 {
  readonly v: 1;
  /** Chosen by the player; absent means the default audience. */
  readonly audience?: Audience;
  readonly lastMission?: MissionId;
  readonly visitedBuildings: readonly BuildingId[];
  readonly stickers: readonly StickerId[];
  readonly missions: Readonly<Record<MissionId, MissionProgress>>;
}

export type Progress = ProgressV1;

export function emptyProgress(): Progress {
  return { v: 1, visitedBuildings: [], stickers: [], missions: {} };
}
