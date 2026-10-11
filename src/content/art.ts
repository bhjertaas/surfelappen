import characterAdultBack from '../assets/art/character-adult-back.webp';
import characterAdultFront from '../assets/art/character-adult-front.webp';
import historyAi from '../assets/art/history-ai.webp';
import historyArpanet from '../assets/art/history-arpanet.webp';
import historyEmail from '../assets/art/history-email.webp';
import historyFreeWeb from '../assets/art/history-free-web.webp';
import historyGoogle from '../assets/art/history-google.webp';
import historyNorsar from '../assets/art/history-norsar.webp';
import historySmartphone from '../assets/art/history-smartphone.webp';
import historySocial from '../assets/art/history-social.webp';
import historyTcpip from '../assets/art/history-tcpip.webp';
import historyWeb from '../assets/art/history-web.webp';
import portraitHanne from '../assets/art/portrait-hanne.webp';
import portraitIvar from '../assets/art/portrait-ivar.webp';
import portraitKai from '../assets/art/portrait-kai.png';
import portraitMira from '../assets/art/portrait-mira.webp';
import postBeach from '../assets/art/post-beach.webp';
import postCabin from '../assets/art/post-cabin.webp';
import postCat from '../assets/art/post-cat.webp';
import postClimbing from '../assets/art/post-climbing.webp';
import postDog from '../assets/art/post-dog.webp';
import postFootball from '../assets/art/post-football.webp';
import postGamer from '../assets/art/post-gamer.webp';
import postRoutine from '../assets/art/post-routine.webp';
import postSerum from '../assets/art/post-serum.webp';
import postSponsored from '../assets/art/post-sponsored.webp';
import postTaco from '../assets/art/post-taco.webp';
import roomReality from '../assets/art/room-reality.webp';
import sceneArcade from '../assets/art/scene-arcade.png';
import sceneCafe from '../assets/art/scene-cafe.webp';
import sceneFacade from '../assets/art/scene-facade.webp';
import scenePhishing from '../assets/art/scene-phishing.webp';
import stickerAdHunter from '../assets/art/sticker-ad-hunter.webp';
import stickerBehindTheFacade from '../assets/art/sticker-behind-the-facade.webp';
import stickerCurious from '../assets/art/sticker-curious.webp';
import stickerLinkDetective from '../assets/art/sticker-link-detective.webp';
import stickerSharpEye from '../assets/art/sticker-sharp-eye.webp';
import stickerSteadyHand from '../assets/art/sticker-steady-hand.webp';
import stickerTenFingers from '../assets/art/sticker-ten-fingers.webp';
import stickerWebExplorer from '../assets/art/sticker-web-explorer.webp';
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

const sticker = (src: string): ArtAsset => ({ src, width: 192, height: 192 });

export const art = {
  town: { src: townUrl, width: 1536, height: 1024 },
  'portrait-hanne': { src: portraitHanne, width: 256, height: 256 },
  'portrait-kai': { src: portraitKai, width: 64, height: 64 },
  'post-sponsored': { src: postSponsored, width: 768, height: 768 },
  'post-routine': { src: postRoutine, width: 768, height: 768 },
  'post-serum': { src: postSerum, width: 768, height: 768 },
  'post-cabin': { src: postCabin, width: 768, height: 768 },
  'post-beach': { src: postBeach, width: 768, height: 768 },
  'post-gamer': { src: postGamer, width: 768, height: 768 },
  'post-taco': { src: postTaco, width: 768, height: 768 },
  'sticker-ad-hunter': sticker(stickerAdHunter),
  'sticker-web-explorer': sticker(stickerWebExplorer),
  'post-climbing': { src: postClimbing, width: 768, height: 768 },
  'post-football': { src: postFootball, width: 768, height: 768 },
  'post-cat': { src: postCat, width: 768, height: 768 },
  'post-dog': { src: postDog, width: 768, height: 768 },
  'portrait-mira': { src: portraitMira, width: 256, height: 256 },
  'portrait-ivar': { src: portraitIvar, width: 256, height: 256 },
  'scene-facade': { src: sceneFacade, width: 1536, height: 1024 },
  'history-arpanet': { src: historyArpanet, width: 768, height: 512 },
  'history-email': { src: historyEmail, width: 768, height: 512 },
  'history-norsar': { src: historyNorsar, width: 768, height: 512 },
  'history-tcpip': { src: historyTcpip, width: 768, height: 512 },
  'history-web': { src: historyWeb, width: 768, height: 512 },
  'history-free-web': { src: historyFreeWeb, width: 768, height: 512 },
  'history-google': { src: historyGoogle, width: 768, height: 512 },
  'history-social': { src: historySocial, width: 768, height: 512 },
  'history-smartphone': { src: historySmartphone, width: 768, height: 512 },
  'history-ai': { src: historyAi, width: 768, height: 512 },
  'scene-cafe': { src: sceneCafe, width: 1536, height: 1024 },
  'room-reality': { src: roomReality, width: 1536, height: 1024 },
  'sticker-behind-the-facade': sticker(stickerBehindTheFacade),
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

/** Every art ID mentioned anywhere in `value` (a mission structure), each once. */
export function artUsedBy(value: unknown): string[] {
  const found = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === 'string') {
      if (artFor(v)) found.add(v);
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(value);
  return [...found];
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
