import type { FacadeMission, LinkInspectMission, OptionId, TypingMission } from '../types.ts';

/**
 * Per-locale text for a mission (ADR 0004). Step texts are typed from the
 * mission's structure, so every step and option needs its text: tsc catches gaps.
 * Inline markup: *em* and **strong** only.
 */

export type OptionTexts = Readonly<Record<OptionId, string>>;

/** A link case: the message, three answers, feedback per answer, two hints. */
export interface CaseText {
  /** One sentence setting the scene, e.g. "Bjørn har fått en SMS." */
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

/** A typing step: what to do, shown above the drill. */
export interface TypingStepText {
  readonly instruction: string;
}

/** "Lag glansbildet": Mira's lines, names for the mess, captions and what happens after posting. */
export interface ComposeText {
  /** Mira sets the task. */
  readonly brief: string;
  /** Whose account the post goes out on, e.g. "@livmedlina". */
  readonly account: string;
  /** The subject's name, for "… er ikke helt med i bildet". */
  readonly subjectName: string;
  /** Names of the mess, by mess ID, e.g. "oppvasken". */
  readonly mess: Readonly<Record<string, string>>;
  readonly cropDone: string;
  readonly polishIntro: string;
  readonly captionIntro: string;
  /** Caption texts, by caption ID. */
  readonly captions: Readonly<Record<string, string>>;
  /** Comments under the post, by caption ID. */
  readonly comments: Readonly<Record<string, readonly string[]>>;
  /** Who Sara is in the comments, e.g. "@sara.k". */
  readonly saraAccount: string;
  /** Sara's comment, by caption ID. */
  readonly saraComment: Readonly<Record<string, string>>;
  /** Mira's reaction after posting, by caption ID. `{likes}` is the like count. */
  readonly reaction: Readonly<Record<string, string>>;
  /** Shown with the whole picture behind the post. */
  readonly reveal: string;
}

export type StepText = CaseText | ChoiceText | InfoText | TypingStepText | ComposeText;

/** Text shared by every mission. */
export interface MissionText {
  readonly title: string;
  /** The townsperson who brings the problem, e.g. "Hanne på postkontoret". */
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

/** Text for a facade mission: one entry per step. */
export interface FacadeText<M extends FacadeMission> extends MissionText {
  readonly steps: { readonly [S in M['steps'][number] as S['id']]: ComposeText };
}

/** Text for a typing mission: an instruction per step. */
export interface TypingText<M extends TypingMission> extends MissionText {
  readonly steps: { readonly [S in M['steps'][number] as S['id']]: TypingStepText };
}
