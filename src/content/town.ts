import type { Audience, Building } from './types.ts';

/**
 * The buildings of Lenkevik, in display order. The picture's hotspots and the
 * text list both render this array, so they can't drift apart (FR-02).
 * Hotspots are in the town picture's 320×180 logical pixel space (ADR 0011).
 */
export const buildings = [
  {
    id: 'post-office',
    status: 'open',
    missions: ['find-the-impostor'],
    hotspot: { x: 14, y: 58, w: 56, h: 70 },
    image: 'town',
  },
  {
    id: 'keyboard-hall',
    status: 'open',
    missions: ['ten-fingers'],
    hotspot: { x: 76, y: 50, w: 64, h: 78 },
    image: 'town',
  },
  {
    id: 'square',
    status: 'coming-soon',
    missions: [],
    hotspot: { x: 146, y: 76, w: 56, h: 52 },
    image: 'town',
  },
  {
    id: 'library',
    status: 'coming-soon',
    missions: [],
    hotspot: { x: 208, y: 56, w: 52, h: 72 },
    image: 'town',
  },
  {
    id: 'licence-office',
    status: 'passport',
    missions: [],
    hotspot: { x: 266, y: 64, w: 48, h: 64 },
    image: 'town',
  },
] as const satisfies readonly Building[];

export type TownBuildingId = (typeof buildings)[number]['id'];

export const TOWN_SIZE = { width: 320, height: 180 } as const;

/**
 * Suggested order per audience (PRD "Later": e.g. a sharing/bullying mission
 * first for teenagers). Nothing is hidden; buildings not listed keep their
 * default order after the listed ones. Empty until audience variants exist.
 */
export const buildingOrder: Partial<Record<Audience, readonly TownBuildingId[]>> = {};

export function buildingsFor(audience: Audience): readonly Building[] {
  const order = buildingOrder[audience];
  if (!order) return buildings;
  const rank = (b: Building) => {
    const i = order.indexOf(b.id as TownBuildingId);
    return i === -1 ? order.length + buildings.indexOf(b as (typeof buildings)[number]) : i;
  };
  return [...buildings].sort((a, b) => rank(a) - rank(b));
}
