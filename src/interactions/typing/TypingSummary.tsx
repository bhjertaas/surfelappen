import { format, percent } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import type { SummaryDetailsProps } from '../types.ts';

/** The final line's accuracy on the summary. */
export function TypingSummary({ run }: SummaryDetailsProps) {
  const { m, locale } = useI18n();
  if (run.interaction !== 'typing' || run.finalAccuracy === undefined) return null;
  return (
    <p>{format(m.typing.finalScore, { accuracy: percent(locale, run.finalAccuracy / 100) })}</p>
  );
}
