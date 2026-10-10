import { afterEach, describe, expect, it } from 'vitest';
import { findTheImpostorNb } from '../content/missions/find-the-impostor/text.nb.ts';
import { missionText, missionTextVariants } from '../content/missions/texts.ts';
import { buildingOrder, buildings, buildingsFor } from '../content/town.ts';
import { load } from '../progress/migrations.ts';
import { emptyProgress } from '../progress/schema.ts';
import { audienceOf, setAudience } from '../progress/selectors.ts';
import { i18nFor, messageVariants } from './i18n.ts';
import { nb } from './locales/nb.ts';

afterEach(() => {
  for (const key of Object.keys(missionTextVariants)) delete missionTextVariants[key as 'nb'];
  for (const key of Object.keys(messageVariants)) delete messageVariants[key as 'nb'];
  for (const key of Object.keys(buildingOrder)) delete buildingOrder[key as 'teen'];
});

describe('audience variants', () => {
  it('fall back to the base (adult) text', () => {
    expect(missionText('nb', 'teen', 'find-the-impostor')).toBe(findTheImpostorNb);
    expect(i18nFor('nb', 'child').m).toBe(nb);
  });

  it('use a variant when one exists', () => {
    const teen = { ...findTheImpostorNb, intro: ['Yo.'] };
    missionTextVariants.nb = { teen: { 'find-the-impostor': teen } };
    expect(missionText('nb', 'teen', 'find-the-impostor')).toBe(teen);
    expect(missionText('nb', 'adult', 'find-the-impostor')).toBe(findTheImpostorNb);

    const teenUi = { ...nb, town: { ...nb.town, intro: 'Velg et sted.' } };
    messageVariants.nb = { teen: teenUi };
    expect(i18nFor('nb', 'teen').m.town.intro).toBe('Velg et sted.');
  });

  it('reorder buildings without hiding any', () => {
    expect(buildingsFor('teen')).toBe(buildings);
    buildingOrder.teen = ['square', 'post-office'];
    expect(buildingsFor('teen').map((b) => b.id)).toEqual([
      'square',
      'post-office',
      'keyboard-hall',
      'library',
      'licence-office',
    ]);
  });

  it('are stored with progress, and unknown values are dropped', () => {
    expect(audienceOf(emptyProgress())).toBe('adult');
    const p = setAudience(emptyProgress(), 'teen');
    expect(audienceOf(p)).toBe('teen');
    expect(load(JSON.stringify(p))).toEqual({ kind: 'ok', progress: p });
    const odd = load(JSON.stringify({ ...emptyProgress(), audience: 'pensioner' }));
    expect(odd).toEqual({ kind: 'ok', progress: emptyProgress() });
  });
});
