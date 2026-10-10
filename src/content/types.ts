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

export type MissionTheme = 'pointclick' | 'arcade' | 'comic';

export type InteractionId = 'link-inspect' | 'typing' | 'facade';
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

export type MissionStructure = LinkInspectMission | TypingMission | FacadeMission;

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
}
