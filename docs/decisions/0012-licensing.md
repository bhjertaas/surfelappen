# 0012 — Public repo; MIT code; CC BY-NC-SA 4.0 content and art

**Status:** Accepted · 2026-10-10

## Context
A free public-good project. Free GitHub Pages hosting needs a public repo. Libraries and courses should be able to reuse the material, but the maintainer doesn't want it resold.

## Decision
- The repository is **public**.
- **Code:** MIT (`LICENSE`).
- **Content** (mission text, scenarios, locale strings) **and art:** CC BY-NC-SA 4.0 (`LICENSE-content.md`, listing which paths it covers: `src/content/`, `src/i18n/locales/`, `src/assets/art/`).
- **Fonts:** keep their own OFL licences.
- Fictional brands (Fjordbanken, Pakkeposten, Lenkevik kommune) are part of the content.

## Alternatives
- CC BY-SA 4.0: allows commercial reuse with share-alike.
- AGPL for code: strong copyleft; overkill for a small static app.
- Private repo + GitHub Pro.

## Consequences
- "NonCommercial" can make course providers that charge fees unsure. The maintainer can grant explicit permission case by case; the About page can say "ta kontakt".
- Commissioned art must be licensed compatibly (CC BY-NC-SA, or full rights transfer).
- Nothing secret may enter the repo; there are no API keys in this project at all.
