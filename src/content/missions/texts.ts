import type { Locale } from '../../i18n/format.ts';
import type { MissionId } from '../types.ts';
import { findTheImpostorNb } from './find-the-impostor/text.nb.ts';
import { tenFingersNb } from './ten-fingers/text.nb.ts';
import type { MissionText } from './text-types.ts';

/** Mission text by locale. Content tests check every mission has text in every locale. */
export const missionTexts: Record<Locale, Record<MissionId, MissionText>> = {
  nb: {
    'find-the-impostor': findTheImpostorNb,
    'ten-fingers': tenFingersNb,
  },
};
