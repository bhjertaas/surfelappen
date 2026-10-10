/**
 * Writes the favicon PNG and the PWA icons from public/favicon.svg (the logo's emblem:
 * a neon wave over the grid). Run after changing the SVG: `node scripts/make-icons.ts`.
 */
import { join } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const svg = join(root, 'public/favicon.svg');
const png = { palette: true, quality: 90, effort: 10, compressionLevel: 9 } as const;
const render = (size: number) => sharp(svg, { density: (72 * size) / 64 }).resize(size, size);

await render(64).png(png).toFile(join(root, 'public/favicon.png'));
await render(192).png(png).toFile(join(root, 'public/icons/icon-192.png'));
await render(512).png(png).toFile(join(root, 'public/icons/icon-512.png'));
await render(180)
  .flatten({ background: '#05060d' })
  .png(png)
  .toFile(join(root, 'public/icons/apple-touch-icon-180.png'));
// Maskable: full-bleed background, emblem inside the 80 % safe zone.
const inner = await render(410).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#05060d' } })
  .composite([{ input: inner, left: 51, top: 51 }])
  .png(png)
  .toFile(join(root, 'public/icons/icon-maskable-512.png'));
console.log('favicon and PWA icons written');
