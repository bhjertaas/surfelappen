import type {
  FacadeMission,
  FeedCategory,
  LinkInspectMission,
  OptionId,
  TypingMission,
} from '../types.ts';

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

/** One post in "Reklamejakt". */
export interface SortPostText {
  readonly account: string;
  /** Shown above the picture when the post is labelled, e.g. "Reklame · Betalt samarbeid med Fjordglød". */
  readonly label?: string;
  readonly caption: string;
  /** What "Se nærmere" reveals. */
  readonly clues: readonly string[];
  /** One or two sentences after a right answer. */
  readonly right: string;
  /** After a wrong answer: a nudge, without giving the answer away. */
  readonly wrong: string;
}

/** "Reklamejakt": Mira's lines and the posts. */
export interface SortText {
  readonly brief: string;
  /** Mira, before the last posts (the transfer cases). */
  readonly transferIntro: string;
  readonly posts: Readonly<Record<string, SortPostText>>;
  /** Mira, when the feed is sorted. */
  readonly done: string;
}

/** "Tren feeden": Mira's lines, category names, posts and accounts to follow. */
export interface FeedText {
  readonly brief: string;
  /** `{round}` of `{rounds}`. */
  readonly roundPrompt: string;
  /** Category names as used in a sentence, e.g. "glansbilder". */
  readonly categories: Readonly<Record<FeedCategory, string>>;
  readonly posts: Readonly<Record<string, { readonly account: string; readonly caption: string }>>;
  /** After training; `{category}` is the one the player stopped at most. */
  readonly trained: string;
  /** Mira explains what just happened. */
  readonly explain: string;
  /** Why apps do it: the business model, said plainly. */
  readonly why: string;
  readonly saraIntro: string;
  readonly suggestions: Readonly<
    Record<string, { readonly account: string; readonly about: string }>
  >;
  readonly done: string;
}

export type StepText =
  | CaseText
  | ChoiceText
  | InfoText
  | TypingStepText
  | ComposeText
  | SortText
  | FeedText;

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
  /** "Vil du vite mer?": one entry per `further` reading in the structure. */
  readonly further?: {
    readonly intro: string;
    readonly items: Readonly<
      Record<string, { readonly title: string; readonly body: string; readonly link: string }>
    >;
  };
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
type FacadeTextForStep<S> = S extends { kind: 'sort' }
  ? SortText
  : S extends { kind: 'feed' }
    ? FeedText
    : ComposeText;

export interface FacadeText<M extends FacadeMission> extends MissionText {
  readonly steps: {
    readonly [S in M['steps'][number] as S['id']]: FacadeTextForStep<S>;
  };
}

/** Text for a typing mission: an instruction per step. */
export interface TypingText<M extends TypingMission> extends MissionText {
  readonly steps: { readonly [S in M['steps'][number] as S['id']]: TypingStepText };
}
