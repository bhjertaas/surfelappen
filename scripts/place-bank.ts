/**
 * Puts Lenkevikbanken into the town picture over the old yellow house, top right.
 * Reads .cache/art/town.orig.png (the town as generated) and .cache/art/town-bank.cut.webp
 * (the bank from `make-art.ts town-bank`, background keyed out), writes
 * .cache/art/town.png; then `node scripts/make-art.ts town` makes the asset.
 *
 *   node scripts/place-bank.ts [left] [bottom] [width]
 */
import { join } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const [left = 1356, bottom = 248, width = 250] = process.argv.slice(2).map(Number);
const cache = (f: string) => join(root, '.cache/art', f);

const bank = await sharp(cache('town-bank.cut.webp')).trim().resize({ width }).png().toBuffer();
const { height = 0 } = await sharp(bank).metadata();
// The pizza drone flies in front of the house: put its pixels back on top afterwards.
const drone = { left: 1296, top: 52, width: 100, height: 120 };
const dronePixels = await sharp(cache('town.orig.png')).extract(drone).png().toBuffer();
const droneMask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${drone.width}" height="${drone.height}"><ellipse cx="44" cy="40" rx="52" ry="34" fill="#fff"/><rect x="18" y="40" width="40" height="80" fill="#fff"/></svg>`,
);
const droneOnly = await sharp(dronePixels)
  .ensureAlpha()
  .composite([{ input: droneMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

await sharp(cache('town.orig.png'))
  .composite([
    { input: bank, left, top: bottom - height },
    { input: droneOnly, left: drone.left, top: drone.top },
  ])
  .png()
  .toFile(cache('town.png'));
console.log(`bank placed at ${left},${bottom - height}, ${width}×${height}`);
