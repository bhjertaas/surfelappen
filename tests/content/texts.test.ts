import { describe, expect, it } from 'vitest';
import { missions } from '../../src/content/missions/index.ts';
import type {
  CaseText,
  ChoiceText,
  InfoText,
  MissionText,
} from '../../src/content/missions/text-types.ts';
import { missionTexts } from '../../src/content/missions/texts.ts';
import { stickers } from '../../src/content/stickers.ts';
import { buildings } from '../../src/content/town.ts';
import type { MissionStructure } from '../../src/content/types.ts';
import { nb } from '../../src/i18n/locales/nb.ts';
import { isBalanced } from '../../src/i18n/markup.ts';
import { domainsIn, linkCases, linkInspectMissions, stringsIn } from './helpers.ts';

const locales = { nb } as const;
const all = missions as readonly MissionStructure[];

describe('locale files', () => {
  for (const [locale, messages] of Object.entries(locales)) {
    it(`${locale}: all inline markup is balanced`, () => {
      for (const { path, value } of stringsIn(messages, [])) {
        expect(isBalanced(value), `${locale}.${path}: unbalanced * in "${value}"`).toBe(true);
      }
    });

    it(`${locale}: has a name and description for every building`, () => {
      for (const b of buildings) {
        expect(messages.buildings[b.id], `${locale}.buildings.${b.id}`).toBeDefined();
        if (b.status === 'coming-soon') {
          expect(
            messages.buildings[b.id]?.closed,
            `${locale}.buildings.${b.id}.closed`,
          ).toBeTruthy();
        }
      }
    });

    it(`${locale}: has a name and how-to for every sticker`, () => {
      for (const s of stickers) {
        expect(messages.stickers[s.id]?.name, `${locale}.stickers.${s.id}.name`).toBeTruthy();
        expect(messages.stickers[s.id]?.howTo, `${locale}.stickers.${s.id}.howTo`).toBeTruthy();
      }
    });
  }
});

describe('mission texts', () => {
  for (const locale of Object.keys(locales) as (keyof typeof locales)[]) {
    for (const mission of all) {
      const where = `${locale}/${mission.id}`;
      const text: MissionText | undefined = missionTexts[locale][mission.id];

      it(`${where} exists, with balanced markup`, () => {
        expect(text, `${where}: missing text file`).toBeDefined();
        for (const { path, value } of stringsIn(text, [])) {
          expect(isBalanced(value), `${where}.${path}: unbalanced * in "${value}"`).toBe(true);
        }
      });

      if (mission.interaction !== 'link-inspect') continue;

      it(`${where} has text of the right kind for every step`, () => {
        for (const step of mission.steps) {
          const t = text?.steps?.[step.id];
          expect(t, `${where}/${step.id}: missing text`).toBeDefined();
          if (step.kind === 'case')
            expect((t as CaseText).situation, `${where}/${step.id}`).toBeTruthy();
          if (step.kind === 'choice')
            expect((t as ChoiceText).prompt, `${where}/${step.id}`).toBeTruthy();
          if (step.kind === 'info')
            expect((t as InfoText).body.length, `${where}/${step.id}`).toBeGreaterThan(0);
        }
        const extra = Object.keys(text?.steps ?? {}).filter(
          (id) => !mission.steps.some((s) => s.id === id),
        );
        expect(extra, `${where}: text for steps that don't exist`).toEqual([]);
      });
    }
  }
});

describe('domains in case texts', () => {
  for (const mission of linkInspectMissions(all)) {
    for (const c of linkCases(mission)) {
      it(`${mission.id}/${c.id} only mentions its own domains`, () => {
        const linkHost = new URL(
          /^[a-z]+:\/\//.test(c.linkText) ? c.linkText : `https://${c.linkText}`,
        ).hostname;
        const own = new Set([c.expectedHost, c.expectedSite, c.claimedSite, linkHost]);
        for (const locale of Object.keys(locales) as (keyof typeof locales)[]) {
          const text = missionTexts[locale][mission.id]?.steps?.[c.id];
          for (const { path, value } of stringsIn(text, [])) {
            for (const domain of domainsIn(value)) {
              expect(
                own.has(domain),
                `${locale}/${mission.id}/${c.id}.${path}: "${domain}" is not this case's`,
              ).toBe(true);
            }
          }
        }
      });
    }
  }
});
