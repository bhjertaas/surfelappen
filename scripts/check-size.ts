/**
 * Size budget for the production build (ADR 0009, 0017). Run after `vite build`.
 * Text assets are measured gzipped (what travels over the network); fonts and
 * images are already compressed and are measured as they are.
 *
 * Two budgets: the **first visit** (everything the service worker precaches, read
 * from dist/sw.js) and **each lesson** (the media its structure names, cached when
 * the lesson is opened).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const KB = 1024;

type Category = 'js' | 'css' | 'fonts' | 'images' | 'other';

const BUDGET: Record<Category | 'total', number> = {
  js: 80 * KB,
  css: 15 * KB,
  fonts: 100 * KB,
  // Only the core art: town, character, stickers. Lesson media is budgeted per lesson.
  images: 1200 * KB,
  other: 50 * KB,
  total: 1500 * KB,
};

/** One lesson's media: scene, portrait, pictures, narration. */
const LESSON_BUDGET = 2500 * KB;

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

/** The URLs the service worker precaches, from the generated dist/sw.js. */
const precached = new Set(
  [...readFileSync(join(DIST, 'sw.js'), 'utf8').matchAll(/url:"([^"]+)"/g)].map((m) => m[1]),
);
// The worker itself and its runtime are fetched on the first visit too.
for (const file of files(DIST)) {
  const name = relative(DIST, file);
  if (/^(sw|workbox-[^/]+)\.js$/.test(name)) precached.add(name);
}

for (const file of files(DIST)) {
  const name = relative(DIST, file);
  if (file.endsWith('.map') || !precached.has(name)) continue;
  const size = transferSize(file);
  totals[category(name)] += size;
  totals.total += size;
}

const rows: { category: string; size: string; budget: string; ok: string }[] = (
  Object.keys(BUDGET) as (keyof typeof BUDGET)[]
).map((key) => ({
  category: key,
  size: `${(totals[key] / KB).toFixed(1)} KB`,
  budget: `${(BUDGET[key] / KB).toFixed(0)} KB`,
  ok: totals[key] <= BUDGET[key] ? 'yes' : 'NO',
}));
console.table(rows);

console.log('First visit (precached), above. Per lesson, cached when opened:');

// A built asset is `<art id>-<hash>.<ext>`; a lesson's media are the art IDs its structure names.
const assets = files(join(DIST, 'assets')).map((file) => ({
  id: relative(join(DIST, 'assets'), file).replace(/-[\w-]{8}\.\w+$/, ''),
  file,
}));
const { missions } = await import('../src/content/missions/index.ts');
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}
const lessonRows = missions.map((mission) => {
  const ids = new Set(strings(mission));
  const size = assets
    .filter((a) => ids.has(a.id) && !precached.has(relative(DIST, a.file)))
    .reduce((sum, a) => sum + transferSize(a.file), 0);
  return {
    category: `lesson ${mission.id}`,
    size: `${(size / KB).toFixed(1)} KB`,
    budget: `${(LESSON_BUDGET / KB).toFixed(0)} KB`,
    ok: size <= LESSON_BUDGET ? 'yes' : 'NO',
  };
});
console.table(lessonRows);
rows.push(...lessonRows);

const over = rows.filter((r) => r.ok === 'NO');
if (over.length > 0) {
  console.error(`Size budget exceeded: ${over.map((r) => r.category).join(', ')}`);
  process.exit(1);
}
