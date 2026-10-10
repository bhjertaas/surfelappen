import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { MissionText } from '../content/missions/text-types.ts';
import { missionText } from '../content/missions/texts.ts';
import { type Audience, DEFAULT_AUDIENCE, type MissionId } from '../content/types.ts';
import type { Locale } from './format.ts';
import { type Messages, nb } from './locales/nb.ts';

/** The active locale, audience and UI strings. Only `nb` exists; `en` will be loaded with import(). */
export interface I18n {
  readonly locale: Locale;
  readonly audience: Audience;
  readonly m: Messages;
}

const messages: Record<Locale, Messages> = { nb };

/**
 * UI wording for other audiences, each a complete Messages object, usually
 * `{ ...nb, town: { ...nb.town, intro: '…' } }`. Falls back to the base strings.
 */
export const messageVariants: Partial<Record<Locale, Partial<Record<Audience, Messages>>>> = {};

export function i18nFor(locale: Locale, audience: Audience): I18n {
  return { locale, audience, m: messageVariants[locale]?.[audience] ?? messages[locale] };
}

export const I18nContext = createContext<I18n>(i18nFor('nb', DEFAULT_AUDIENCE));

export function useI18n(): I18n {
  return useContext(I18nContext);
}

/** The mission's text in the active locale and audience. */
export function useMissionText(missionId: MissionId): MissionText | undefined {
  const { locale, audience } = useI18n();
  return missionText(locale, audience, missionId);
}
