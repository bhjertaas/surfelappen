import type { ComposeText, SortText } from '../../content/missions/text-types.ts';
import type { StepViewProps } from '../types.ts';
import { ComposeView } from './ComposeView.tsx';
import { SortView } from './SortView.tsx';

/** Routes a facade step to its view. */
export function FacadeStep({ mission, text, stepId, run, advance }: StepViewProps) {
  if (mission.interaction !== 'facade' || run.interaction !== 'facade') return null;
  const step = mission.steps.find((s) => s.id === stepId);
  const stepText = text.steps?.[stepId];
  if (!step || !stepText) return null;
  if (step.kind === 'sort') {
    return (
      <SortView
        key={step.id}
        step={step}
        text={stepText as SortText}
        guide={mission.guide}
        guideName={text.character}
        run={run}
        advance={advance}
      />
    );
  }
  return (
    <ComposeView
      key={step.id}
      step={step}
      text={stepText as ComposeText}
      guide={mission.guide}
      guideName={text.character}
      run={run}
      advance={advance}
    />
  );
}

/** Nothing extra on the summary yet. */
export function FacadeSummary() {
  return null;
}
