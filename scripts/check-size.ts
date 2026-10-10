/**
 * Size budget for the production build (ADR 0009). Run after `vite build`.
 * Text assets are measured gzipped (what travels over the network); fonts and
 * images are already compressed and are measured as they are.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const KB = 1024;

type Category = 'js' | 'css' | 'fonts' | 'images' | 'other';

const BUDGET: Record<Category | 'total', number> = {
  js: 60 * KB,
  css: 15 * KB,
  fonts: 100 * KB,
  images: 700 * KB,
  other: 50 * KB,
  total: 1024 * KB,
};

function category(file: string): Category {
  const ext = extname(file);
  if (ext === '.js' || ext === '.mjs') return 'js';
  if (ext === '.css') return 'css';
  if (ext === '.woff2' || ext === '.woff') return 'fonts';
  if (['.png', '.svg', '.webp', '.ico', '.jpg'].includes(ext)) return 'images';
  return 'other';
}

const GZIPPED = new Set(['.js', '.mjs', '.css', '.html', '.svg', '.json', '.webmanifest', '.txt']);

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

function transferSize(file: string): number {
  const bytes = readFileSync(file);
  return GZIPPED.has(extname(file)) ? gzipSync(bytes, { level: 9 }).length : bytes.length;
}

const totals: Record<Category | 'total', number> = {
  js: 0,
  css: 0,
  fonts: 0,
  images: 0,
  other: 0,
  total: 0,
};

for (const file of files(DIST)) {
  if (file.endsWith('.map')) continue;
  const size = transferSize(file);
  totals[category(relative(DIST, file))] += size;
  totals.total += size;
}

const rows = (Object.keys(BUDGET) as (keyof typeof BUDGET)[]).map((key) => ({
  category: key,
  size: `${(totals[key] / KB).toFixed(1)} KB`,
  budget: `${(BUDGET[key] / KB).toFixed(0)} KB`,
  ok: totals[key] <= BUDGET[key] ? 'yes' : 'NO',
}));
console.table(rows);

const over = rows.filter((r) => r.ok === 'NO');
if (over.length > 0) {
  console.error(`Size budget exceeded: ${over.map((r) => r.category).join(', ')}`);
  process.exit(1);
}
