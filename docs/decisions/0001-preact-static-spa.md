# 0001 — Preact + TypeScript static SPA, no server, no SSR

**Status:** Accepted · 2026-10-10

## Context
The PRD requires a static site with no backend and no tracking, a small dependency list, semantic HTML and an installable PWA. Nothing is per-user on a server: progress lives on the device, and content is the same for everyone.

## Decision
A client-side single-page app built with **Preact + TypeScript (strict)**, compiled by Vite into static files. There is no server runtime and no SSR. Local state uses hooks plus a tiny subscribe-based progress store. No state library.

## Alternatives
- **Svelte 5:** small output, but more API churn recently; the maintainer already knows JSX.
- **Lit / web components:** standards-based, but more boilerplate for screen composition and focus management.
- **Vanilla TS:** zero deps, but we'd hand-roll rendering and diffing.
- **Next.js / SvelteKit / SSR:** solve problems we don't have (server data, SEO for dynamic pages) and bring a server or adapter.

## Consequences
- One UI runtime dependency (`preact`, ~4 KB gz). React-ecosystem knowledge transfers.
- No SEO for inner screens. Fine: links are shared to the start page or to a mission, and the content is the app itself.
- Pre-rendering the Start screen to static HTML stays possible later (it would help first paint), but isn't in the MVP.
