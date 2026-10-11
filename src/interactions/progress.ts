import type { MissionStructure, StepId } from '../content/types.ts';
import type { Run } from '../progress/schema.ts';
import { emptyFacadeRun, facadeCurrentStep, facadeSequence } from './facade/flow.ts';
import {
  emptyLinkInspectRun,
  linkInspectCurrentStep,
  linkInspectSequence,
} from './link-inspect/flow.ts';
import { emptyRumourRun, rumourCurrentStep, rumourSequence } from './rumour/flow.ts';
import { emptyTypingRun, typingCurrentStep, typingSequence } from './typing/flow.ts';
import { emptyWebRun, webCurrentStep, webSequence } from './web/flow.ts';

/**
 * Dispatches progress questions to the mission's interaction type. A run whose
 * interaction doesn't match the mission (content changed between releases) is
 * treated as a fresh run.
 */

export function emptyRun(mission: MissionStructure): Run {
  switch (mission.interaction) {
    case 'link-inspect':
      return emptyLinkInspectRun();
    case 'typing':
      return emptyTypingRun();
    case 'facade':
      return emptyFacadeRun();
    case 'web':
      return emptyWebRun();
    case 'rumour':
      return emptyRumourRun();
  }
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
  if (mission.interaction === 'facade') return facadeSequence(mission);
  if (mission.interaction === 'web') return webSequence(mission);
  if (mission.interaction === 'rumour') return rumourSequence(mission);
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
  if (mission.interaction === 'facade' && r.interaction === 'facade') {
    return facadeCurrentStep(mission, r);
  }
  if (mission.interaction === 'web' && r.interaction === 'web') {
    return webCurrentStep(mission, r);
  }
  if (mission.interaction === 'rumour' && r.interaction === 'rumour') {
    return rumourCurrentStep(mission, r);
  }
  return 'done';
}

/**
 * The step before the current one, reopened: it's no longer marked done, so the player
 * goes back to its start. Scores already earned (first try, flawless) are kept.
 * Undefined on the first step.
 */
export function reopenPrevious(
  mission: MissionStructure,
  run: Run | undefined,
): { run: Run; stepId: StepId } | undefined {
  const r = matchingRun(mission, run);
  const sequence = stepSequence(mission, r);
  const current = currentStep(mission, r);
  const index = current === 'done' ? sequence.length : sequence.indexOf(current);
  const stepId = sequence[index - 1];
  if (stepId === undefined) return undefined;
  const without = (ids: readonly StepId[]) => ids.filter((id) => id !== stepId);
  return {
    stepId,
    run:
      r.interaction === 'link-inspect'
        ? { ...r, solved: without(r.solved) }
        : { ...r, done: without(r.done) },
  };
}
