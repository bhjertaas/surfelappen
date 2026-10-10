# 0010 — Safari 15.4+ and 2022-era evergreen browsers

**Status:** Accepted · 2026-10-10

## Context
The primary persona (often 50+) frequently uses older iPads. iPad Air 2 and iPad mini 4 stop at iPadOS 15. `<dialog>`, which the PRD prefers, needs Safari 15.4.

## Decision
- Supported: **Safari / iOS / iPadOS 15.4+**, **Chrome / Edge 100+**, **Firefox 100+**, **Samsung Internet 18+**.
- Vite `build.target: ['safari15', 'chrome100', 'firefox100', 'edge100']`. No polyfills.
- CSS: avoid relying on `:has()`, container queries and `dvh` units without fallbacks (Safari 15 lacks them). Use `@supports` for progressive enhancement.
- Unsupported browsers aren't blocked; they get whatever works.

## Alternatives
- Vite's default ("baseline widely available", ≈ Safari 16+): simpler CSS, but drops iPadOS 15 devices still common in senior households.
- iOS 12–14: reaches iPad mini 2/3 and Air 1, but needs polyfills (dialog), heavier transpilation and more testing.

## Consequences
- Slightly more conservative CSS. Manual device testing should include one iPadOS 15 device if one can be borrowed (library or senior-help programmes may have them).
