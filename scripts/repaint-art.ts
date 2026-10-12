/**
 * Repaints one part of a picture with the OpenAI image edit API and pastes only that
 * part back, so everything outside the box stays exactly as it was (ADR 0016).
 *
 *   node scripts/repaint-art.ts <id> <x,y,w,h> [--draft name]
 *
 * - Prompt: scripts/art/_style-<style of id>.txt + scripts/art/<id>.repaint.txt
 * - Reads the raw image .cache/art/<id>.png and keeps the first original as
 *   .cache/art/<id>.orig.png. The result replaces .cache/art/<id>.png (or goes to
 *   .cache/art/<id>.<draft>.png with --draft); then `node scripts/make-art.ts <id>`
 *   makes the asset from it.
 * Reads OPENAI_API_KEY from the environment or .env. Dev only.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { draft: { type: 'string' }, style: { type: 'string', default: 'town' } },
});
const [id, box] = positionals;
if (!id || !box) throw new Error('usage: repaint-art.ts <id> <x,y,w,h> [--draft name]');
const [x, y, w, h] = box.split(',').map(Number) as [number, number, number, number];

function apiKey(): string {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
    const [k, ...v] = line.split('=');
    if (k?.trim() === 'OPENAI_API_KEY')
      return v
        .join('=')
        .trim()
        .replace(/^["']|["']$/g, '');
  }
  throw new Error('OPENAI_API_KEY missing: add it to .env');
}

const raw = join(root, `.cache/art/${id}.png`);
const orig = join(root, `.cache/art/${id}.orig.png`);
if (!existsSync(orig)) copyFileSync(raw, orig);
const source = readFileSync(orig);
const { width, height } = await sharp(source).metadata();
if (!width || !height) throw new Error('no size');

// A square of context around the box, scaled up to 1024 px: the model paints a close-up.
const side = Math.min(Math.max(w, h) + 2 * 64, width, height);
const cx = Math.min(Math.max(0, x + w / 2 - side / 2), width - side) | 0;
const cy = Math.min(Math.max(0, y + h / 2 - side / 2), height - side) | 0;
const SIZE = 1024;
const k = SIZE / side;
const closeUp = await sharp(source)
  .extract({ left: cx, top: cy, width: side, height: side })
  .resize(SIZE, SIZE, { kernel: 'lanczos3' })
  .png()
  .toBuffer();

// The mask: transparent where the model may paint.
const mask = await sharp({
  create: { width: SIZE, height: SIZE, channels: 4, background: '#000000ff' },
})
  .composite([
    {
      input: await sharp({
        create: {
          width: Math.round(w * k),
          height: Math.round(h * k),
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .png()
        .toBuffer(),
      left: Math.round((x - cx) * k),
      top: Math.round((y - cy) * k),
      blend: 'dest-in',
    },
  ])
  .png()
  .toBuffer();

const style = readFileSync(join(root, `scripts/art/_style-${values.style}.txt`), 'utf8');
const prompt = `${style}\n\n${readFileSync(join(root, `scripts/art/${id}.repaint.txt`), 'utf8')}`;
const form = new FormData();
form.append('model', 'gpt-image-2');
form.append('prompt', prompt);
form.append('size', `${SIZE}x${SIZE}`);
form.append('quality', 'high');
form.append('image[]', new Blob([closeUp], { type: 'image/png' }), `${id}.png`);
form.append('mask', new Blob([mask], { type: 'image/png' }), 'mask.png');
const res = await fetch('https://api.openai.com/v1/images/edits', {
  method: 'POST',
  headers: { Authorization: `Bearer ${apiKey()}` },
  body: form,
});
if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
const json = (await res.json()) as { data: { b64_json: string }[] };
const edited = Buffer.from(json.data[0]?.b64_json ?? '', 'base64');

// Paste back only the box, with a soft edge so the seam doesn't show.
const feather = 12;
const patch = await sharp(edited)
  .resize(side, side, { kernel: 'lanczos3' })
  .extract({ left: x - cx, top: y - cy, width: w, height: h })
  .png()
  .toBuffer();
const edge = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="b"><feGaussianBlur stdDeviation="${feather / 2}"/></filter></defs><rect x="${x === 0 ? -feather : feather}" y="${y === 0 ? -feather : feather}" width="${w - (x === 0 ? 0 : 2 * feather) + (x + w >= width ? feather : 0) + (x === 0 ? feather : 0)}" height="${h - (y === 0 ? 0 : 2 * feather) + (y + h >= height ? feather : 0) + (y === 0 ? feather : 0)}" fill="#fff" filter="url(#b)"/></svg>`,
);
const softPatch = await sharp(patch)
  .ensureAlpha()
  .composite([{ input: edge, blend: 'dest-in' }])
  .png()
  .toBuffer();
const out = await sharp(source)
  .composite([{ input: softPatch, left: x, top: y }])
  .png()
  .toBuffer();
const target = values.draft ? join(root, `.cache/art/${id}.${values.draft}.png`) : raw;
writeFileSync(target, out);
writeFileSync(join(root, `.cache/art/${id}.edited-full.png`), edited);
console.log(`${id}: repainted ${box} → ${target}`);
