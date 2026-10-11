import type {
  FacadeMission,
  FeedCategory,
  LinkInspectMission,
  OptionId,
  RumourMission,
  TypingMission,
  WebMission,
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

// web (Kafé Krøllalfa)

export interface ClassifyText {
  readonly brief: string;
  readonly cards: Readonly<
    Record<string, { readonly name: string; readonly right: string; readonly wrong: string }>
  >;
  readonly done: string;
}

export interface BrowserText {
  /** `{target}` is the host to reach. */
  readonly brief: string;
  readonly engines: Readonly<Record<string, string>>;
  readonly adTitle: string;
  readonly adSnippet: string;
  readonly targetTitle: string;
  readonly targetSnippet: string;
  /** The target's name as its toy page shows it, e.g. "NRK". */
  readonly targetName: string;
  /** The toy target page. */
  readonly targetPage: string;
  /** Reached by searching; `{clicks}` steps. Asks for the shortcut. */
  readonly afterSearch: string;
  /** Reached through the address bar. */
  readonly afterAddress: string;
  /** Typed a word without a dot in the address bar: it became a search. */
  readonly becameSearch: string;
  /** Searched for something that doesn't find the target. */
  readonly noResults: string;
  /** An address other than the target; `{host}`. */
  readonly elsewhere: string;
  /** Clicked the paid result. */
  readonly clickedAd: string;
  /** Shown with a tree-counting engine. */
  readonly trees: string;
  readonly done: string;
}

export interface AddressText {
  readonly brief: string;
  readonly addresses: Readonly<
    Record<
      string,
      {
        readonly intro: string;
        readonly question: string;
        readonly parts: Readonly<Record<string, string>>;
        readonly right: string;
        readonly wrong: string;
      }
    >
  >;
  readonly done: string;
}

export interface JourneyText {
  readonly brief: string;
  readonly nodes: Readonly<Record<string, string>>;
  /** The name is looked up; `{ip}`. */
  readonly lookedUp: string;
  readonly arrived: string;
  readonly cutIntro: string;
  readonly rerouted: string;
  readonly done: string;
}

export interface TimelineText {
  readonly brief: string;
  readonly events: Readonly<Record<string, { readonly title: string; readonly body: string }>>;
  readonly done: string;
}

export type StepText =
  | CaseText
  | ChoiceText
  | InfoText
  | TypingStepText
  | ComposeText
  | SortText
  | FeedText
  | ClassifyText
  | BrowserText
  | AddressText
  | JourneyText
  | TimelineText
  | ChatText
  | TraceText
  | InspectText;

// ---------------------------------------------------------------------------
// rumour (Ryktebørsen)

/** One chat message. `from` is a name, or empty for the player's own messages. */
export interface ChatMessage {
  readonly from: string;
  readonly body: string;
}

/** A chat thread to react to: what each choice leads to, and what the guide says about it. */
export interface ChatText {
  readonly heading: string;
  readonly brief: string;
  /** Where the thread is, e.g. "Familiechatten". */
  readonly thread: string;
  readonly messages: readonly ChatMessage[];
  readonly prompt: string;
  readonly options: Readonly<
    Record<
      string,
      {
        readonly label: string;
        /** What the player sends to the thread, if anything. */
        readonly says?: string;
        /** What happens in the thread afterwards. */
        readonly outcome: readonly ChatMessage[];
        /** One line per round of `spread`, if the option has it. */
        readonly spread?: readonly string[];
        readonly explain: string;
      }
    >
  >;
  readonly done: string;
}

/** Following a rumour back to its source. */
export interface TraceText {
  readonly heading: string;
  readonly brief: string;
  readonly hops: Readonly<
    Record<
      string,
      {
        /** Who shared it, e.g. "Tante Randi". */
        readonly who: string;
        /** Where, e.g. "i familiechatten". */
        readonly where: string;
        readonly body: string;
        /** The guide points out what changed on the way. */
        readonly note?: string;
      }
    >
  >;
  readonly question: string;
  readonly options: Readonly<Record<string, { readonly label: string; readonly feedback: string }>>;
  readonly done: string;
}

/** Checking pictures. */
export interface InspectText {
  readonly heading: string;
  readonly brief: string;
  readonly pictures: Readonly<
    Record<
      string,
      {
        readonly intro: string;
        /** What the reverse image search shows. */
        readonly found: string;
        readonly spots: Readonly<Record<string, { readonly label: string; readonly text: string }>>;
        readonly right: string;
        readonly wrong: string;
      }
    >
  >;
  readonly done: string;
}

type RumourTextForStep<S> = S extends { kind: 'chat' }
  ? ChatText
  : S extends { kind: 'trace' }
    ? TraceText
    : InspectText;

export interface RumourText<M extends RumourMission> extends MissionText {
  readonly steps: {
    readonly [S in M['steps'][number] as S['id']]: RumourTextForStep<S>;
  };
}

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

type WebTextForStep<S> = S extends { kind: 'classify' }
  ? ClassifyText
  : S extends { kind: 'browser' }
    ? BrowserText
    : S extends { kind: 'address' }
      ? AddressText
      : S extends { kind: 'journey' }
        ? JourneyText
        : TimelineText;

export interface WebText<M extends WebMission> extends MissionText {
  readonly steps: {
    readonly [S in M['steps'][number] as S['id']]: WebTextForStep<S>;
  };
}

/** Text for a typing mission: an instruction per step. */
export interface TypingText<M extends TypingMission> extends MissionText {
  readonly steps: { readonly [S in M['steps'][number] as S['id']]: TypingStepText };
}
