/**
 * Generates placeholder PWA icons (phase 2; replaced by final art in phase 7).
 * A 16×16 pixel design scaled up with nearest-neighbour, encoded as PNG with
 * node:zlib only. Run: `node scripts/make-placeholder-icons.ts`. Output is committed.
 */
import { writeFileSync } from 'node:fs';
import { crc32, deflateSync } from 'node:zlib';

type Rgb = readonly [number, number, number];
const PALETTE: Record<string, Rgb> = {
  '.': [0x1f, 0x6f, 0x8b], // sea blue
  '#': [0xfd, 0xf8, 0xec], // paper
  s: [0xc2, 0x41, 0x2d], // stamp red
};

/** A passport page with a red "S" stamp. */
const DESIGN = [
  '................',
  '................',
  '..############..',
  '..############..',
  '..##ssssssss##..',
  '..##ssssssss##..',
  '..##ss########..',
  '..##ssssssss##..',
  '..##ssssssss##..',
  '..########ss##..',
  '..##ssssssss##..',
  '..##ssssssss##..',
  '..############..',
  '..############..',
  '................',
  '................',
];

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/** Renders DESIGN into a size×size image, inset by `padding` pixels of background. */
function png(size: number, padding = 0): Buffer {
  const inner = size - 2 * padding;
  const background = PALETTE['.'] as Rgb;
  const rows: Buffer[] = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3); // filter byte 0, then RGB
    for (let x = 0; x < size; x++) {
      const ix = x - padding;
      const iy = y - padding;
      let rgb = background;
      if (ix >= 0 && iy >= 0 && ix < inner && iy < inner) {
        const cell = DESIGN[Math.floor((iy * 16) / inner)]?.[Math.floor((ix * 16) / inner)] ?? '.';
        rgb = PALETTE[cell] ?? background;
      }
      row.set(rgb, 1 + x * 3);
    }
    rows.push(row);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // colour type: truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

writeFileSync('public/icons/icon-192.png', png(192));
writeFileSync('public/icons/icon-512.png', png(512));
// Maskable icons must keep their content inside the central 80% safe zone.
writeFileSync('public/icons/icon-maskable-512.png', png(512, 64));
writeFileSync('public/icons/apple-touch-icon-180.png', png(180, 12));
console.log('Wrote placeholder icons to public/icons/');
