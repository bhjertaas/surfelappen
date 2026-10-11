# 0017: Lesson media is cached when a lesson opens, not up front

Date: 2026-10-11 · Status: accepted · Amends [0007](0007-pwa-vite-plugin-pwa.md) and [0009](0009-testing-and-ci.md)

## Context

The service worker precached every built file, so the first visit downloaded every lesson's art (about 3 MB, growing with each lesson), and narration or video would make it much worse. The owner asked for lazy loading.

## Decision

- **Precached (first visit):** code, CSS, fonts, icons and the art every visit needs: the town, the character and the stickers (`globPatterns` in `vite.config.ts`).
- **Lesson media** (scenes, portraits, pictures, sound) is cached at runtime, cache-first, in the `lesson-media` cache. When a lesson's intro or a step opens, `usePrefetchLesson` fetches all the media its structure names (`artUsedBy`), so the whole lesson works offline from then on. Online play comes first: the prefetch waits for an idle moment, fetches one file at a time at low priority, stops when the lesson closes, and is skipped on data-saver or 2G connections.
- `scripts/check-size.ts` budgets the first visit (read from the precache list in `dist/sw.js`) and each lesson separately.

## Consequences

- A lesson never opened has no pictures offline (its text still works).
- Media must be referenced from the mission structure (through `content/art.ts`) for the prefetch and the budget to see it.
