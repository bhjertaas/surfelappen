import type { ComponentType } from 'preact';
import type { InteractionId } from '../content/types.ts';
import { FacadeStep, FacadeSummary } from './facade/FacadeStep.tsx';
import { LinkInspectStep } from './link-inspect/LinkInspectStep.tsx';
import { LinkInspectSummary } from './link-inspect/LinkInspectSummary.tsx';
import type { StepViewProps, SummaryDetailsProps } from './types.ts';
import { TypingStep } from './typing/TypingStep.tsx';
import { TypingSummary } from './typing/TypingSummary.tsx';

/** The views of each interaction type. A new type adds one entry (architecture "Adding things"). */
export interface InteractionViews {
  readonly StepView: ComponentType<StepViewProps>;
  readonly SummaryDetails: ComponentType<SummaryDetailsProps>;
}

export const interactionViews: Record<InteractionId, InteractionViews> = {
  'link-inspect': { StepView: LinkInspectStep, SummaryDetails: LinkInspectSummary },
  typing: { StepView: TypingStep, SummaryDetails: TypingSummary },
  facade: { StepView: FacadeStep, SummaryDetails: FacadeSummary },
};
