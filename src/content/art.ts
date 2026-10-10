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

export const art = {
  town: { src: townUrl, width: 320, height: 180 },
} as const satisfies Record<string, ArtAsset>;

export type ArtKey = keyof typeof art;
