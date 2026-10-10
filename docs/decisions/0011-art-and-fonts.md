# 0011 — Pixel-art base sizes and formats; Pixelify Sans + Atkinson Hyperlegible Next

**Status:** Accepted · 2026-10-10

## Context
Art is built last (phase 7), and its source is still undecided (self-made, commissioned, or generated and cleaned up). Phase 7 must be an asset swap with no code changes beyond asset paths. Fonts must be self-hosted, cover æ ø å and « », and keep body text readable for the persona at 200% zoom.

## Decision
**Art**
- Town picture: **320×180 logical px** (16:9). Characters, stickers and building signs on a **16 px grid** (stickers 32×32, portraits 48×48).
- Final format: **PNG, indexed palette**, optimised losslessly before commit. Placeholders: **SVG** with simple shapes and a visible label, at exactly the final logical size.
- Rendering: `image-rendering: pixelated`. Integer scale where the layout allows it, fractional otherwise (accepting slight pixel unevenness on narrow phones).
- `src/content/art.ts` maps art IDs to imported URLs and intrinsic sizes; phase 7 only changes this file and the files it points to.
- Town hotspots are rectangles in the 320×180 coordinate space, stored in `content/town.ts`, so they survive the swap.
- Pixel art is decoration (`alt=""` or a short label); all information is in text.

**Fonts**
- **Pixelify Sans** (OFL): title, headings and building signs only.
- **Atkinson Hyperlegible Next** (OFL): all body text, **including addresses in messages and the lupen**. A proportional font, like a real phone, so the *rn*/*m* lookalike works as in real life.
- Self-hosted woff2, subset to Latin + Latin-1 + typographic punctuation, `font-display: swap`; OFL licence files committed alongside. Glyph coverage (æ ø å Æ Ø Å « » – ’) is verified when the fonts are added (phase 2).

## Alternatives
- Pixel font everywhere: most "game" feel, poor readability.
- System font stack for body: zero bytes, but less control over legibility and platform-dependent glyphs.
- Monospace for addresses: clearer, but gives away case 6.

## Consequences
- ~80–100 KB of fonts within the budget.
- AI image APIs (keys in the git-ignored `.env`) may be used during development by scripts in `scripts/`, e.g. for placeholder or draft art. They are never called from the game.
- If AI-generated art is chosen as *final* art, its licensing and "original art" status are recorded in a new ADR before phase 7 (output may not be copyrightable, which affects the CC licence statement).
