# 0004 — Content as TypeScript modules; tsc + content tests as schema

**Status:** Accepted · 2026-10-10

## Context
The PRD requires mission content as typed data with stable IDs, split into language-neutral **structure** and per-locale **text**, validated at build time with clear errors (FR-11). It leaves the format to us. Content is maintained by one developer; translation to English is likely done by the same person.

## Decision
- `content/missions/<id>/structure.ts` exports an object `satisfies MissionStructure`.
- `content/missions/<id>/text.<locale>.ts` exports an object typed `MissionText<typeof structure>`: the text type is derived from the structure, so every step and option ID must have its text.
- **Shape** is validated by tsc. **Semantics** are validated by Vitest content tests (`tests/content/`): URL parsing with `URL` + `tldts`, `.example` only, domains mentioned in text match the case, option rules, transfer backups, typing drills only use taught keys, locale completeness, balanced markup. Both run in `pnpm check` and CI.
- Domains in option labels and feedback are written out in text (readable for writers). A content test asserts that every `*.example` in a case's text is one of that case's URL, host, site or `claimedSite`.

## Alternatives
- **JSON + schema library (zod/valibot):** translator-friendly and language-neutral, but needs a schema library, type inference and a prebuild step.
- **YAML text + TS structure:** nicest for long prose, but adds a parser and a codegen/validation step.

## Consequences
- No schema or parser dependencies; IDE autocompletion and refactoring work across content and code.
- Translators edit TS object literals. Acceptable for now. If a non-developer translator joins, a JSON/YAML export/import script can be added without changing the runtime.
- tsc error messages for deep content types can be verbose. Content tests use explicit messages naming mission, step and field.
