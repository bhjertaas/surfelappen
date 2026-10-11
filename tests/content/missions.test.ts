import { describe, expect, it } from 'vitest';
import { missions as typed } from '../../src/content/missions/index.ts';
import type { MissionStructure } from '../../src/content/types.ts';
import { domainsIn, stringsIn } from './helpers.ts';

const missions = typed as readonly MissionStructure[];

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe('all missions', () => {
  it('have unique, slug-shaped IDs', () => {
    const ids = missions.map((m) => m.id);
    expect(new Set(ids).size, `duplicate mission IDs in ${ids.join(', ')}`).toBe(ids.length);
    for (const id of ids) expect(id, `mission ID "${id}"`).toMatch(SLUG);
  });

  for (const mission of missions) {
    describe(mission.id, () => {
      it('has unique, slug-shaped step IDs, none called "done" or "more"', () => {
        const ids = mission.steps.map((s) => s.id);
        expect(new Set(ids).size, `${mission.id}: duplicate step IDs`).toBe(ids.length);
        for (const id of ids) {
          expect(id, `${mission.id}: step ID "${id}"`).toMatch(SLUG);
          expect(id, `${mission.id}: "done" is reserved for the summary route`).not.toBe('done');
          expect(id, `${mission.id}: "more" is reserved for further reading`).not.toBe('more');
        }
      });

      it('only uses .example domains (sources excepted)', () => {
        for (const { path, value } of stringsIn(mission, ['sources', 'further'])) {
          for (const domain of domainsIn(value)) {
            expect(domain, `${mission.id}.${path}: "${domain}" must end in .example`).toMatch(
              /\.example$/,
            );
          }
        }
      });

      it('lists sources and further reading as https URLs', () => {
        for (const source of [...mission.sources, ...(mission.further ?? [])]) {
          expect(new URL(source.url).protocol, `${mission.id}: source ${source.url}`).toBe(
            'https:',
          );
        }
      });
    });
  }
});

describe('art', () => {
  it('exists for every sticker, building and mission guide', async () => {
    const { artFor } = await import('../../src/content/art.ts');
    const { stickers } = await import('../../src/content/stickers.ts');
    const { buildings } = await import('../../src/content/town.ts');
    for (const s of stickers)
      expect(artFor(s.image), `sticker ${s.id}: art "${s.image}"`).toBeDefined();
    for (const b of buildings)
      expect(artFor(b.image), `building ${b.id}: art "${b.image}"`).toBeDefined();
    for (const m of missions)
      expect(artFor(m.guide), `mission ${m.id}: guide "${m.guide}"`).toBeDefined();
  });
});
