import { getDomain } from 'tldts';
import { describe, expect, it } from 'vitest';
import { FICTIONAL_DOMAINS } from '../../src/content/domains.ts';
import { missions as typed } from '../../src/content/missions/index.ts';
import type { MissionStructure } from '../../src/content/types.ts';
import { domainsIn, stringsIn } from './helpers.ts';

const missions = typed as readonly MissionStructure[];

/**
 * Real domains allowed in a mission's structure, where recognising the real thing is
 * the point (the toy browser, search engines). Never for scam cases.
 */
const TEACHING_DOMAINS: Record<string, readonly string[]> = {
  'how-the-net-works': ['nrk.no', 'google.com', 'bing.com', 'duckduckgo.com', 'ecosia.org'],
  'the-counters': ['yr.no'],
};

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

      it('only uses made-up domains, or its own teaching domains (sources excepted)', () => {
        const allowed = new Set<string>([
          ...FICTIONAL_DOMAINS,
          ...(TEACHING_DOMAINS[mission.id] ?? []),
        ]);
        for (const { path, value } of stringsIn(mission, ['sources', 'further'])) {
          for (const domain of domainsIn(value)) {
            const site = getDomain(domain) ?? domain;
            expect(
              allowed.has(site),
              `${mission.id}.${path}: "${site}" is not in FICTIONAL_DOMAINS (src/content/domains.ts)`,
            ).toBe(true);
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

  it('exists for every timeline card: picture and narration', async () => {
    const { artFor } = await import('../../src/content/art.ts');
    const { audioFor } = await import('../../src/content/audio.ts');
    for (const m of missions) {
      if (m.interaction !== 'web') continue;
      for (const step of m.steps) {
        if (step.kind !== 'timeline') continue;
        for (const e of step.events) {
          expect(artFor(e.image), `${m.id}/${e.id}: picture "${e.image}"`).toBeDefined();
          expect(audioFor(e.voice), `${m.id}/${e.id}: narration "${e.voice}"`).toBeDefined();
        }
      }
    }
  });
});
