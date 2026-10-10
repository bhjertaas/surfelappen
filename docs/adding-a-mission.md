# Adding a mission

This guide covers a new mission that reuses an existing interaction type (`link-inspect` or `typing`), e.g. *Ti fingre 2* or a second link mission. A new interaction type (dialogue, inbox, image inspection) is described at the end. Background: [`architecture.md`](architecture.md), [ADR 0004](decisions/0004-content-as-typescript.md).

Run `pnpm check && pnpm test` after every step: the type checker and the content tests tell you what's missing.

## 1. Choose IDs

IDs are English, lower-case slugs, and **never change once released**: they're stored in players' progress and appear in links.

- Mission: e.g. `ten-fingers-2`
- Steps: `case-1`…, or `step-1`…; `done` is reserved
- Stickers: e.g. `top-row`

## 2. Write the structure

Create `src/content/missions/<mission-id>/structure.ts`, using an existing mission as a template:

```ts
export const tenFingers2 = {
  id: 'ten-fingers-2',
  building: 'keyboard-hall',
  interaction: 'typing',
  requires: ['physical-keyboard'],
  stickers: ['top-row'],
  reviewedOn: null,          // set when the advice is checked (see content-review.md)
  sources: [],               // real https URLs the advice was checked against
  steps: [ /* … */ ],
} as const satisfies TypingMission;
```

Rules the content tests enforce:

- **Links:** every URL uses `https://` and a `.example` domain. `expectedHost` is the URL's hostname and `expectedSite` its real site according to the Public Suffix List. `verdict` matches `claimedSite`. Option A is the familiar site, B another site, C "can't tell"; exactly one is correct. Every `transfer` case has one `transfer-backup` with the same pattern and verdict. No URL is used twice.
- **Typing:** drills use only keys taught in this or an earlier step; no leading, trailing or double spaces; only the final step has `minAccuracy`.

## 3. Write the text

Create `text.nb.ts` next to the structure, typed from it, so a missing step or option is a compile error:

```ts
export const tenFingers2Nb: TypingText<typeof tenFingers2> = { title, character, intro, learn, summary, steps };
```

Follow the PRD's tone and register rules: adult, plain Norwegian, a named neighbour rather than a title, explanation instead of "Riktig!". Use only `*em*` and `**strong**`. In a link case, mention only that case's own domains (the content tests check this).

## 4. Register it

1. `src/content/missions/index.ts`: add it to `missions`.
2. `src/content/missions/texts.ts`: add the text to `missionTexts.nb`.
3. `src/content/stickers.ts`: add its stickers (`awardedBy: { mission }` or a named condition).
4. `src/i18n/locales/nb.ts`: add each sticker's `name` and `howTo` under `stickers`.
5. `src/content/art.ts`: add sticker art (a placeholder SVG is fine at first).
6. `src/content/town.ts`: add the mission ID to its building's `missions`, or open a closed building (`status: 'open'`). A building with several missions currently opens the first one; a mission list per building is a small UI addition when needed.

No screen or component changes are needed.

## 5. Test it

- `pnpm test`: content tests and the type checker cover the data.
- Add an e2e spec in `tests/e2e/` that plays it through (see `mission1.spec.ts` and `mission2.spec.ts` for helpers), including axe checks on each state.
- Play it yourself on a phone and with the keyboard only.

## 6. Translation

For another locale, add `text.<locale>.ts` typed the same way; the compiler lists every missing string. Audience variants (e.g. teenagers) are optional rewrites that fall back to the base text: see [ADR 0015](decisions/0015-audience-variants.md).

## A new interaction type

1. Add the type to `InteractionId` and its structure types to `src/content/types.ts`.
2. Add its run type to `src/progress/schema.ts` and teach `validate()` in `migrations.ts` about it. A new run type doesn't change existing data, so no version bump is needed.
3. Write the pure logic (`emptyRun`, sequence, current step, any sticker conditions) in `src/interactions/<type>/flow.ts` with unit tests, and hook it into `src/interactions/progress.ts` and `src/progress/awards.ts`.
4. Write `StepView` and `SummaryDetails` and register them in `src/interactions/registry.ts`.
5. Add content tests for the type's own rules.
