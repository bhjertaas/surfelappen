import type { CaseText, ChoiceText, InfoText } from '../../content/missions/text-types.ts';
import type { LinkCase } from '../../content/types.ts';
import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import type { StepViewProps } from '../types.ts';
import { CaseView } from './CaseView.tsx';
import { ChoiceView } from './ChoiceView.tsx';
import { InfoView } from './InfoView.tsx';

/** Routes a link-inspect step to its view, with "Sak 3 av 6"-style progress. */
export function LinkInspectStep({ mission, text, stepId, run, save, advance }: StepViewProps) {
  const { m } = useI18n();
  if (mission.interaction !== 'link-inspect' || run.interaction !== 'link-inspect') return null;
  const step = mission.steps.find((s) => s.id === stepId);
  const stepText = text.steps?.[stepId];
  if (!step || !stepText) return null;

  const cases = mission.steps.filter((s): s is LinkCase => s.kind === 'case');
  let progress: string | null = null;
  if (step.kind === 'case') {
    const sameRole = cases.filter((c) => c.role === step.role);
    const position = { current: sameRole.indexOf(step) + 1, total: sameRole.length };
    progress =
      step.role === 'main'
        ? format(m.linkInspect.caseProgress, position)
        : step.role === 'transfer'
          ? format(m.linkInspect.transferProgress, position)
          : m.linkInspect.backupProgress;
  }

  return (
    <>
      {progress && <p class="step-progress">{progress}</p>}
      {step.kind === 'case' && (
        <CaseView step={step} text={stepText as CaseText} run={run} save={save} advance={advance} />
      )}
      {step.kind === 'choice' && (
        <ChoiceView step={step} text={stepText as ChoiceText} run={run} advance={advance} />
      )}
      {step.kind === 'info' && (
        <InfoView step={step} text={stepText as InfoText} run={run} advance={advance} />
      )}
    </>
  );
}
