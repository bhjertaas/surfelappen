import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { Locale } from './format.ts';
import { type Messages, nb } from './locales/nb.ts';

/** The active locale and its strings. Only `nb` exists; `en` will be loaded with import(). */
export interface I18n {
  readonly locale: Locale;
  readonly m: Messages;
}

export const I18nContext = createContext<I18n>({ locale: 'nb', m: nb });

export function useI18n(): I18n {
  return useContext(I18nContext);
}
