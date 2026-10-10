import type { Sticker } from './types.ts';

/**
 * Every sticker in this release (FR-07), in passport order. Names and
 * "how to earn" texts live in the locale files under `stickers`.
 */
export const stickers = [
  {
    id: 'link-detective',
    image: 'sticker-link-detective',
    awardedBy: { mission: 'find-the-impostor' },
  },
  {
    id: 'sharp-eye',
    image: 'sticker-sharp-eye',
    awardedBy: { mission: 'find-the-impostor', condition: 'transfer-first-try' },
  },
  { id: 'ten-fingers', image: 'sticker-ten-fingers', awardedBy: { mission: 'ten-fingers' } },
  {
    id: 'steady-hand',
    image: 'sticker-steady-hand',
    awardedBy: { mission: 'ten-fingers', condition: 'final-line-flawless' },
  },
  { id: 'curious', image: 'sticker-curious', awardedBy: { town: 'visited-all-buildings' } },
] as const satisfies readonly Sticker[];
