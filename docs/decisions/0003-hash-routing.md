# 0003 — Hash routing; steps replace history; feedback isn't a route

**Status:** Accepted · 2026-10-10

## Context
Every screen needs its own URL; refresh, deep links and the back button must work on static hosting (FR-02). The host is GitHub Pages ([0008](0008-hosting-github-pages.md)), which has no SPA fallback. The PRD also lists "Feedback" as a screen, but a back button that lands on stale feedback, or re-enters an answered case, would confuse the primary persona.

## Decision
- **Hash routing** with a ~50-line hand-written router: `#/`, `#/town`, `#/mission/:missionId`, `#/mission/:missionId/:stepId`, `#/mission/:missionId/done`, `#/passport`, `#/about`.
- Slugs and IDs are English (code is English) and not localised: they're stable IDs that also appear in progress data and shared links. Renaming one later needs a progress migration.
- **Feedback is state on the step route**, not a route.
- Advancing between steps uses `history.replaceState`: back from any step leaves the mission (intro → town).
- Only the current step can be shown: any other step URL is replaced by the current step (a finished mission's step URLs lead to its summary).
- On navigation: set `document.title`, scroll to top, focus the screen's `<h1>`.

## Alternatives
- **History routing:** clean URLs, but GitHub Pages needs the `404.html` redirect hack (first response is HTTP 404), and the service worker needs a navigation fallback. It would tie us to hosts with SPA fallback.
- **pushState per step with a read-only "answered" review mode:** lets a helper go back to a solved case, but every interaction type would need a review mode.
- **Norwegian slugs** (`#/byen`, `#/oppdrag/…`): friendlier in the address bar, but mixes Norwegian into code and IDs.
- **A routing library:** unnecessary for seven routes.

## Consequences
- URLs contain `#`. Acceptable; printed links will point at the root anyway.
- The app works from any static host and offline with no host configuration.
- Moving to history routing later touches only `router.ts` and the host config.
