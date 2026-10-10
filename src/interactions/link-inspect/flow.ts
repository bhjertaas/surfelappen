import type { LinkInspectMission, StepId } from '../../content/types.ts';
import type { LinkInspectRun } from '../../progress/schema.ts';

/** Pure flow logic for link-inspect missions (ADR 0013). */

export function emptyLinkInspectRun(): LinkInspectRun {
  return { interaction: 'link-inspect', solved: [], firstTry: [], missedTransfer: [] };
}

/**
 * The steps of this playthrough, in order. Backups are left out unless their
 * transfer case was missed; then they follow it directly.
 */
export function linkInspectSequence(mission: LinkInspectMission, run: LinkInspectRun): StepId[] {
  const sequence: StepId[] = [];
  for (const step of mission.steps) {
    if (step.kind === 'case' && step.role === 'transfer-backup') continue;
    sequence.push(step.id);
    if (step.kind === 'case' && step.role === 'transfer' && run.missedTransfer.includes(step.id)) {
      const backup = mission.steps.find((s) => s.kind === 'case' && s.backupFor === step.id);
      if (backup) sequence.push(backup.id);
    }
  }
  return sequence;
}

export function linkInspectCurrentStep(
  mission: LinkInspectMission,
  run: LinkInspectRun,
): StepId | 'done' {
  return linkInspectSequence(mission, run).find((id) => !run.solved.includes(id)) ?? 'done';
}

/**
 * Records a finished step. `firstTry` counts only for cases answered correctly
 * with no hint and no earlier wrong answer (ADR 0013).
 */
export function solveStep(
  run: LinkInspectRun,
  stepId: StepId,
  options: { firstTry: boolean } = { firstTry: false },
): LinkInspectRun {
  if (run.solved.includes(stepId)) return run;
  return {
    ...run,
    solved: [...run.solved, stepId],
    firstTry: options.firstTry ? [...run.firstTry, stepId] : run.firstTry,
  };
}

/** A transfer case was answered wrongly: its backup becomes due once it's solved. Saved at once. */
export function missTransfer(run: LinkInspectRun, stepId: StepId): LinkInspectRun {
  if (run.missedTransfer.includes(stepId)) return run;
  return { ...run, missedTransfer: [...run.missedTransfer, stepId] };
}

/** Main cases answered right on the first try, for the private score on the summary. */
export function firstTryScore(
  mission: LinkInspectMission,
  run: LinkInspectRun,
): { correct: number; total: number } {
  const main = mission.steps.filter((s) => s.kind === 'case' && s.role === 'main').map((s) => s.id);
  return { correct: main.filter((id) => run.firstTry.includes(id)).length, total: main.length };
}

/** Skarpt øye: every original transfer case right on the first try (no backup needed). */
export function transferFirstTry(mission: LinkInspectMission, run: LinkInspectRun): boolean {
  const transfers = mission.steps.filter((s) => s.kind === 'case' && s.role === 'transfer');
  return transfers.length > 0 && transfers.every((s) => run.firstTry.includes(s.id));
}
