# 0016 — Pixel art drafted with an image model, reduced to real pixels, reviewed by the owner

**Status:** Accepted · 2026-10-10 · Amends the art sizes in [0011](0011-art-and-fonts.md) · *Updated:* the art is now illustrated per theme, not pixel art throughout (see below and `docs/concept.md`)

> **Update (same day).** The pixel-art town was replaced by an illustrated isometric town, and each place got its own theme: the town and Gone Phishing are painted illustrations (WebP), Arkaden stays pixel art (indexed PNG), Fasaden will be comic style. The script supports both (`colours` set = pixel art). Pieces can be cut from a larger image (`from`), e.g. guide portraits from their scene and the two character views from one character sheet. The image budget is 3 MB. The rest of this ADR (source, review, licence) still holds.

## Context
Phase 7 needs final art: the town, sticker art, portraits for the townspeople and an app icon. Surfelappen is a hobby project for friends and family; look & feel matters more than hand-made provenance. The owner already makes illustrations with the OpenAI image API for minhule.eu, and the keys are in the git-ignored `.env` (ADR 0011 allows dev-time use). ADR 0011 asked for a licensing note before AI output became final art.

## Decision
- **Source:** drafts come from the OpenAI image API (`gpt-image-2`) through `scripts/make-art.ts`. Prompts are committed (`scripts/art/_style.txt` plus one file per art ID), so a piece can be regenerated or restyled. Raw output is cached in `.cache/art/` and never committed.
- **Real pixel art:** the script shrinks each draft to its logical size with a Lanczos filter and saves an indexed PNG with a small palette (town 48 colours, portraits 24, stickers 16) and no dithering. In the browser it's scaled up with `image-rendering: pixelated`. gpt-image-2 has no transparent backgrounds, so pieces that need one are drawn on flat magenta, which is keyed out at full resolution before shrinking.
- **Sizes** (amending 0011): town 320×180 (unchanged); stickers **48×48** (was 32×32: too few pixels to read once shrunk); portraits **64×64** (was 48×48); icon 64×64, from which the favicon and PWA icons are scaled up with hard pixels.
- **Review:** the owner approves every piece before it's committed. A piece that's wrong is regenerated (new prompt) or fixed by hand; tuning palette or crop reruns without `--generate`, at no cost.
- **Licence note:** under OpenAI's terms the output belongs to the person who prompted it, as far as rights exist. Purely machine-generated images may not be protected by copyright in Norway or the EU, so the CC BY-NC-SA 4.0 statement for art applies to the extent there are rights to license (the selection, editing and arrangement). The About page credits the art as made with an image model. No real people, brands or existing artworks are named in prompts.

## Alternatives
- Hand-drawn pixel art (by us or commissioned): best consistency and clear rights, but slow or costly for a hobby project.
- SVG pixel art written as code: tiny and fully ours, but much flatter than the generated scenes.
- gpt-image-1.5 for transparent pieces: works, but mixes two models' styles.

## Consequences
- New art costs one prompt and a review, so later missions can get their own scenes and portraits.
- `sharp` is a dev dependency (image processing in the script only).
- Pixel grids are approximate (Lanczos, not a hand-placed grid); acceptable at these sizes.
- Hotspots in `content/town.ts` were redrawn to fit the new town picture.

## Update: narration

Narration is drafted the same way: `scripts/make-voice.ts` sends the on-screen text to OpenAI's speech model (`gpt-4o-mini-tts`, Norwegian instructions), re-encodes it to 40 kbps mono MP3 with a dev-only ffmpeg binary, and writes `src/assets/audio/`. Narration is referenced only through `content/audio.ts`. Review: listen, or transcribe it back and compare with the text. The spoken words are the text on screen, so the card doubles as subtitles.
