import type { RumourMission, StepId } from '../../content/types.ts';
import type { RumourRun } from '../../progress/schema.ts';

/** Pure flow logic for rumour missions (Ryktebørsen): steps are done in order. */

export function emptyRumourRun(): RumourRun {
  return { interaction: 'rumour', done: [] };
}

export function rumourSequence(mission: RumourMission): StepId[] {
  return mission.steps.map((s) => s.id);
}

export function rumourCurrentStep(mission: RumourMission, run: RumourRun): StepId | 'done' {
  return rumourSequence(mission).find((id) => !run.done.includes(id)) ?? 'done';
}

export function completeRumourStep(run: RumourRun, stepId: StepId): RumourRun {
  return run.done.includes(stepId) ? run : { ...run, done: [...run.done, stepId] };
}
