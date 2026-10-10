# 0007 — vite-plugin-pwa, generateSW, prompt-to-update

**Status:** Accepted · 2026-10-10

## Context
FR-09: installable, fully offline after the first visit, a new deployment picked up with a "Ny versjon – last inn på nytt" bar, never mixing old and new assets, never reloading mid-mission by itself.

## Decision
- `vite-plugin-pwa` in `generateSW` mode with `registerType: 'prompt'` and `injectRegister: null` (registration in our own module, so there's no inline script and CSP stays strict).
- Precache every built asset (`js, css, html, woff2, png, svg, webmanifest`). No runtime caching rules; no external origins.
- `workbox-window` (runtime dependency, ~3 KB gz; approved) signals `needRefresh` → `UpdateBar`; tapping it activates the waiting worker and reloads.
- Manifest generated at build; player-facing fields come from `locales/nb.ts`.

## Alternatives
- **Hand-written service worker:** zero deps and full control, but cache versioning, cleanup and atomic updates are easy to get subtly wrong.
- **injectManifest:** the plugin builds the precache list, we write the worker; a middle ground if we ever need custom fetch handling.

## Consequences
- Workbox handles revisioning and cleanup; a deploy is atomic from the player's point of view.
- If all tabs are closed, the new version activates silently on the next visit, which matches "picked up on the next visit".
- Offline behaviour is verified by a Playwright test (go offline after install, play both missions).
