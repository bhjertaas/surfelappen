import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import type { SummaryDetailsProps } from '../types.ts';
import { firstTryScore } from './flow.ts';

/** The private first-try score on the summary (PRD Mission 1 "Completion"). */
export function LinkInspectSummary({ mission, run }: SummaryDetailsProps) {
  const { m } = useI18n();
  if (mission.interaction !== 'link-inspect' || run.interaction !== 'link-inspect') return null;
  const score = firstTryScore(mission, run);
  if (score.total === 0) return null;
  return (
    <p>
      {format(m.linkInspect.firstTry, score)}{' '}
      <span class="muted">{m.linkInspect.firstTryNote}</span>
    </p>
  );
}
