# 0006 — Versioned localStorage progress store behind a backend interface

**Status:** Accepted · 2026-10-10

## Context
Progress must survive reloads, be resumable at the first unfinished step, never be sent anywhere, degrade gracefully when storage is unavailable, and later be exportable or syncable to an account without touching mission code (PRD: Progress, FR-06).

## Decision
- One module (`src/progress/`) owns all reads and writes. One `localStorage` key, `surfelappen:progress`, holding JSON `{ v: 1, … }`.
- Contents: last played mission, visited buildings, earned sticker IDs, and per mission `completedOnce` plus the current run (owned by the interaction type). **No timestamps, no device info.**
- Writes after every finished step and every sticker award.
- Migrations: a chain of pure `vN → vN+1` functions, unit-tested with fixtures. Unknown or removed IDs are ignored. Corrupt data, or data from a newer version, starts a fresh in-memory state **without overwriting the stored value**.
- `StorageBackend` interface (`localStorage`, `memory`). If the startup probe fails, use memory and show the storage note.
- Other tabs are kept in sync via the `storage` event.
- Preact binding: `useProgress(selector)`.

## Alternatives
- **IndexedDB:** async and more capable, but unnecessary for a few hundred bytes.
- **Storing `earnedAt` dates:** a nicer passport, but personal data with no learning value.
- **Signals library for reactivity:** an extra dependency for one store.

## Consequences
- Export/import codes and account sync are a new backend or an `export/import` pair on the same JSON.
- A stale older tab can't destroy newer data, but it also won't save while it sees a newer version. Acceptable: the update bar will appear in that tab.
