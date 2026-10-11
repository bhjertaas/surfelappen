import type { Locale } from '../../i18n/format.ts';
import type { Audience, MissionId } from '../types.ts';
import { findTheImpostorNb } from './find-the-impostor/text.nb.ts';
import { howTheNetWorksNb } from './how-the-net-works/text.nb.ts';
import { perfectLifeNb } from './perfect-life/text.nb.ts';
import { tenFingersNb } from './ten-fingers/text.nb.ts';
import type { MissionText } from './text-types.ts';

/**
 * Mission text by locale. The base text is written for adults (the default
 * audience). Content tests check every mission has text in every locale.
 */
export const missionTexts: Record<Locale, Record<MissionId, MissionText>> = {
  nb: {
    'how-the-net-works': howTheNetWorksNb,
    'find-the-impostor': findTheImpostorNb,
    'ten-fingers': tenFingersNb,
    'perfect-life': perfectLifeNb,
  },
};

/**
 * Optional wording for other audiences. Each entry is a complete MissionText,
 * usually written as `{ ...findTheImpostorNb, intro: [...] }`, so anything not
 * rewritten falls back to the adult text. Empty until audience variants are
 * written (PRD "Later").
 */
export const missionTextVariants: Partial<
  Record<Locale, Partial<Record<Audience, Partial<Record<MissionId, MissionText>>>>>
> = {};

export function missionText(
  locale: Locale,
  audience: Audience,
  missionId: MissionId,
): MissionText | undefined {
  return missionTextVariants[locale]?.[audience]?.[missionId] ?? missionTexts[locale][missionId];
}

/** Every mission text that exists, base and variants, for content tests. */
export function allMissionTexts(): {
  locale: Locale;
  audience: Audience | 'base';
  missionId: MissionId;
  text: MissionText;
}[] {
  const result: {
    locale: Locale;
    audience: Audience | 'base';
    missionId: MissionId;
    text: MissionText;
  }[] = [];
  for (const [locale, byMission] of Object.entries(missionTexts) as [
    Locale,
    Record<MissionId, MissionText>,
  ][]) {
    for (const [missionId, text] of Object.entries(byMission))
      result.push({ locale, audience: 'base', missionId, text });
    for (const [audience, variants] of Object.entries(missionTextVariants[locale] ?? {}) as [
      Audience,
      Partial<Record<MissionId, MissionText>>,
    ][]) {
      for (const [missionId, text] of Object.entries(variants)) {
        if (text) result.push({ locale, audience, missionId, text });
      }
    }
  }
  return result;
}
