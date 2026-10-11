import type { ChatText, InspectText, TraceText } from '../../content/missions/text-types.ts';
import type { StepViewProps } from '../types.ts';
import { ChatView } from './ChatView.tsx';
import { InspectView } from './InspectView.tsx';
import { TraceView } from './TraceView.tsx';

/** Routes a rumour step (Ryktebørsen) to its view. */
export function RumourStep({ mission, text, stepId, run, advance }: StepViewProps) {
  if (mission.interaction !== 'rumour' || run.interaction !== 'rumour') return null;
  const step = mission.steps.find((s) => s.id === stepId);
  const stepText = text.steps?.[stepId];
  if (!step || !stepText) return null;
  const common = { guide: mission.guide, guideName: text.character, run, advance };
  switch (step.kind) {
    case 'chat':
      return <ChatView key={step.id} step={step} text={stepText as ChatText} {...common} />;
    case 'trace':
      return <TraceView key={step.id} step={step} text={stepText as TraceText} {...common} />;
    case 'inspect':
      return <InspectView key={step.id} step={step} text={stepText as InspectText} {...common} />;
  }
}

/** Nothing extra on the summary. */
export function RumourSummary() {
  return null;
}
