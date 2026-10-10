import { describe, expect, it } from 'vitest';
import { missions } from '../../src/content/missions/index.ts';
import { domainsIn, stringsIn } from './helpers.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe('all missions', () => {
  it('have unique, slug-shaped IDs', () => {
    const ids = missions.map((m) => m.id);
    expect(new Set(ids).size, `duplicate mission IDs in ${ids.join(', ')}`).toBe(ids.length);
    for (const id of ids) expect(id, `mission ID "${id}"`).toMatch(SLUG);
  });

  for (const mission of missions) {
    describe(mission.id, () => {
      it('has unique, slug-shaped step IDs, none called "done"', () => {
        const ids = mission.steps.map((s) => s.id);
        expect(new Set(ids).size, `${mission.id}: duplicate step IDs`).toBe(ids.length);
        for (const id of ids) {
          expect(id, `${mission.id}: step ID "${id}"`).toMatch(SLUG);
          expect(id, `${mission.id}: "done" is reserved for the summary route`).not.toBe('done');
        }
      });

      it('only uses .example domains (sources excepted)', () => {
        for (const { path, value } of stringsIn(mission, ['sources'])) {
          for (const domain of domainsIn(value)) {
            expect(domain, `${mission.id}.${path}: "${domain}" must end in .example`).toMatch(
              /\.example$/,
            );
          }
        }
      });

      it('lists sources as https URLs', () => {
        for (const source of mission.sources) {
          expect(new URL(source.url).protocol, `${mission.id}: source ${source.url}`).toBe(
            'https:',
          );
        }
      });
    });
  }
});
