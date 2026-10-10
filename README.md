# Surfelappen

A small, free, browser-based game that teaches practical online safety and touch typing through short missions in a pixel-art town. Made for Norway, in Norwegian. No accounts, no tracking: progress stays on the player's device.

**Play:** <https://surfelappen.minhule.eu> (work in progress)

- What it is and why: [`docs/PRD.md`](docs/PRD.md)
- How it's built: [`docs/architecture.md`](docs/architecture.md) and [`docs/decisions/`](docs/decisions/)
- Build plan: [`docs/implementation-plan.md`](docs/implementation-plan.md)
- Adding a mission: [`docs/adding-a-mission.md`](docs/adding-a-mission.md); yearly advice review: [`docs/content-review.md`](docs/content-review.md)

## Run it

Requires Node 24 (see `.nvmrc`) and pnpm (version pinned in `package.json`; `corepack enable` will fetch it).

```bash
pnpm install
pnpm dev            # http://localhost:5173
```

## Test

```bash
pnpm check          # Biome (lint + format check) and TypeScript
pnpm test           # unit tests and content tests (Vitest)
pnpm test:e2e       # browser tests (Playwright: Chromium + WebKit, phone + desktop, axe)
```

First time only: `pnpm exec playwright install --with-deps chromium webkit`
(on Linux, `--with-deps` installs system libraries and asks for sudo).

The content tests check every link in the missions against the real URL parser and the Public Suffix List (`tldts`), so a typo in a URL or answer fails the build.

## Build and deploy

```bash
pnpm build          # production build to dist/, then the size budget check
pnpm preview        # serve dist/ at http://localhost:4173
```

Deployment is automatic: every push to `main` runs CI (`.github/workflows/ci.yml`). When all checks pass, it deploys `dist/` to GitHub Pages at `surfelappen.minhule.eu`.

## Licence

Code: [MIT](LICENSE). Content and art: [CC BY-NC-SA 4.0](LICENSE-content.md).
