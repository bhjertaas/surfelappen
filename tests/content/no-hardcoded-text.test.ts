import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guard for the convention "no player-facing text in components" (FR-08).
 * A heuristic: flags letters between JSX tags. Text belongs in locale or content files.
 */
function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => join(dir, f));
}

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

const JSX_TEXT = />\s*([A-Za-zÆØÅæøå][^<>{}]*?)\s*</g;

describe('components', () => {
  for (const file of tsxFiles('src')) {
    it(`${file} has no hard-coded text between JSX tags`, () => {
      const found = [...stripComments(readFileSync(file, 'utf8')).matchAll(JSX_TEXT)].map(
        (m) => m[1],
      );
      expect(found, `${file}: move this text to a locale or content file`).toEqual([]);
    });
  }
});
