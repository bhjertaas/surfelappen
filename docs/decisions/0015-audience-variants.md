# 0015 — Audience variants: built in now, written later

**Status:** Accepted · 2026-10-10

## Context
The first copy read as childish. The fix for the MVP is an adult register (PRD tone rules, v0.4). Longer term, the game should speak differently to children, teenagers and adults, and suggest missions in a different order (bullying before BankID for teenagers), without hiding anything. Asking for an age conflicts with "no personal question before play", but letting players say which group they belong to does not, as long as it's optional.

## Decision
- `Audience = 'child' | 'teen' | 'adult'`; the default is `adult`, and all base text is written for adults.
- The player's choice is stored with progress (`progress.audience`, optional; an unknown value is dropped). No age, no account.
- **Wording:** `missionTextVariants[locale][audience][missionId]` and `messageVariants[locale][audience]` hold complete text objects, usually written as a spread of the base text plus changes. Lookup falls back to the base text. `useMissionText()` and `useI18n()` resolve it; components don't know about audiences.
- **Order:** `buildingOrder[audience]` lists building IDs to put first; the rest keep their default order. Nothing is ever hidden.
- **Not built yet:** the UI for choosing ("Hvem spiller?"), and any variant text. Both wait until the adult version has been tested with people.

## Alternatives
- Variants in the MVP: doubles or triples text to write, review and test before anything is validated.
- Deep-merge partial overrides: less to write per variant, but more magic; a spread in TypeScript is explicit and type-checked.
- Asking for an age: more personal than needed and against FR-01.

## Consequences
- Adding a teen variant later is content work plus the choice UI; no screen or interaction changes.
- Children will likely need their own missions, not reworded adult ones; that's a product decision for later.
