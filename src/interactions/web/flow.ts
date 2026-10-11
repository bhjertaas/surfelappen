import type { StepId, WebMission } from '../../content/types.ts';
import type { WebRun } from '../../progress/schema.ts';

/** Pure flow logic for web missions (Kafé Krøllalfa): steps are done in order. */

export function emptyWebRun(): WebRun {
  return { interaction: 'web', done: [] };
}

export function webSequence(mission: WebMission): StepId[] {
  return mission.steps.map((s) => s.id);
}

export function webCurrentStep(mission: WebMission, run: WebRun): StepId | 'done' {
  return webSequence(mission).find((id) => !run.done.includes(id)) ?? 'done';
}

export function completeWebStep(run: WebRun, stepId: StepId): WebRun {
  return run.done.includes(stepId) ? run : { ...run, done: [...run.done, stepId] };
}
