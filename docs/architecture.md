# Surfelappen — architecture

What to build and why: [`PRD.md`](PRD.md). This document covers how it's built. Each significant choice has a short ADR in [`decisions/`](decisions/). The phase plan is in [`implementation-plan.md`](implementation-plan.md).

## Stack at a glance

| Concern | Choice | ADR |
| --- | --- | --- |
| UI | Preact + TypeScript (strict), JSX, hooks. No SSR, no server | [0001](decisions/0001-preact-static-spa.md) |
| Build / tooling | Vite, pnpm on Node 24, Biome (lint + format) | [0002](decisions/0002-tooling-pnpm-biome.md) |
| Routing | Hand-written hash router (`#/town`, `#/mission/…`), English slugs | [0003](decisions/0003-hash-routing.md) |
| Content | TypeScript modules: structure + one text file per locale; tsc + Vitest content tests act as the schema | [0004](decisions/0004-content-as-typescript.md) |
| i18n | Home-made: typed message objects, `format()`, `Intl.PluralRules`/`Intl.NumberFormat`, `*em*`/`**strong**` only | [0005](decisions/0005-home-made-i18n.md) |
| Progress | One module, one `localStorage` key, versioned with migrations, behind a `StorageBackend` interface | [0006](decisions/0006-progress-store.md) |
| PWA | `vite-plugin-pwa`, `generateSW`, `registerType: 'prompt'`, `workbox-window` | [0007](decisions/0007-pwa-vite-plugin-pwa.md) |
| Hosting / CI | GitHub Pages at `surfelappen.minhule.eu`, GitHub Actions | [0008](decisions/0008-hosting-github-pages.md) |
| Testing | Vitest (unit + content), Playwright (Chromium + WebKit) + axe, scripted size budget | [0009](decisions/0009-testing-and-ci.md) |
| Browsers | Safari/iOS 15.4+, Chrome/Edge/Firefox/Samsung from 2022 | [0010](decisions/0010-browser-support.md) |
| Art / fonts | 320×180 logical town, 16 px grid, PNG; Pixelify Sans (headings) + Atkinson Hyperlegible Next (body) | [0011](decisions/0011-art-and-fonts.md) |
| Licence | Public repo, code MIT, content/art CC BY-NC-SA 4.0 | [0012](decisions/0012-licensing.md) |
| Mission 1 flow | Lupen reveals, feedback marks; transfer retry → backup | [0013](decisions/0013-link-inspect-flow.md) |
| Typing input | Native input as key capture; key vs code matching; layout fallback | [0014](decisions/0014-typing-input.md) |

**Runtime dependencies:** `preact` and `workbox-window`. Nothing else ships to the browser without asking first.
**Dev dependencies (planned):** `vite`, `typescript`, `@preact/preset-vite`, `vite-plugin-pwa`, `@biomejs/biome`, `vitest`, `tldts`, `@playwright/test`, `@axe-core/playwright`.

`tldts` is used in tests only. At runtime the lupen and feedback use the `expectedHost`/`expectedSite` already in content; the tests guarantee those match the real parser.

## Folder structure

```
surfelappen/
├─ index.html                 # lang="nb", CSP meta, root element
├─ public/
│  └─ icons/                  # PWA icons (192, 512, maskable)
├─ src/
│  ├─ main.tsx                # bootstrap: progress store, locale, PWA registration, render <App>
│  ├─ app/
│  │  ├─ App.tsx              # layout, error boundary, route → screen, global bars
│  │  ├─ router.ts            # parse/format hash routes, useRoute(), navigate()/replace()
│  │  ├─ routes.ts            # typed route table (the only place URLs are spelled)
│  │  └─ focus.ts             # focus <h1> + document.title on route change
│  ├─ screens/                # Start, Town, MissionIntro, MissionStep, MissionSummary,
│  │                          # Passport, About, ErrorScreen
│  ├─ components/             # Rich (markup), Hints, LesMer (<details>), FeedbackPanel,
│  │                          # StickerCelebration (<dialog>), UpdateBar, StorageNote, PixelImage
│  ├─ interactions/
│  │  ├─ types.ts             # InteractionModule interface
│  │  ├─ registry.ts          # 'link-inspect' | 'typing' → module
│  │  ├─ link-inspect/        # pure flow logic (flow.ts), address split (address.ts), views
│  │  └─ typing/              # pure matcher (matcher.ts), nb key map (keymap-nb.ts), views
│  ├─ content/
│  │  ├─ types.ts             # MissionStructure, LinkCase, ChoiceStep, InfoStep, TypingStep,
│  │  │                       # Sticker, Building, MissionText…
│  │  ├─ town.ts              # 5 buildings: id, status, missions[], hotspot rect, art id
│  │  ├─ stickers.ts          # sticker registry (id, art, awardedBy)
│  │  ├─ art.ts               # art id → imported URL + intrinsic size (the only file that changes in phase 7)
│  │  └─ missions/
│  │     ├─ index.ts          # mission registry (id → structure + text loaders)
│  │     ├─ find-the-impostor/ # structure.ts, text.nb.ts
│  │     └─ ten-fingers/       # structure.ts, text.nb.ts
│  ├─ i18n/
│  │  ├─ i18n.ts              # active locale, useMessages(), format(), plural(), percent()
│  │  ├─ markup.ts            # parse *em* / **strong** → segments (no HTML, ever)
│  │  └─ locales/nb.ts        # UI strings; its type is the contract for other locales
│  ├─ progress/
│  │  ├─ schema.ts            # ProgressV1 type + empty value
│  │  ├─ migrations.ts        # v→v+1 chain
│  │  ├─ backends.ts          # StorageBackend: localStorage, memory
│  │  ├─ store.ts             # load/get/update/subscribe/reset, 'storage' event sync
│  │  └─ selectors.ts         # resumeTarget(), hasStarted(), stickersEarned()…
│  ├─ pwa/register.ts         # workbox-window → updateAvailable flag → UpdateBar
│  ├─ styles/                 # tokens.css, base.css, layout.css (mobile-first)
│  └─ assets/
│     ├─ fonts/               # subsetted woff2 + OFL licence files
│     └─ art/                 # placeholder SVGs now, PNGs in phase 7
├─ tests/
│  ├─ content/                # Vitest: URLs (URL + tldts), .example, drills, locales, option rules
│  └─ e2e/                    # Playwright: flows, axe per screen, offline, resume
├─ scripts/check-size.ts      # size budget over dist/
└─ docs/
```

Unit tests for pure modules sit next to them (`flow.test.ts`, `matcher.test.ts`, `store.test.ts`, …).

## Main modules

### Router (`app/router.ts`, `app/routes.ts`)

A ~50-line hash router with no dependency. `routes.ts` is the only place URLs are spelled. Everything else calls `href(route)` and `navigate(route)` / `replace(route)`.

| Route | Screen |
| --- | --- |
| `#/` | Start |
| `#/town` | Town |
| `#/mission/:missionId` | Mission intro |
| `#/mission/:missionId/:stepId` | Mission step (feedback is state here, not a route) |
| `#/mission/:missionId/done` | Mission summary |
| `#/passport` | Passport |
| `#/about` | About / privacy |
| anything else | ErrorScreen ("not found" variant) |

Slugs and IDs are English, like all code, and **not** localised. They are stable IDs that also appear in progress data and shared links, so renaming one later needs a progress migration. `done` is reserved and can't be a step ID (content test). The player sees Norwegian titles, never the IDs, apart from in the address bar.

**Stable IDs:**

| Kind | IDs |
| --- | --- |
| Missions | `find-the-impostor` (*Finn bedrageren*), `ten-fingers` (*Ti fingre*) |
| Buildings | `post-office` (*Postkontoret*), `keyboard-hall` (*Tastaturhallen*), `square` (*Torget*), `library` (*Biblioteket*), `licence-office` (*Lappekontoret*) |
| Mission 1 steps | `case-1` … `case-6`, `habit`, `habit-tip`, `transfer-intro`, `transfer-1`, `transfer-2`, `transfer-1-backup`, `transfer-2-backup` |
| Mission 2 steps | `step-1` … `step-5` |
| Stickers | `link-detective` (*Lenkedetektiv*), `ten-fingers` (*Ti fingre*), `sharp-eye` (*Skarpt øye*), `steady-hand` (*Stø hånd*), `curious` (*Nysgjerrig*) | Inside a mission, moving to the next step uses `replace()`, so the back button leaves the mission. A step URL beyond the player's progress is rewritten (`replace`) to their current step. On every route change, `focus.ts` sets `document.title`, scrolls to the top and focuses the screen's `<h1 tabindex="-1">`.

### i18n (`i18n/`)

- `locales/nb.ts` exports a plain object of strings. Its widened type, `Messages`, is the contract: `en.ts` must be typed `Messages`, so a missing key is a compile error.
- Components read `const m = useMessages()` and use `m.town.title`. Interpolation uses `format(m.typing.stepDone, { accuracy: percent(0.93) })`. Plurals go through `plural(n, { one, other })`, built on `Intl.PluralRules`, and percentages through `Intl.NumberFormat` (nb renders `93 %` with a non-breaking space).
- `<Rich text={…}/>` renders `*em*` and `**strong**` as elements and everything else as text. There is no `innerHTML` anywhere. A content test checks that markers are balanced.
- `nb` is bundled statically. Other locales are loaded with `import()` (precached by the service worker anyway). `<html lang>` follows the active locale.
- Player-facing strings live only in `locales/*` and `content/missions/*/text.*.ts`. A small test in `tests/content/` scans `src/**/*.tsx` for bare text between JSX tags as a guard. Biome has no equivalent rule.

### Content (`content/`)

Each mission is **structure** (`structure.ts`, `satisfies MissionStructure`: IDs, URLs, verdicts, correct options, sticker rules, `reviewedOn`, `sources`) plus **text** (`text.<locale>.ts`, typed `MissionText<typeof structure>`). The text type is derived from the structure: every step ID needs its text entry and every option ID its label and feedback, so tsc catches gaps.

The case's sender is text (it can be translated, e.g. *Lenkevik kommune*), so it lives in the text file, not the structure. Text types (`MissionText`) arrive with the first text file in phase 3.

`link-inspect` steps have three kinds: `case`, `choice` (habit scene) and `info` (tip, transfer intro). `typing` steps have `drills: string[]`.

The schema is enforced in two layers, and both run in `pnpm check` and CI, so invalid content fails the build:

1. **Shape**, by tsc.
2. **Semantics**, by Vitest content tests (`tests/content/`):
   - every URL parses with `URL`
   - `hostname === expectedHost` and `tldts.getDomain(url) === expectedSite` (note: `.example` is not on the Public Suffix List, so tldts applies the default `*` rule; this is what we want)
   - every domain anywhere in structure or text ends in `.example`
   - every `*.example` mentioned in a case's text is one of that case's url/host/site/claimedSite
   - exactly three options, exactly one correct, IDs unique per mission and globally for stickers
   - every transfer case has a backup with the same pattern
   - typing drills use only keys taught in that or earlier steps
   - every locale has every key; inline markup is balanced
   - every building points at an existing mission or is `coming-soon`

Test failures name the mission, step and field.

### Progress store (`progress/`)

The only module that reads or writes saved progress. Mission and screen code calls `progress.update(draft => …)` and selectors; it never touches `localStorage`.

```ts
// progress/schema.ts (v1, sketch)
interface ProgressV1 {
  v: 1;
  lastMission?: MissionId;          // for "Fortsett"
  visitedBuildings: BuildingId[];   // Nysgjerrig
  stickers: StickerId[];            // never removed except by reset
  missions: Record<MissionId, {
    completedOnce: boolean;
    run: LinkInspectRun | TypingRun; // current playthrough, owned by the interaction
  }>;
}
interface LinkInspectRun {
  solved: StepId[];                 // finished case/choice/info steps
  firstTry: StepId[];               // main cases right first time
  missedTransfer: StepId[];         // transfer cases that need their backup
}
interface TypingRun { done: StepId[]; positional: boolean; bestFinalAccuracy?: number }
```

- **Storage:** one key, `surfelappen:progress`, holding JSON. No timestamps, no device info.
- **Writes:** after every finished step and every sticker. Writes are synchronous and tiny.
- **Versioning:** `migrations.ts` is a chain of `(vN) => vN+1`. Unknown or removed content IDs are ignored, never fatal. Corrupt JSON, or data from a newer `v`, starts a fresh in-memory state and **leaves the raw value untouched** (an older tab must not destroy newer data).
- **Backends:** `StorageBackend { read(): string | null; write(s): void; clear(): void }`, with `localStorageBackend` and `memoryBackend`. At startup the store probes `localStorage`. If that fails, it uses memory and sets `storageAvailable = false`, which shows the dismissible StorageNote.
- **Sync boundary:** a future account sync or export/import code only needs a new backend or a `exportProgress()/importProgress()` pair working on the same versioned JSON. Mission code doesn't change.
- **Cross-tab:** a `storage` event reloads the in-memory state and notifies subscribers.
- **Reset:** `progress.reset()` clears the backend and state, after a `<dialog>` confirmation in the passport.
- **Preact binding:** `useProgress(selector)` subscribes and re-renders on change. There is no state library.

### Interaction modules (`interactions/`)

The mission shell (intro, step, summary screens) is generic. Everything interaction-specific is behind one interface:

```ts
interface InteractionModule<S extends MissionStructure, R> {
  id: InteractionId;
  emptyRun(): R;
  /** Ordered steps for this run, including any backups that became necessary. */
  stepSequence(structure: S, run: R): StepId[];
  currentStep(structure: S, run: R): StepId | 'done';
  StepView: ComponentType<StepViewProps<S, R>>;   // renders one step, reports via onRunChange
  SummaryDetails: ComponentType<{ structure: S; run: R }>; // first-try score / accuracy
  /** Named sticker conditions this interaction can evaluate. */
  conditions: Record<string, (structure: S, run: R) => boolean>;
}
```

The logic is pure functions with exhaustive unit tests: `link-inspect/flow.ts` (sequence, backups, first-try, completion) and `typing/matcher.ts` (keystroke → `correct | wrong | layout-suspect | ignored`, accuracy). The views stay thin.

**link-inspect:** a `CaseView` holds a message card (sender, body, link text) and a "Bruk lupen" button that reveals `url` with `overflow-wrap: anywhere`. Below it come three fixed-order option buttons, the hints and `LesMer`. On answer, the `FeedbackPanel` takes focus and shows the per-option feedback. On a correct answer it also shows the address breakdown from `address.ts`: scheme, subdomain, **real site** (bold + underline + label), and path, split using `expectedHost`/`expectedSite`. A wrong answer offers "Prøv igjen"; a correct one offers "Neste". See [ADR 0013](decisions/0013-link-inspect-flow.md).

**typing:** a native `<input>` (`inputmode="none"`, autocorrect, autocapitalize and spellcheck off, labelled) captures `keydown` and keeps itself empty. A large "next character" display plus a polite live region announces the next key, and an on-screen Norwegian keyboard (`keymap-nb.ts`: `code` → label, hand, finger) highlights the key and finger. See [ADR 0014](decisions/0014-typing-input.md).

### Stickers

`content/stickers.ts` lists every sticker with `awardedBy`: `{ mission: id }` (completion), `{ condition: 'transfer-first-try' | 'final-line-flawless' }` (evaluated by the mission's interaction) or `{ town: 'visited-all-buildings' }` (evaluated from `visitedBuildings`). After each progress write, `awardStickers()` adds newly earned IDs. The UI then queues a `StickerCelebration` dialog. It is skippable and reduced-motion aware, and is announced through its dialog label.

### PWA (`pwa/`, `vite.config.ts`)

`vite-plugin-pwa` generates the manifest and a Workbox service worker that precaches every built asset (JS, CSS, fonts, art, `index.html`) with revision hashes. There is no runtime caching and there are no external origins. `registerType: 'prompt'`: a new worker installs in the background and **waits**. `workbox-window` reports `needRefresh` and the `UpdateBar` shows "Ny versjon – last inn på nytt". Tapping it calls `updateSW(true)` (skipWaiting + reload). Progress is saved per step, so reloading loses at most the current case. With all tabs closed, the waiting worker activates on the next visit by itself. The manifest's player-facing fields (`name`, `short_name`, `description`, `lang`) are read from `locales/nb.ts` at build time.

### Errors and states

- `ErrorBoundary` in `App` renders `ErrorScreen` with "Tilbake til byen". Nothing is logged remotely.
- Unknown routes and unknown mission or step IDs render the not-found variant.
- A `<meta http-equiv="Content-Security-Policy">` restricts everything to `'self'`. GitHub Pages can't set headers, and this enforces the "no external requests" promise in the browser itself.
- `__APP_VERSION__`, the package version plus short git SHA, is injected at build and shown on About.

### Town screen

`content/town.ts` defines the five buildings in display order. Each has an `id`, a list of `missions` (empty unless open; *Tastaturhallen* will hold several lessons), a `status` (`open | coming-soon | passport`) and a hotspot `rect` in the 320×180 logical coordinate space. The picture is a `PixelImage`. Hotspots are absolutely positioned controls sized in percentages: `<a>` for open destinations, `<button>` for "kommer snart" (which shows a friendly line in a status region). The text list below renders the same array, so it can't drift. On narrow screens the list comes first (CSS `order`). The "Trenger tastatur" label comes from the mission's `requires: ['physical-keyboard']` combined with `matchMedia('(any-pointer: fine)')` being false. A Bluetooth keyboard can't be detected, so "Start likevel" is always offered.

## How a mission flows through the code

1. **Town.** Selecting *Postkontoret* (`post-office`) records the visit (`visitedBuildings`), then `navigate({ name: 'mission-intro', missionId: 'find-the-impostor' })`.
2. **Intro screen.** This looks up the registry, renders intro text, and offers "Begynn" (or "Fortsett" if a run exists, plus "Start på nytt", which resets `run` but not stickers). It sets `lastMission`.
3. **Step screen.** Resolves the step: `module.currentStep(structure, run)`. If the URL's step is ahead of it, it `replace()`s to the current one. It renders `module.StepView`.
4. **Answer.** The StepView computes the result with pure functions, shows feedback (focus moves), and on success calls `onRunChange(newRun)`. The shell writes it through the progress store, runs `awardStickers()`, and `replace()`s to the next step. "Neste" handles that transition, so feedback stays readable until the player moves on.
5. **Done.** When `currentStep` returns `'done'`, the shell sets `completedOnce`, awards stickers, and `replace()`s to `done`. The summary shows the takeaway, `SummaryDetails` and the stickers earned.
6. **Leaving.** Any time: "Til byen" or the back button. The run is already saved up to the last finished step.

## Adding things

**A new mission with an existing interaction** (e.g. *Ti fingre 2*): add `content/missions/<id>/structure.ts` and `text.nb.ts`, register it in `missions/index.ts`, add its stickers to `stickers.ts`, and point a building at it in `town.ts` (or reuse a building with a mission list, once a building has more than one). Run `pnpm check`: the content tests validate it. No existing mission or component changes. `docs/adding-a-mission.md` (phase 5) walks through it.

**A new interaction type** (e.g. `dialogue`): add `interactions/dialogue/` implementing `InteractionModule`, extend the `InteractionId` and structure unions in `content/types.ts`, add its run type to the progress schema (with a migration if existing data is affected, usually not), register it in `interactions/registry.ts`, and add content tests for its semantics. Existing modules are untouched.

**A new locale** (e.g. `en`): add `i18n/locales/en.ts` typed `Messages` and `text.en.ts` per mission, then add the locale to the supported list. The language switch appears automatically once more than one locale exists (FR-08).
