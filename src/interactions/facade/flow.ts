import type { FacadeMission, StepId } from '../../content/types.ts';
import type { FacadeRun } from '../../progress/schema.ts';

/** Pure flow logic for facade missions: steps are done in order. */

export function emptyFacadeRun(): FacadeRun {
  return { interaction: 'facade', done: [] };
}

export function facadeSequence(mission: FacadeMission): StepId[] {
  return mission.steps.map((s) => s.id);
}

export function facadeCurrentStep(mission: FacadeMission, run: FacadeRun): StepId | 'done' {
  return facadeSequence(mission).find((id) => !run.done.includes(id)) ?? 'done';
}

export function completeFacadeStep(run: FacadeRun, stepId: StepId): FacadeRun {
  return run.done.includes(stepId) ? run : { ...run, done: [...run.done, stepId] };
}
