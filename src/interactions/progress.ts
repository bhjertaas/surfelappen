import type { MissionStructure, StepId } from '../content/types.ts';
import type { Run } from '../progress/schema.ts';
import {
  emptyLinkInspectRun,
  linkInspectCurrentStep,
  linkInspectSequence,
} from './link-inspect/flow.ts';
import { emptyTypingRun, typingCurrentStep, typingSequence } from './typing/flow.ts';

/**
 * Dispatches progress questions to the mission's interaction type. A run whose
 * interaction doesn't match the mission (content changed between releases) is
 * treated as a fresh run.
 */

export function emptyRun(mission: MissionStructure): Run {
  return mission.interaction === 'link-inspect' ? emptyLinkInspectRun() : emptyTypingRun();
}

function matchingRun(mission: MissionStructure, run: Run | undefined): Run {
  return run && run.interaction === mission.interaction ? run : emptyRun(mission);
}

export function stepSequence(mission: MissionStructure, run: Run | undefined): StepId[] {
  const r = matchingRun(mission, run);
  if (mission.interaction === 'link-inspect' && r.interaction === 'link-inspect') {
    return linkInspectSequence(mission, r);
  }
  if (mission.interaction === 'typing') return typingSequence(mission);
  return [];
}

export function currentStep(mission: MissionStructure, run: Run | undefined): StepId | 'done' {
  const r = matchingRun(mission, run);
  if (mission.interaction === 'link-inspect' && r.interaction === 'link-inspect') {
    return linkInspectCurrentStep(mission, r);
  }
  if (mission.interaction === 'typing' && r.interaction === 'typing') {
    return typingCurrentStep(mission, r);
  }
  return 'done';
}
