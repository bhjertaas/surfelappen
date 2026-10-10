# Surfelappen

A small, free, browser-based digital literacy game for Norway: short missions in a pixel-art town teach practical online safety and touch typing. Static site, no backend, no tracking. Norwegian (bokmål) first.

- What to build and why: `docs/PRD.md`. If it's unclear or contradicts itself, ask rather than guess. If a change alters behaviour described there, update the PRD in the same change.
- How it's built: `docs/architecture.md`. Decisions and their reasons: `docs/decisions/` (add a new ADR rather than rewriting an old one).
- Phase plan and where we are: `docs/implementation-plan.md`. Build one phase at a time. At the end of a phase, run all checks, summarise (including deviations), update docs, commit, and **wait for the go-ahead**.

## Commands

```bash
pnpm dev          # Vite dev server (no service worker in dev)
pnpm check        # biome check (warnings fail) + tsc for src and for tests/scripts; must be clean
pnpm test         # Vitest: unit + content tests (URLs via URL + tldts, .example, drills, locales)
pnpm test:e2e     # Playwright (Chromium + WebKit, phone + desktop) against the production build, incl. axe and offline
pnpm build        # production build to dist/, then the size budget (scripts/check-size.ts)
pnpm preview      # serve dist/ locally (service worker active)
pnpm format       # biome check --write (format + safe fixes)
node scripts/build-fonts.ts             # rebuild font subsets (only when fonts change)
node scripts/make-placeholder-icons.ts  # regenerate placeholder PWA icons
```

Deploy: push to `main`. GitHub Actions runs everything above and deploys to GitHub Pages (`https://surfelappen.minhule.eu`). There is no manual deploy.

Before calling a change done: `pnpm check` and `pnpm test`; also `pnpm test:e2e` if it touches UI, routes, progress or the service worker.

## Stack

Preact + TypeScript (strict) · Vite · pnpm on Node 24 · Biome · Vitest · Playwright + @axe-core/playwright · vite-plugin-pwa (generateSW, prompt) · hash routing · home-made i18n · GitHub Pages.

Runtime dependencies are `preact` and `workbox-window` only. **Ask before adding any runtime dependency.** Prefer the platform: native buttons and links, `<dialog>`, `<details>`, CSS.

Targets: Safari/iOS 15.4+ and 2022-era Chrome/Edge/Firefox/Samsung. Don't rely on `:has()`, container queries or `dvh` without a fallback.

## Conventions

- Code, comments, commit messages and docs are in **English**. Everything the player sees is **Norwegian**, and lives **only** in `src/i18n/locales/*.ts` and `src/content/missions/*/text.*.ts`. No hard-coded player-facing strings in components.
- Mission **structure** (IDs, URLs, answers, sticker rules) and **text** (per locale) are separate files. Never put logic in text files or text in structure files.
- All domains in content end in `.example`. Brands are fictional (Fjordbanken, Pakkeposten, Lenkevik kommune).
- Inline markup in text: `*em*` and `**strong**` only, rendered by `<Rich>`. Never `innerHTML`.
- Only `src/progress/` touches storage. Save no timestamps, no device info, nothing the player types.
- **No analytics, error-reporting services, external fonts or CDNs, or any request to another origin**, even "just for development". The CSP in `index.html` enforces `'self'`.
- Accessibility (practical WCAG 2.2 AA): every interactive thing is a native button or link with visible focus; never colour alone; no timers; respect `prefers-reduced-motion`; touch targets ≥ 44 px; works at 320 px and 200% zoom. On route change focus the `<h1>`; when feedback appears move focus to it; use live regions only where focus doesn't move.
- Interaction logic lives in pure, unit-tested modules (`flow.ts`, `matcher.ts`); views stay thin.
- Placeholder art is obviously placeholder (labelled shapes) and has the final logical size. Art is referenced only through `src/content/art.ts`.
- Commits: small and descriptive, in English; one per phase at minimum.
- Code, IDs and URL slugs are English (`#/mission/find-the-impostor/case-1`); see the ID table in `docs/architecture.md`.

## AI APIs (development only)

`.env` (git-ignored) holds `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` and Mistral (Scaleway) keys. They may be used **during development only**, by scripts in `scripts/` (e.g. drafting art or placeholder illustrations). Never reference them from `src/`, never prefix them `VITE_` (Vite would bundle them), never print them, and never commit generated output without reviewing it. The shipped game makes no AI calls. AI-generated art needs the licensing note from ADR 0011 before it's used as final art.
