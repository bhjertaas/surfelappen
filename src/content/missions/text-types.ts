import type { LinkInspectMission, OptionId } from '../types.ts';

/**
 * Per-locale text for a mission (ADR 0004). Step texts are typed from the
 * mission's structure, so every step and option needs its text: tsc catches gaps.
 * Inline markup: *em* and **strong** only.
 */

export type OptionTexts = Readonly<Record<OptionId, string>>;

/** A link case: the message, three answers, feedback per answer, two hints. */
export interface CaseText {
  /** One sentence setting the scene, e.g. "Arne har fått en SMS." */
  readonly situation: string;
  /** Who the message claims to be from, as the player sees it. */
  readonly sender: string;
  /** The message without the link; the link (`linkText`) is shown after it. */
  readonly message: string;
  readonly options: OptionTexts;
  readonly feedback: OptionTexts;
  readonly hint1: string;
  readonly hint2: string;
  /** Optional longer explanation behind "Les mer". */
  readonly lesMer?: string;
}

/** A question with three answers and feedback per answer (the habit scene). */
export interface ChoiceText {
  readonly prompt: string;
  readonly options: OptionTexts;
  readonly feedback: OptionTexts;
}

/** A single text screen. */
export interface InfoText {
  readonly heading: string;
  readonly body: readonly string[];
}

export type StepText = CaseText | ChoiceText | InfoText;

/** Text shared by every mission. */
export interface MissionText {
  readonly title: string;
  /** The townsperson who brings the problem, e.g. "Postmester Solveig". */
  readonly character: string;
  readonly intro: readonly string[];
  /** "Du lærer å …" */
  readonly learn: string;
  readonly summary: {
    readonly takeaway: string;
  };
  /** Step texts by step ID; filled for every step of the mission. */
  readonly steps?: Readonly<Record<string, StepText>>;
}

type TextForStep<S> = S extends { kind: 'case' }
  ? CaseText
  : S extends { kind: 'choice' }
    ? ChoiceText
    : InfoText;

/** Text for a link-inspect mission: one entry per step, of the matching kind. */
export interface LinkInspectText<M extends LinkInspectMission> extends MissionText {
  readonly steps: { readonly [S in M['steps'][number] as S['id']]: TextForStep<S> };
}
