# 0009 — Vitest + Playwright (Chromium, WebKit) + axe + size budget

**Status:** Accepted · 2026-10-10

## Context
The PRD asks for content tests in CI (URL parsing with tldts, `.example`, typing drills, locale completeness), automated axe checks on every screen, offline behaviour, and a ~1 MB first-load budget.

## Decision
- **Vitest:** unit tests for pure modules (router parsing, i18n, markup, progress store and migrations, link-inspect flow, typing matcher, address split) and content tests.
- **Playwright** e2e on **Chromium and WebKit**, at a phone viewport (360×740, touch) and a desktop viewport, against the production build (`vite preview`). Covers: both missions end to end, resume after reload, reset, deep links, back button, coming-soon and needs-keyboard states, storage unavailable, update bar, offline after service-worker install.
- **@axe-core/playwright** on every screen and key states (WCAG 2.2 AA tags). Violations fail the run.
- **Size budget** (`scripts/check-size.ts`, no dependency): JS ≤ 60 KB gz, CSS ≤ 15 KB gz, fonts ≤ 100 KB, total precache ≤ 1 MB; prints a per-category table.
- **CI (GitHub Actions)** on every push and PR: Biome → tsc → Vitest → build → size budget → Playwright. Deploy job on `main` only, needing all of these.
- **Manual, per phase:** Lighthouse mobile (target LCP < 2.5 s on Slow 4G). **Before release:** keyboard-only run, VoiceOver (iOS + macOS), TalkBack, NVDA, 320 px, 200% zoom, reduced motion.

## Alternatives
- Adding Firefox to e2e: small extra coverage for ~50% longer CI.
- Component tests with Testing Library + jsdom: overlap with e2e; logic is kept in pure modules instead.
- size-limit / Lighthouse CI: more deps and CI time for what a short script does.

## Consequences
- WebKit approximates iOS Safari; real-device checks remain manual in phase 6.
- Playwright browsers are cached in CI to keep runs short.
