/**
 * Builds the self-hosted fonts (ADR 0011): downloads the OFL sources from a pinned
 * commit of github.com/google/fonts, checks that every glyph Norwegian text needs is
 * present, and writes small woff2 subsets with fixed weights to src/assets/fonts/.
 *
 * Run by hand when fonts change: `node scripts/build-fonts.ts`. Output is committed.
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Blob, Face } from 'harfbuzzjs';
import subsetFont from 'subset-font';

const GOOGLE_FONTS_COMMIT = 'bd8f81ddb5c74d5c8897b36ad88b440266245103';
const RAW = `https://raw.githubusercontent.com/google/fonts/${GOOGLE_FONTS_COMMIT}/ofl`;
const CACHE = '.cache/fonts';
const OUT = 'src/assets/fonts';

/** Characters the game cannot do without. The build fails if a source lacks any of them. */
const REQUIRED = 'æøåÆØÅ«»–—‘’“”…€ ';

/** What we keep: Basic Latin, Latin-1 Supplement, and common typographic punctuation. */
function range(from: number, to: number): string {
  return Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)).join('');
}
const KEEP = `${range(0x20, 0x7e)}${range(0xa0, 0xff)}–—‘’‚“”„…•€−`;

interface FontJob {
  source: string;
  out: string;
  wght: number;
}

const FAMILIES = [
  { dir: 'pixelifysans', ofl: 'OFL-PixelifySans.txt' },
  { dir: 'atkinsonhyperlegiblenext', ofl: 'OFL-AtkinsonHyperlegibleNext.txt' },
];

const JOBS: FontJob[] = [
  { source: 'pixelifysans/PixelifySans[wght].ttf', out: 'pixelify-sans-500.woff2', wght: 500 },
  {
    source: 'atkinsonhyperlegiblenext/AtkinsonHyperlegibleNext[wght].ttf',
    out: 'atkinson-hyperlegible-next-400.woff2',
    wght: 400,
  },
  {
    source: 'atkinsonhyperlegiblenext/AtkinsonHyperlegibleNext[wght].ttf',
    out: 'atkinson-hyperlegible-next-700.woff2',
    wght: 700,
  },
  {
    source: 'atkinsonhyperlegiblenext/AtkinsonHyperlegibleNext-Italic[wght].ttf',
    out: 'atkinson-hyperlegible-next-400-italic.woff2',
    wght: 400,
  },
];

async function download(path: string): Promise<Buffer> {
  const cached = join(CACHE, path.replaceAll('/', '__'));
  if (existsSync(cached)) return readFile(cached);
  const response = await fetch(`${RAW}/${path.replaceAll('[', '%5B').replaceAll(']', '%5D')}`);
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${path}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(cached, bytes);
  return bytes;
}

function assertCoverage(name: string, font: Buffer): void {
  const unicodes = new Set(new Face(new Blob(font)).collectUnicodes());
  const missing = [...REQUIRED].filter((ch) => !unicodes.has(ch.codePointAt(0) ?? 0));
  if (missing.length > 0) throw new Error(`${name} lacks required glyphs: ${missing.join(' ')}`);
}

await mkdir(CACHE, { recursive: true });
await mkdir(OUT, { recursive: true });

for (const family of FAMILIES) {
  await writeFile(join(OUT, family.ofl), await download(`${family.dir}/OFL.txt`));
}

for (const job of JOBS) {
  const source = await download(job.source);
  assertCoverage(job.source, source);
  const woff2 = await subsetFont(source, KEEP, {
    targetFormat: 'woff2',
    variationAxes: { wght: job.wght },
  });
  await writeFile(join(OUT, job.out), woff2);
  console.log(`${job.out.padEnd(48)} ${(woff2.length / 1024).toFixed(1)} KB`);
}
