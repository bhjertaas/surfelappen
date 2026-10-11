import type { Audience, Building, Point } from './types.ts';

/**
 * The places in Lenkevik, in display order. The picture's hotspots and the text
 * list both render this array, so they can't drift apart (FR-02).
 * Hotspots and doors are in the town picture's pixel space (TOWN_SIZE).
 */
export const buildings = [
  {
    id: 'cafe',
    status: 'open',
    missions: ['how-the-net-works'],
    hotspot: { x: 1280, y: 740, w: 256, h: 284 },
    door: { x: 1300, y: 930 },
    image: 'town',
  },
  {
    id: 'gone-phishing',
    status: 'open',
    missions: ['find-the-impostor'],
    after: 'how-the-net-works',
    hotspot: { x: 102, y: 486, w: 435, h: 282 },
    door: { x: 470, y: 720 },
    image: 'town',
  },
  {
    id: 'arcade',
    status: 'open',
    missions: ['ten-fingers'],
    hotspot: { x: 115, y: 179, w: 397, h: 269 },
    door: { x: 420, y: 470 },
    image: 'town',
  },
  {
    id: 'facade',
    status: 'open',
    missions: ['perfect-life'],
    hotspot: { x: 960, y: 102, w: 320, h: 300 },
    door: { x: 1030, y: 460 },
    image: 'town',
  },
  {
    id: 'rumour-exchange',
    status: 'coming-soon',
    missions: [],
    hotspot: { x: 1050, y: 420, w: 397, h: 340 },
    door: { x: 1120, y: 770 },
    image: 'town',
  },
  {
    id: 'licence-bureau',
    status: 'passport',
    missions: [],
    hotspot: { x: 614, y: 0, w: 384, h: 339 },
    door: { x: 778, y: 360 },
    image: 'town',
  },
] as const satisfies readonly Building[];

export type TownBuildingId = (typeof buildings)[number]['id'];

export const TOWN_SIZE = { width: 1536, height: 1024 } as const;

/** Where the player's character stands when the town opens: on the square, by the fountain. */
export const TOWN_START: Point = { x: 700, y: 640 };

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
