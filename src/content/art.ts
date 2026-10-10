import characterAdultBack from '../assets/art/character-adult-back.webp';
import characterAdultFront from '../assets/art/character-adult-front.webp';
import icon from '../assets/art/icon.png';
import portraitHanne from '../assets/art/portrait-hanne.webp';
import portraitKai from '../assets/art/portrait-kai.png';
import sceneArcade from '../assets/art/scene-arcade.png';
import scenePhishing from '../assets/art/scene-phishing.webp';
import stickerCurious from '../assets/art/sticker-curious.png';
import stickerLinkDetective from '../assets/art/sticker-link-detective.png';
import stickerSharpEye from '../assets/art/sticker-sharp-eye.png';
import stickerSteadyHand from '../assets/art/sticker-steady-hand.png';
import stickerTenFingers from '../assets/art/sticker-ten-fingers.png';
import townUrl from '../assets/art/town.webp';
import type { Audience } from './types.ts';

/**
 * Every piece of art, by ID (ADR 0011, 0016). Drafted with `scripts/make-art.ts`;
 * swapping art means changing only this file and the files it points to.
 */
export interface ArtAsset {
  readonly src: string;
  /** Logical (unscaled) size in pixels. */
  readonly width: number;
  readonly height: number;
}

const sticker = (src: string): ArtAsset => ({ src, width: 48, height: 48 });

export const art = {
  town: { src: townUrl, width: 1536, height: 1024 },
  icon: { src: icon, width: 64, height: 64 },
  'portrait-hanne': { src: portraitHanne, width: 256, height: 256 },
  'portrait-kai': { src: portraitKai, width: 64, height: 64 },
  'scene-phishing': { src: scenePhishing, width: 1536, height: 1024 },
  'scene-arcade': { src: sceneArcade, width: 384, height: 256 },
  'character-adult-front': { src: characterAdultFront, width: 160, height: 320 },
  'character-adult-back': { src: characterAdultBack, width: 160, height: 320 },
  'sticker-link-detective': sticker(stickerLinkDetective),
  'sticker-sharp-eye': sticker(stickerSharpEye),
  'sticker-ten-fingers': sticker(stickerTenFingers),
  'sticker-steady-hand': sticker(stickerSteadyHand),
  'sticker-curious': sticker(stickerCurious),
} as const satisfies Record<string, ArtAsset>;

export type ArtKey = keyof typeof art;

export function artFor(id: string): ArtAsset | undefined {
  return (art as Record<string, ArtAsset>)[id];
}

/**
 * The player's character on the town map, per audience (who is playing). Only the
 * adult version exists so far; the others fall back to it.
 */
const characters: Partial<Record<Audience, { front: ArtKey; back: ArtKey }>> = {
  adult: { front: 'character-adult-front', back: 'character-adult-back' },
};

export function characterFor(audience: Audience): { front: ArtAsset; back: ArtAsset } {
  const keys = characters[audience] ??
    characters.adult ?? { front: 'character-adult-front', back: 'character-adult-back' };
  return { front: art[keys.front], back: art[keys.back] };
}
