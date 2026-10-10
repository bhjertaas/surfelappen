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

/** Records a finished step; the final step also records its accuracy and wrong keystrokes. */
export function completeTypingStep(
  run: TypingRun,
  stepId: StepId,
  final?: { accuracy: number; errors: number },
): TypingRun {
  if (run.done.includes(stepId)) return run;
  return {
    ...run,
    done: [...run.done, stepId],
    ...(final ? { finalAccuracy: final.accuracy, finalErrors: final.errors } : {}),
  };
}

/** The player accepted the layout hint: match by key position from now on (saved at once). */
export function usePositional(run: TypingRun): TypingRun {
  return run.positional ? run : { ...run, positional: true };
}
