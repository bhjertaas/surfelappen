/**
 * The content model (PRD "Content model", architecture "Content").
 *
 * Structure files (`missions/<id>/structure.ts`) hold everything language-neutral:
 * IDs, URLs, verdicts, correct answers, sticker rules. Text files
 * (`missions/<id>/text.<locale>.ts`) hold everything the player reads.
 *
 * tsc checks the shape; the content tests in `tests/content/` check the semantics.
 * Structure files are written `as const satisfies …` so step IDs stay literal types.
 */

/** `YYYY-MM-DD`. */
export type IsoDate = `${number}-${number}-${number}`;

/**
 * Who is playing, as the player describes themselves (never an age). Changes
 * wording and the suggested order of missions, never what is available.
 * Content is written for `adult`; other audiences fall back to it.
 */
export type Audience = 'child' | 'teen' | 'adult';
export const AUDIENCES: readonly Audience[] = ['child', 'teen', 'adult'];
export const DEFAULT_AUDIENCE: Audience = 'adult';

export type MissionId = string;
export type StepId = string;
export type StickerId = string;
export type BuildingId = string;
export type ArtId = string;

/** A source the advice was checked against (shown on the About page). Real URLs, not `.example`. */
export interface Source {
  readonly title: string;
  readonly url: string;
}

/** A real article or report for "Vil du vite mer?" (the mission's further reading). Real URL. */
export interface Reading {
  readonly id: string;
  readonly url: string;
}

export type MissionTheme = 'pointclick' | 'arcade' | 'comic' | 'retroweb' | 'noir';

export type InteractionId = 'link-inspect' | 'typing' | 'facade' | 'web' | 'rumour';
export type Requirement = 'physical-keyboard';

interface MissionBase<I extends InteractionId, S> {
  readonly id: MissionId;
  readonly building: BuildingId;
  readonly interaction: I;
  readonly requires: readonly Requirement[];
  /** Portrait of the townsperson who brings the mission (art ID). */
  readonly guide: ArtId;
  /** Look of the mission's screens (colours, fonts); each place has its own (docs/concept.md). */
  readonly theme: MissionTheme;
  /** The place's scene, shown on the mission intro (art ID). */
  readonly scene: ArtId;
  readonly steps: readonly S[];
  /** Stickers this mission can award; their rules live in the sticker registry. */
  readonly stickers: readonly StickerId[];
  /** When the advice was last checked against `sources`; `null` until the first review. */
  readonly reviewedOn: IsoDate | null;
  readonly sources: readonly Source[];
  /** Real-world examples to read after the mission; text per locale under `further`. */
  readonly further?: readonly Reading[];
}

// ---------------------------------------------------------------------------
// link-inspect

export type OptionId = 'a' | 'b' | 'c';

export interface Option {
  readonly id: OptionId;
  readonly correct: boolean;
}

/** Always exactly three options, in a fixed order (FR-04). */
export type ThreeOptions = readonly [Option, Option, Option];

export type LinkContext = 'sms' | 'email' | 'social' | 'qr' | 'browser';

export type LinkPattern =
  | 'subdomain-trick'
  | 'genuine-subdomain'
  | 'brand-in-other-domain'
  | 'brand-in-path'
  | 'link-text-mismatch'
  | 'lookalike-letters';

export type CaseRole = 'main' | 'transfer' | 'transfer-backup';

/** "Which site would you really reach?" */
export interface LinkCase {
  readonly kind: 'case';
  readonly id: StepId;
  readonly role: CaseRole;
  /** On a `transfer-backup`: the transfer case it stands in for. */
  readonly backupFor?: StepId;
  readonly context: LinkContext;
  /** What the message shows as the link; may differ from `url`. */
  readonly linkText: string;
  /** Where the link really goes. */
  readonly url: string;
  /** `new URL(url).hostname`; checked by the content tests. */
  readonly expectedHost: string;
  /** The registrable domain ("the real site"); checked against tldts. */
  readonly expectedSite: string;
  /** The site the message pretends to come from. */
  readonly claimedSite?: string;
  readonly verdict: 'genuine' | 'impostor';
  readonly pattern: LinkPattern;
  readonly options: ThreeOptions;
}

/** A question with three options and per-option feedback, e.g. the habit scene. */
export interface ChoiceStep {
  readonly kind: 'choice';
  readonly id: StepId;
  readonly options: ThreeOptions;
}

/** A single text screen, e.g. the habit tip or the transfer intro. */
export interface InfoStep {
  readonly kind: 'info';
  readonly id: StepId;
}

export type LinkInspectStep = LinkCase | ChoiceStep | InfoStep;

/**
 * Completion: every step solved, and every missed transfer case followed by its backup.
 * The rule lives in the interaction module, not in data.
 */
export type LinkInspectMission = MissionBase<'link-inspect', LinkInspectStep>;

// ---------------------------------------------------------------------------
// typing

/** A single character as `KeyboardEvent.key` reports it on a Norwegian layout, lower case. Space is `' '`. */
export type KeyChar = string;

export interface TypingStep {
  readonly id: StepId;
  /** Keys introduced in this step. */
  readonly keysTaught: readonly KeyChar[];
  /** Keys the drills may use: a subset of everything taught so far. */
  readonly keysAllowed: readonly KeyChar[];
  /** One or more target lines, typed in order. */
  readonly drills: readonly string[];
  /** Only on the final step: whole percent needed to complete the mission. */
  readonly minAccuracy?: number;
}

/** Completion: every step done, and the final step at or above its `minAccuracy`. */
export type TypingMission = MissionBase<'typing', TypingStep>;

// ---------------------------------------------------------------------------
// facade (Fasaden: hands-on activities about the polished front online)

/** A rectangle in an image's pixel space. */
export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

/**
 * "Lag glansbildet": crop a messy picture down to the one nice spot, polish it,
 * pick a caption and post it.
 */
export interface ComposeStep {
  readonly kind: 'compose';
  readonly id: StepId;
  /** The wide "reality" picture (art ID); `width`×`height` is its pixel space. */
  readonly image: ArtId;
  readonly width: number;
  readonly height: number;
  /** What the post is of: must stay inside the frame. */
  readonly subject: Rect;
  /** Things that spoil the picture; each has a name in the text file. */
  readonly mess: readonly { readonly id: string; readonly rect: Rect }[];
  /** Square frame sizes the player can switch between, largest first. */
  readonly frameSizes: readonly number[];
  /** Captions to choose from; `likes` is how many likes the post gets with it. */
  readonly captions: readonly { readonly id: string; readonly likes: number }[];
}

/** One post in "Reklamejakt". */
export interface SortPost {
  readonly id: string;
  readonly image: ArtId;
  readonly verdict: 'ad' | 'not-ad';
  /** How the post is marked as advertising, if at all (shown above the picture). */
  readonly label?: 'reklame' | 'annonse';
  /** Carries the «Retusjert person» mark (a body or skin has been edited). */
  readonly retouchMark?: boolean;
  /** `transfer` posts come last and are new kinds of cases: the Reklamejeger sticker. */
  readonly role: 'main' | 'transfer';
}

/** "Reklamejakt": sort a feed into advertising or not, looking closer for clues. */
export interface SortStep {
  readonly kind: 'sort';
  readonly id: StepId;
  readonly posts: readonly SortPost[];
}

export type FeedCategory = 'glossy' | 'friends' | 'hobby' | 'funny';

export interface FeedPost {
  readonly id: string;
  readonly category: FeedCategory;
  readonly image: ArtId;
}

/**
 * "Tren feeden": pick what you stop at for a few rounds and see the feed follow,
 * then adjust Sara's feed (fewer glossy posts, follow varied accounts).
 */
export interface FeedStep {
  readonly kind: 'feed';
  readonly id: StepId;
  /** Every post the feeds draw from; each category needs at least one. */
  readonly posts: readonly FeedPost[];
  readonly rounds: number;
  /** Posts in a finished feed. */
  readonly feedSize: number;
  /** Sara's feed before she changes anything: weight per category. */
  readonly sara: Readonly<Record<FeedCategory, number>>;
  /** Accounts Sara can follow, one category each. */
  readonly suggestions: readonly { readonly id: string; readonly category: FeedCategory }[];
  /** Done when Sara's feed has at most this many glossy posts. */
  readonly goal: number;
}

export type FacadeStep = ComposeStep | SortStep | FeedStep;

/** Completion: every step done, in order. */
export type FacadeMission = MissionBase<'facade', FacadeStep>;

// ---------------------------------------------------------------------------
// web (Kafé Krøllalfa): how the net works

/** What a name is: the program you browse with, a site that finds sites, or a site. */
export type WebBin = 'browser' | 'search' | 'site';

/** "Hvem er hvem?": sort names one at a time into browser / search engine / website. */
export interface ClassifyStep {
  readonly kind: 'classify';
  readonly id: StepId;
  readonly cards: readonly { readonly id: string; readonly bin: WebBin }[];
}

/** "Snarveien": reach `target` in a toy browser, by search and by the address bar. */
export interface BrowserStep {
  readonly kind: 'browser';
  readonly id: StepId;
  /** Host the player is asked to reach, e.g. `nrk.no`. */
  readonly target: string;
  /** A search for any of these words finds the target. */
  readonly keywords: readonly string[];
  /** The paid result above the real one. */
  readonly adHost: string;
  /** Search engines to choose between; `trees` shows a tree counter (Ecosia). */
  readonly engines: readonly {
    readonly id: string;
    readonly host: string;
    readonly trees?: boolean;
  }[];
}

/** One address split into parts the player can tap; `answer` is the part asked for. */
export interface Address {
  readonly id: string;
  readonly parts: readonly { readonly id: string; readonly text: string }[];
  readonly answer: string;
}

/** "Les adressen": what each part of a web and an email address means. */
export interface AddressStep {
  readonly kind: 'address';
  readonly id: StepId;
  readonly addresses: readonly Address[];
}

/** A small network, drawn top to bottom: nodes in a 280×360 picture and cables between them. */
export interface JourneyStep {
  readonly kind: 'journey';
  readonly id: StepId;
  /** `side` is where the node's label goes (default right). */
  readonly nodes: readonly {
    readonly id: string;
    readonly x: number;
    readonly y: number;
    readonly side?: 'left' | 'right';
  }[];
  readonly cables: readonly (readonly [string, string])[];
  readonly from: string;
  readonly to: string;
  /** The cable the digger breaks, so the packets find another way. */
  readonly cut: readonly [string, string];
  /** The address the name looks up to (a documentation address, RFC 5737). */
  readonly ip: string;
}

/** "Tidsreisen": a few moments of the net's history, to page through. Not quizzed. */
export interface TimelineStep {
  readonly kind: 'timeline';
  readonly id: StepId;
  readonly events: readonly {
    readonly id: string;
    readonly year: number;
    /** Picture for the card (art ID). */
    readonly image: ArtId;
    /** Narration of the card's text (audio ID, content/audio.ts). */
    readonly voice: string;
  }[];
}

export type WebStep = ClassifyStep | BrowserStep | AddressStep | JourneyStep | TimelineStep;

export type WebMission = MissionBase<'web', WebStep>;

// ---------------------------------------------------------------------------
// rumour (Ryktebørsen)

/** An answer in a chat or a trace. `spread`: how many have seen the rumour, round by round, if you pick it. */
export interface RumourOption {
  readonly id: string;
  readonly correct: boolean;
  readonly spread?: readonly number[];
}

/** A chat thread with a message to react to: pick what to do, see what happens. */
export interface ChatStep {
  readonly kind: 'chat';
  readonly id: StepId;
  /** A picture attached to the last message. */
  readonly image?: ArtId;
  readonly options: readonly RumourOption[];
}

/** Follow a rumour back, share by share, to where it started. Hops are newest first. */
export interface TraceStep {
  readonly kind: 'trace';
  readonly id: StepId;
  readonly hops: readonly { readonly id: string; readonly image?: ArtId }[];
  /** "How did it start?", asked at the source. */
  readonly options: readonly RumourOption[];
}

export type Verdict = 'old' | 'ai' | 'real';

/** A part of a picture to tap, in percent of its width and height. */
export interface Spot {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /** A real clue; the others are there so tapping everything doesn't find them for you. */
  readonly clue: boolean;
}

/** Check pictures: search for older copies, look for clues, then say what they are. */
export interface InspectStep {
  readonly kind: 'inspect';
  readonly id: StepId;
  readonly pictures: readonly {
    readonly id: string;
    readonly image: ArtId;
    /** Whether a reverse image search finds older copies. */
    readonly found: boolean;
    readonly spots: readonly Spot[];
    readonly answer: Verdict;
  }[];
}

export type RumourStep = ChatStep | TraceStep | InspectStep;

export type RumourMission = MissionBase<'rumour', RumourStep>;

export type MissionStructure =
  | LinkInspectMission
  | TypingMission
  | FacadeMission
  | WebMission
  | RumourMission;

// ---------------------------------------------------------------------------
// stickers and town

export type StickerCondition = 'transfer-first-try' | 'final-line-flawless' | 'ads-first-try';

export type AwardedBy =
  | { readonly mission: MissionId }
  | { readonly mission: MissionId; readonly condition: StickerCondition }
  | { readonly town: 'visited-all-buildings' };

export interface Sticker {
  readonly id: StickerId;
  readonly image: ArtId;
  readonly awardedBy: AwardedBy;
}

/** A point in the town picture's pixel space (TOWN_SIZE). */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/** A rectangle in the town picture's pixel space (TOWN_SIZE). */
export interface Hotspot {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface Building {
  readonly id: BuildingId;
  readonly status: 'open' | 'coming-soon' | 'passport';
  /** Missions housed here, in order; empty unless `status` is `open`. */
  readonly missions: readonly MissionId[];
  readonly hotspot: Hotspot;
  /** Where the player's character walks to before going in. */
  readonly door: Point;
  readonly image: ArtId;
  /** Opens once this mission is done (or once the player has started one here). */
  readonly after?: MissionId;
}
