# 0005 — Home-made i18n with Intl and minimal inline markup

**Status:** Accepted · 2026-10-10

## Context
~150 UI strings plus mission text, one locale at launch (`nb`) and `en` later. Needs: interpolation (`[accuracy]`, `[key]`, `[finger]`), a few plurals (sticker counts), percentages in Norwegian format (`90 %`), and emphasis inside feedback (`*pakkeposten.example*`, `**r**`).

## Decision
- `i18n/locales/nb.ts` is a plain object; its type is the contract for other locales (missing keys = compile error).
- `useMessages()` returns the active locale's object; components use property access (`m.town.title`).
- `format(template, params)` for `{param}` interpolation; `plural()` via `Intl.PluralRules`; `percent()` via `Intl.NumberFormat`.
- Inline markup is limited to `*em*` and `**strong**`, parsed into elements by `<Rich>`. No HTML in strings, no `innerHTML`.
- `nb` is bundled statically; other locales are loaded with `import()`. `<html lang>` follows the locale.

## Alternatives
- **Paraglide** (used in lanGo): compile-time and tree-shaken, but a build step and concepts for few strings.
- **i18next:** runtime size and features we don't need.
- **Plain text only, emphasis as structured segments:** safest, but verbose content.

## Consequences
- ~60 lines of our own code with unit tests. No ICU message syntax. If complex grammar is ever needed per locale, we'd use functions in the locale file (which TS allows) rather than a library.
