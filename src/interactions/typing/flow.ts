import type { StepId, TypingMission } from '../../content/types.ts';
import type { TypingRun } from '../../progress/schema.ts';

/** Pure flow logic for typing missions (ADR 0014). */

export function emptyTypingRun(): TypingRun {
  return { interaction: 'typing', done: [], positional: false };
}

export function typingSequence(mission: TypingMission): StepId[] {
  return mission.steps.map((s) => s.id);
}

export function typingCurrentStep(mission: TypingMission, run: TypingRun): StepId | 'done' {
  return typingSequence(mission).find((id) => !run.done.includes(id)) ?? 'done';
}
