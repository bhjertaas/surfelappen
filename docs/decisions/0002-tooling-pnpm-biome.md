# 0002 — Vite, pnpm on Node, Biome

**Status:** Accepted · 2026-10-10

## Context
One maintainer, small codebase, a wish for minimal configuration. pnpm and Node 24 are already in use in other projects.

## Decision
- **Vite** for dev server and build, with `@preact/preset-vite`.
- **pnpm** on **Node** (LTS; `engines` and `.nvmrc` pin the major version). Lockfile committed; CI uses `pnpm install --frozen-lockfile`.
- **Biome** for linting and formatting (one `biome.json`), including its a11y rules.
- **TypeScript strict**, plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.

## Alternatives
- ESLint + Prettier + typescript-eslint + jsx-a11y: more mature, notably `jsx-a11y`, but several deps and configs.
- Bun or Deno as tooling runtime: interesting to learn, but not needed here; Node + pnpm is the known quantity.
- npm: works, but pnpm's strictness about undeclared dependencies helps keep the list honest.

## Consequences
- Biome lacks a few jsx-a11y rules. The axe e2e checks and the manual pass cover accessibility; lint is only the first line.
- Biome has no "no literal strings in JSX" rule, so a small content test guards against hard-coded player-facing text.
