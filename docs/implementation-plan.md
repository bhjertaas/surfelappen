# Surfelappen — implementation plan

Based on the PRD's *Build order*. Each phase ends with something that runs and can be clicked through. At the end of each phase:

- run `pnpm check`, `pnpm test`, `pnpm test:e2e` and `pnpm build`
- summarise what was done and anything that deviated from this plan
- update `PRD.md` and `architecture.md` if behaviour changed
- commit, and wait for the go-ahead

## Before phase 1: things only you can do

| What | Why |
| --- | --- |
| ✅ Repo made public (via `gh`) | Free GitHub Pages ([ADR 0008](decisions/0008-hosting-github-pages.md), [0012](decisions/0012-licensing.md)) |
| ✅ Pages source set to *GitHub Actions* (via `gh api`) | Deploy workflow |
| ✅ DNS at domene.shop: `CNAME surfelappen → bhjertaas.github.io.` | Custom subdomain |
| ✅ Custom domain `surfelappen.minhule.eu` set in Pages settings (via `gh api`) | |
| ⏳ *Enforce HTTPS*, once GitHub has issued the certificate (me, in phase 1) | HTTPS on the subdomain |

Phase 1 can be built and tested locally without these; only its deploy step needs them.

## Phase 1: Skeleton ✅

**Delivers**
- pnpm + Vite + Preact + TypeScript (strict), Biome, Vitest, Playwright, with the scripts from `CLAUDE.md`.
- `content/types.ts` with the full content model, and `find-the-impostor/structure.ts` with all of Appendix A's link cases (6 main, 2 transfer, 2 backups) plus the habit/info steps. No text yet, except what the types need (a stub `text.nb.ts` is allowed).
- Content tests: `URL` + `tldts` host/site assertions, `.example` only, option rules, transfer backups with matching patterns.
- A "hello" page (title + one line from `locales/nb.ts`), with the CSP meta and `lang="nb"`.
- GitHub Actions: lint → typecheck → unit/content → build → size budget → e2e (one smoke test) → deploy to Pages on `main`.
- `README.md` (what, run, test, build, deploy), `LICENSE`, `LICENSE-content.md`, `.nvmrc`.

**Verified by**
- CI green; content tests fail when a URL or `expectedSite` is deliberately broken (shown once, then reverted).
- `https://surfelappen.minhule.eu` shows the hello page over HTTPS.

## Phase 2: Shell ✅

**Delivers**
- Hash router with all routes; focus/title handling; not-found → ErrorScreen.
- i18n module (`format`, `plural`, `percent`, `<Rich>`), `nb` UI strings for the shell.
- Progress store v1 (schema, backends, migrations scaffold, `storage` sync, selectors), with unit tests.
- PWA: manifest, icons (placeholder), service worker via `vite-plugin-pwa`, `UpdateBar` wired up (polish in phase 5).
- Start screen (with "Fortsett" logic), Town screen with placeholder town art (320×180 SVG), 5 hotspots plus the text list, coming-soon line, needs-keyboard label, visit tracking. Mission intro screens for both missions, with stub step screens.
- Fonts added, subset and glyph coverage checked; base CSS tokens, mobile-first layout.

**Verified by**
- e2e: every route reachable by link and by deep link + refresh; back button behaviour; town list and hotspots are the same destinations in the same order; axe clean on Start, Town, Intro.
- Lighthouse installability passes; app loads offline after the first visit (e2e).
- Manual: 320 px and 200% zoom on Start and Town.

## Phase 3: Mission 1, *Finn bedrageren*

**Delivers**
- `link-inspect` module: `flow.ts` (sequence, backups, first-try, completion, `transfer-first-try`), `address.ts` (breakdown), CaseView, lupen, FeedbackPanel (focus), hints (2 levels), Les mer, ChoiceView (habit), InfoView.
- Full `text.nb.ts` from Appendix A, with draft feedback for the transfer cases and backups (the PRD only says "same pattern"; flagged for your review).
- Summary screen with takeaway, first-try score (main cases), and stickers *Lenkedetektiv* and *Skarpt øye* awarded (passport display is basic until phase 5).
- Resume at the first unfinished step; "Start på nytt" on the intro.

**Verified by**
- Unit: `flow.ts` exhaustive (all miss/retry/backup paths), `address.ts` for all 10 URLs.
- Content tests: text domains match their case; markup balanced; every step and option has text.
- e2e (phone + desktop, Chromium + WebKit): perfect run; run with misses, hints and both backups; quit mid-mission → reload → resumes; back button leaves the mission; keyboard-only run; axe on case, feedback, habit, info and summary states.

## Phase 4: Mission 2, *Ti fingre*

**Delivers**
- `typing` module: `matcher.ts` (key/code matching, ignored events, layout-suspect counting, positional mode, Caps Lock, accuracy), `keymap-nb.ts`, capture input, next-character display with a live region, on-screen keyboard with finger hints, wrong-key message, layout hint, Caps Lock note.
- Five steps from Appendix B; step-done accuracy; final line ≥ 90%; *Ti fingre* and *Stø hånd* (zero mistakes).
- Touch-only "Trenger tastatur" notice with "Start likevel".

**Verified by**
- Unit: matcher, including the US-layout path (`;` on `Semicolon` for `ø`), IME/dead keys and Caps Lock.
- Content test: every drill uses only taught keys.
- e2e: Playwright `keyboard.press` with Norwegian `key`/`code` pairs for a full run; a below-90% final line forces a retry; a simulated US layout triggers the hint and positional mode; touch-only notice on the phone profile.
- Manual: one real run with a physical Norwegian keyboard (you).

## Phase 5: Passport and polish

**Delivers**
- Passport: all stickers, earned and empty, with "how to earn"; *Nysgjerrig*; reset with a `<dialog>` confirmation.
- Sticker celebration (`<dialog>`, skippable, reduced-motion aware, announced).
- About/privacy page: what's stored and where, how to delete it, the hosting note, sources and `reviewedOn` per mission, credits, licence, version.
- UpdateBar polish and its e2e (deploy a second build, see the bar, reload, no mixed assets); StorageNote; ErrorScreen polish.
- `docs/adding-a-mission.md`, `docs/content-review.md`.

**Verified by**
- e2e: stickers survive reload and disappear on reset; replay never removes stickers; update-bar flow; storage blocked → note shown, game playable; axe on passport, about, error, dialogs.

## Phase 6: Accessibility and device pass

**Delivers**
- Fixes from a full axe sweep (all screens and states) and manual passes: keyboard only; VoiceOver on iOS and macOS; TalkBack; NVDA on Windows; 320 px; 200% text zoom; reduced motion; an iPadOS 15 device if available.
- A checklist with results in `docs/accessibility-pass.md`.

**Verified by**
- The checklist, with no blocking issues. Phases 1–5 tests still green. Lighthouse mobile scores recorded.
- Some of this needs you (screen readers on real devices). I'll prepare the script and checklist; you run the device parts, or we do them together.

## Phase 7: Art swap

**Delivers**
- Final art (source decided before this phase, with an ADR if AI-assisted) in the fixed sizes; `content/art.ts` updated; hotspot rects adjusted if buildings moved.

**Verified by**
- No code changes beyond `art.ts` and asset files (diff review). Size budget still green. Visual check at 320 px, tablet and desktop. axe still clean.

## After the MVP (not planned here)

The user tests from the PRD (5–10 people), then the "Later" list. *Done when* in the PRD is the release checklist.
