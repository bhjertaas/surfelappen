import type { MissionText } from '../content/missions/text-types.ts';
import type { MissionStructure, StepId } from '../content/types.ts';
import type { Run } from '../progress/schema.ts';

/** What the generic mission shell gives an interaction's step view. */
export interface StepViewProps {
  readonly mission: MissionStructure;
  readonly text: MissionText;
  readonly stepId: StepId;
  readonly run: Run;
  /** Saves the run without leaving the step (e.g. a missed transfer case). */
  readonly save: (run: Run) => void;
  /** Saves the run and moves on to the next step, or the summary. */
  readonly advance: (run: Run) => void;
}

export interface SummaryDetailsProps {
  readonly mission: MissionStructure;
  readonly run: Run;
}
