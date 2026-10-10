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
