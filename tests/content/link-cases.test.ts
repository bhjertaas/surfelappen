import { getDomain } from 'tldts';
import { describe, expect, it } from 'vitest';
import { missions } from '../../src/content/missions/index.ts';
import type { LinkCase, OptionId } from '../../src/content/types.ts';
import { linkCases, linkInspectMissions } from './helpers.ts';

/** Appendix A: option A is the familiar site, B another site, C "can't tell". */
function correctOptionFor(c: LinkCase): OptionId {
  return c.verdict === 'genuine' ? 'a' : 'b';
}

for (const mission of linkInspectMissions(missions)) {
  describe(`${mission.id} link cases`, () => {
    for (const c of linkCases(mission)) {
      const where = `${mission.id}/${c.id}`;

      describe(c.id, () => {
        it('has an https URL whose hostname is expectedHost', () => {
          const url = new URL(c.url);
          expect(url.protocol, `${where}: url protocol`).toBe('https:');
          expect(url.hostname, `${where}: expectedHost`).toBe(c.expectedHost);
        });

        it('has the real site (Public Suffix List) as expectedSite', () => {
          expect(getDomain(c.url), `${where}: expectedSite`).toBe(c.expectedSite);
          expect(
            c.expectedHost === c.expectedSite || c.expectedHost.endsWith(`.${c.expectedSite}`),
            `${where}: expectedHost must be expectedSite or a subdomain of it`,
          ).toBe(true);
        });

        it('has a verdict consistent with the site it claims to be', () => {
          if (c.claimedSite === undefined) return;
          const genuine = c.claimedSite === c.expectedSite;
          expect(c.verdict, `${where}: verdict vs claimedSite ${c.claimedSite}`).toBe(
            genuine ? 'genuine' : 'impostor',
          );
        });

        it('has link text that is a plausible .example address', () => {
          const text = /^[a-z]+:\/\//.test(c.linkText) ? c.linkText : `https://${c.linkText}`;
          expect(new URL(text).hostname, `${where}: linkText host`).toMatch(/\.example$/);
          if (c.pattern !== 'link-text-mismatch') {
            expect(c.linkText, `${where}: linkText differs from url without that pattern`).toBe(
              c.url,
            );
          }
        });

        it('marks the option matching its verdict as correct', () => {
          const correct = c.options.filter((o) => o.correct).map((o) => o.id);
          expect(correct, `${where}: correct option`).toEqual([correctOptionFor(c)]);
        });

        it('has backupFor exactly when it is a transfer backup', () => {
          expect(c.backupFor !== undefined, `${where}: backupFor`).toBe(
            c.role === 'transfer-backup',
          );
        });
      });
    }

    it('has exactly three options a, b, c with one correct, on every case and choice', () => {
      for (const step of mission.steps) {
        if (step.kind === 'info') continue;
        const where = `${mission.id}/${step.id}`;
        expect(
          step.options.map((o) => o.id),
          `${where}: options`,
        ).toEqual(['a', 'b', 'c']);
        expect(step.options.filter((o) => o.correct).length, `${where}: correct options`).toBe(1);
      }
    });

    it('has one backup per transfer case, with the same pattern and verdict', () => {
      const cases = linkCases(mission);
      const transfers = cases.filter((c) => c.role === 'transfer');
      const backups = cases.filter((c) => c.role === 'transfer-backup');
      expect(transfers.length, `${mission.id}: transfer cases`).toBeGreaterThan(0);
      for (const t of transfers) {
        const mine = backups.filter((b) => b.backupFor === t.id);
        expect(mine.length, `${mission.id}/${t.id}: number of backups`).toBe(1);
        const [backup] = mine;
        expect(backup?.pattern, `${mission.id}/${backup?.id}: pattern`).toBe(t.pattern);
        expect(backup?.verdict, `${mission.id}/${backup?.id}: verdict`).toBe(t.verdict);
      }
      for (const b of backups) {
        expect(
          transfers.some((t) => t.id === b.backupFor),
          `${mission.id}/${b.id}: backupFor "${b.backupFor}" is not a transfer case`,
        ).toBe(true);
      }
    });

    it('never reuses a URL, so transfer and backup cases are unseen', () => {
      const urls = linkCases(mission).map((c) => c.url);
      expect(new Set(urls).size, `${mission.id}: duplicate URLs`).toBe(urls.length);
    });
  });
}
