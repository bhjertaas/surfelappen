import type {
  AddressText,
  BrowserText,
  ClassifyText,
  JourneyText,
  TimelineText,
} from '../../content/missions/text-types.ts';
import type { StepViewProps } from '../types.ts';
import { AddressView } from './AddressView.tsx';
import { BrowserView } from './BrowserView.tsx';
import { ClassifyView } from './ClassifyView.tsx';
import { JourneyView } from './JourneyView.tsx';
import { TimelineView } from './TimelineView.tsx';

/** Routes a web step (Kafé Alfakrøll) to its view. */
export function WebStep({ mission, text, stepId, run, advance }: StepViewProps) {
  if (mission.interaction !== 'web' || run.interaction !== 'web') return null;
  const step = mission.steps.find((s) => s.id === stepId);
  const stepText = text.steps?.[stepId];
  if (!step || !stepText) return null;
  const common = { guide: mission.guide, guideName: text.character, run, advance };
  switch (step.kind) {
    case 'classify':
      return <ClassifyView key={step.id} step={step} text={stepText as ClassifyText} {...common} />;
    case 'browser':
      return <BrowserView key={step.id} step={step} text={stepText as BrowserText} {...common} />;
    case 'address':
      return <AddressView key={step.id} step={step} text={stepText as AddressText} {...common} />;
    case 'journey':
      return <JourneyView key={step.id} step={step} text={stepText as JourneyText} {...common} />;
    case 'timeline':
      return <TimelineView key={step.id} step={step} text={stepText as TimelineText} {...common} />;
  }
}

/** Nothing extra on the summary. */
export function WebSummary() {
  return null;
}
