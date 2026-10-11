/**
 * Drafts art with the OpenAI image API (ADR 0016, docs/concept.md).
 *
 *   node scripts/make-art.ts <id>… [--generate] [--draft name] [--model gpt-image-2]
 *
 * - Prompt: scripts/art/_style-<style>.txt + scripts/art/<id>.txt
 * - Raw image (never committed): .cache/art/<id>[.<draft>].png
 * - Result: src/assets/art/<id>.webp (illustrations) or <id>.png (pixel art, reduced to
 *   real pixels with a small palette). With --draft, the result goes to
 *   .cache/art/<id>.<draft>.preview.<ext> instead, for comparing options.
 *
 * Without --generate, only post-processing runs on the cached raw image (free).
 * Reads OPENAI_API_KEY from the environment or .env. Dev only: the game never calls an API.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import sharp from 'sharp';

interface Spec {
  /** Style file: scripts/art/_style-<style>.txt. One per theme (town, arcade, comic, …). */
  style: string;
  /** Size of the result in px (the logical size for pixel art). */
  width: number;
  height: number;
  /** Size asked of the API. */
  generate: '1024x1024' | '1536x1024' | '1024x1536';
  /** Pixel art: palette size. Illustrations leave this out. */
  colours?: number;
  /** Drawn on flat magenta (gpt-image-2 has no transparent background), keyed out here. */
  transparent?: boolean;
  /** Cut from another piece's raw image instead of generating (e.g. a portrait from a scene). */
  from?: { id: string; left: number; top: number; width: number; height: number };
  /** Fit inside width×height and trim transparent edges, instead of cropping to cover. */
  contain?: boolean;
  /**
   * Other pieces whose raw images are sent along (image edit endpoint): keeps a person
   * the same across pictures, or turns a "perfect" picture into its "reality" version.
   */
  refs?: string[];
}

const sticker: Spec = {
  style: 'town',
  width: 192,
  height: 192,
  generate: '1024x1024',
  transparent: true,
  contain: true,
};

/** A social media post picture in the comic style (Fasaden). */
const post = (refs?: string[]): Spec => ({
  style: 'comic',
  width: 768,
  height: 768,
  generate: '1024x1024',
  ...(refs ? { refs } : {}),
});

const SPECS: Record<string, Spec> = {
  'room-reality': {
    style: 'comic',
    width: 1536,
    height: 1024,
    generate: '1536x1024',
    refs: ['post-routine', 'post-routine-real'],
  },
  'portrait-mira': { style: 'comic', width: 256, height: 256, generate: '1024x1024' },
  'post-filter': post(),
  'post-filter-real': post(['post-filter']),
  'post-routine': post(['post-filter']),
  'post-routine-real': post(['post-routine']),
  'post-sponsored': post(['post-filter']),
  'post-sponsored-real': post(['post-sponsored']),
  'post-serum': post(),
  'post-beach': post(['post-filter']),
  'post-cabin': post(),
  'post-gamer': post(),
  'post-taco': post(),
  'post-climbing': post(['post-cat']),
  'post-football': post(['post-cat']),
  'post-cat': post(),
  'post-dog': post(),
  town: { style: 'town', width: 1536, height: 1024, generate: '1536x1024' },
  character: { style: 'town', width: 512, height: 512, generate: '1536x1024', transparent: true },
  'character-adult-front': {
    style: 'town',
    width: 160,
    height: 320,
    generate: '1536x1024',
    transparent: true,
    contain: true,
    from: { id: 'character', left: 0, top: 0, width: 768, height: 1024 },
  },
  'character-adult-back': {
    style: 'town',
    width: 160,
    height: 320,
    generate: '1536x1024',
    transparent: true,
    contain: true,
    from: { id: 'character', left: 768, top: 0, width: 768, height: 1024 },
  },
  'portrait-hanne': {
    style: 'pointclick',
    width: 256,
    height: 256,
    generate: '1536x1024',
    from: { id: 'scene-phishing', left: 563, top: 230, width: 340, height: 340 },
  },
  'portrait-kai': {
    style: 'arcade',
    width: 64,
    height: 64,
    generate: '1536x1024',
    colours: 32,
    from: { id: 'scene-arcade', left: 40, top: 320, width: 400, height: 400 },
  },
  'scene-phishing': { style: 'pointclick', width: 1536, height: 1024, generate: '1536x1024' },
  'scene-arcade': {
    style: 'arcade',
    width: 384,
    height: 256,
    generate: '1536x1024',
    colours: 48,
  },
  'scene-facade': { style: 'comic', width: 1536, height: 1024, generate: '1536x1024' },
  'portrait-ivar': {
    style: 'retroweb',
    width: 256,
    height: 256,
    generate: '1536x1024',
    from: { id: 'scene-cafe', left: 1110, top: 190, width: 340, height: 340 },
  },
  'scene-cafe': { style: 'retroweb', width: 1536, height: 1024, generate: '1536x1024' },
  'sticker-link-detective': sticker,
  'sticker-sharp-eye': sticker,
  'sticker-ten-fingers': sticker,
  'sticker-steady-hand': sticker,
  'sticker-curious': sticker,
  'sticker-behind-the-facade': sticker,
  'sticker-ad-hunter': sticker,
  'sticker-web-explorer': sticker,
};

const root = new URL('..', import.meta.url).pathname;

function apiKey(): string {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const env = join(root, '.env');
  if (existsSync(env)) {
    for (const line of readFileSync(env, 'utf8').split('\n')) {
      const [k, ...v] = line.split('=');
      if (k?.trim() === 'OPENAI_API_KEY')
        return v
          .join('=')
          .trim()
          .replace(/^["']|["']$/g, '');
    }
  }
  throw new Error('OPENAI_API_KEY missing: add it to .env');
}

async function generate(id: string, spec: Spec, model: string): Promise<Buffer> {
  const style = readFileSync(join(root, `scripts/art/_style-${spec.style}.txt`), 'utf8');
  const prompt = `${style}\n\n${readFileSync(join(root, `scripts/art/${id}.txt`), 'utf8')}`;
  const auth = { Authorization: `Bearer ${apiKey()}` };
  let res: Response;
  if (spec.refs?.length) {
    const form = new FormData();
    for (const [k, v] of Object.entries({ model, prompt, size: spec.generate, quality: 'high' }))
      form.append(k, v);
    for (const ref of spec.refs) {
      const file = join(root, `.cache/art/${ref}.png`);
      if (!existsSync(file)) throw new Error(`${id}: make ${ref} first`);
      form.append('image[]', new Blob([readFileSync(file)], { type: 'image/png' }), `${ref}.png`);
    }
    res = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: auth,
      body: form,
    });
  } else {
    res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, size: spec.generate, n: 1, quality: 'high' }),
    });
  }
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { data: { b64_json: string }[] };
  const b64 = json.data[0]?.b64_json;
  if (!b64) throw new Error('No image in response');
  return Buffer.from(b64, 'base64');
}

/** Makes the magenta background transparent, at full resolution so edges stay clean. */
async function keyOutMagenta(raw: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(raw).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    if (r > 150 && b > 150 && g < Math.min(r, b) - 80) data[i + 3] = 0;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

/** Pixel art: shrink to the logical size, hard alpha, limited palette. */
async function pixelate(source: Buffer, spec: Spec, colours: number): Promise<Buffer> {
  const { data, info } = await sharp(source)
    .resize(spec.width, spec.height, { fit: 'cover', kernel: 'lanczos3' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) {
    data[i] = spec.transparent && (data[i] ?? 0) < 128 ? 0 : 255;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ palette: true, colours, dither: 0, effort: 10, compressionLevel: 9 })
    .toBuffer();
}

async function finish(raw: Buffer, spec: Spec): Promise<{ data: Buffer; ext: string }> {
  const cut = spec.from
    ? await sharp(raw)
        .extract({
          left: spec.from.left,
          top: spec.from.top,
          width: spec.from.width,
          height: spec.from.height,
        })
        .toBuffer()
    : raw;
  const keyed = spec.transparent ? await keyOutMagenta(cut) : cut;
  const source = spec.contain ? await sharp(keyed).trim().toBuffer() : keyed;
  if (spec.colours) return { data: await pixelate(source, spec, spec.colours), ext: 'png' };
  const data = await sharp(source)
    .resize(spec.width, spec.height, { fit: spec.contain ? 'inside' : 'cover' })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toBuffer();
  return { data, ext: 'webp' };
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    generate: { type: 'boolean', default: false },
    draft: { type: 'string' },
    model: { type: 'string', default: 'gpt-image-2' },
  },
});

const cache = join(root, '.cache/art');
mkdirSync(cache, { recursive: true });

await Promise.all(
  positionals.map(async (id) => {
    const spec = SPECS[id];
    if (!spec) throw new Error(`Unknown art id "${id}". Known: ${Object.keys(SPECS).join(', ')}`);
    const name = values.draft ? `${id}.${values.draft}` : id;
    const rawPath = join(cache, `${spec.from?.id ?? name}.png`);
    if (spec.from && !existsSync(rawPath)) throw new Error(`${id}: make ${spec.from.id} first`);
    if (!spec.from && (values.generate || !existsSync(rawPath))) {
      console.log(`${name}: generating with ${values.model}…`);
      writeFileSync(rawPath, await generate(id, spec, values.model));
    }
    const { data, ext } = await finish(readFileSync(rawPath), spec);
    const out = values.draft
      ? join(cache, `${name}.preview.${ext}`)
      : join(root, `src/assets/art/${id}.${ext}`);
    writeFileSync(out, data);
    console.log(`${name}: ${out} (${Math.round(data.length / 1024)} KB)`);
  }),
);
