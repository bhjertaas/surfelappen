import { describe, expect, it } from 'vitest';
import { findTheImpostor } from '../../content/missions/find-the-impostor/structure.ts';
import type { LinkInspectRun } from '../../progress/schema.ts';
import { emptyLinkInspectRun, linkInspectCurrentStep, linkInspectSequence } from './flow.ts';

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
