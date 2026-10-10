import stickerCurious from '../assets/art/sticker-curious.svg';
import stickerEmpty from '../assets/art/sticker-empty.svg';
import stickerLinkDetective from '../assets/art/sticker-link-detective.svg';
import stickerSharpEye from '../assets/art/sticker-sharp-eye.svg';
import stickerSteadyHand from '../assets/art/sticker-steady-hand.svg';
import stickerTenFingers from '../assets/art/sticker-ten-fingers.svg';
import townUrl from '../assets/art/town.svg';

/**
 * Every piece of art, by ID (ADR 0011). Phase 7 swaps placeholders for final art
 * by changing only this file and the files it points to.
 */
export interface ArtAsset {
  readonly src: string;
  /** Logical (unscaled) size in pixels. */
  readonly width: number;
  readonly height: number;
}

const sticker = (src: string): ArtAsset => ({ src, width: 32, height: 32 });

export const art = {
  town: { src: townUrl, width: 320, height: 180 },
  'sticker-link-detective': sticker(stickerLinkDetective),
  'sticker-sharp-eye': sticker(stickerSharpEye),
  'sticker-ten-fingers': sticker(stickerTenFingers),
  'sticker-steady-hand': sticker(stickerSteadyHand),
  'sticker-curious': sticker(stickerCurious),
  'sticker-empty': sticker(stickerEmpty),
} as const satisfies Record<string, ArtAsset>;

export type ArtKey = keyof typeof art;

export function artFor(id: string): ArtAsset | undefined {
  return (art as Record<string, ArtAsset>)[id];
}
