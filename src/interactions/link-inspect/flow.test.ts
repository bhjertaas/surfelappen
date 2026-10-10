import { describe, expect, it } from 'vitest';
import { findTheImpostor } from '../../content/missions/find-the-impostor/structure.ts';
import type { LinkInspectRun } from '../../progress/schema.ts';
import {
  emptyLinkInspectRun,
  firstTryScore,
  linkInspectCurrentStep,
  linkInspectSequence,
  missTransfer,
  solveStep,
  transferFirstTry,
} from './flow.ts';

const MAIN = [
  'case-1',
  'case-2',
  'case-3',
  'case-4',
  'case-5',
  'case-6',
  'habit',
  'habit-tip',
  'transfer-intro',
];
const run = (patch: Partial<LinkInspectRun>): LinkInspectRun => ({
  ...emptyLinkInspectRun(),
  ...patch,
});

describe('linkInspectSequence', () => {
  it('leaves backups out when no transfer case was missed', () => {
    expect(linkInspectSequence(findTheImpostor, emptyLinkInspectRun())).toEqual([
      ...MAIN,
      'transfer-1',
      'transfer-2',
    ]);
  });

  it('puts a backup right after its missed transfer case', () => {
    expect(linkInspectSequence(findTheImpostor, run({ missedTransfer: ['transfer-1'] }))).toEqual([
      ...MAIN,
      'transfer-1',
      'transfer-1-backup',
      'transfer-2',
    ]);
    expect(
      linkInspectSequence(findTheImpostor, run({ missedTransfer: ['transfer-2', 'transfer-1'] })),
    ).toEqual([...MAIN, 'transfer-1', 'transfer-1-backup', 'transfer-2', 'transfer-2-backup']);
  });
});

describe('linkInspectCurrentStep', () => {
  it('starts at the first case', () => {
    expect(linkInspectCurrentStep(findTheImpostor, emptyLinkInspectRun())).toBe('case-1');
  });

  it('resumes at the first unfinished step', () => {
    expect(linkInspectCurrentStep(findTheImpostor, run({ solved: ['case-1', 'case-2'] }))).toBe(
      'case-3',
    );
  });

  it('requires the backup after a missed transfer case', () => {
    const r = run({ solved: [...MAIN, 'transfer-1'], missedTransfer: ['transfer-1'] });
    expect(linkInspectCurrentStep(findTheImpostor, r)).toBe('transfer-1-backup');
  });

  it('is done when every step in the sequence is solved', () => {
    expect(
      linkInspectCurrentStep(
        findTheImpostor,
        run({ solved: [...MAIN, 'transfer-1', 'transfer-2'] }),
      ),
    ).toBe('done');
  });
});

describe('solveStep and missTransfer', () => {
  it('records a solved step once, with first try only when earned', () => {
    let r = solveStep(emptyLinkInspectRun(), 'case-1', { firstTry: true });
    r = solveStep(r, 'case-2');
    expect(r.solved).toEqual(['case-1', 'case-2']);
    expect(r.firstTry).toEqual(['case-1']);
    expect(solveStep(r, 'case-1', { firstTry: true })).toBe(r);
  });

  it('records a missed transfer case once', () => {
    const r = missTransfer(emptyLinkInspectRun(), 'transfer-2');
    expect(r.missedTransfer).toEqual(['transfer-2']);
    expect(missTransfer(r, 'transfer-2')).toBe(r);
  });
});

describe('firstTryScore and transferFirstTry', () => {
  it('counts only main cases', () => {
    const r = run({ firstTry: ['case-1', 'case-3', 'transfer-1'] });
    expect(firstTryScore(findTheImpostor, r)).toEqual({ correct: 2, total: 6 });
  });

  it('needs both original transfer cases right first time', () => {
    expect(transferFirstTry(findTheImpostor, run({ firstTry: ['transfer-1'] }))).toBe(false);
    expect(transferFirstTry(findTheImpostor, run({ firstTry: ['transfer-1', 'transfer-2'] }))).toBe(
      true,
    );
  });
});
