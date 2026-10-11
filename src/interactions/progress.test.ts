import { describe, expect, it } from 'vitest';
import { findMission } from '../content/missions/index.ts';
import type { MissionStructure } from '../content/types.ts';
import { currentStep, emptyRun, reopenPrevious, stepSequence } from './progress.ts';

function mission(id: string): MissionStructure {
  const found = findMission(id);
  if (!found) throw new Error(id);
  return found;
}

describe('reopenPrevious', () => {
  const web = mission('how-the-net-works');
  const [first, second, third] = stepSequence(web, undefined);

  it('has nothing before the first step', () => {
    expect(reopenPrevious(web, emptyRun(web))).toBeUndefined();
  });

  it('reopens the step before the current one', () => {
    const run = { interaction: 'web' as const, done: [first, second] as string[] };
    const back = reopenPrevious(web, run);
    expect(back?.stepId).toBe(second);
    expect(currentStep(web, back?.run)).toBe(second);
    expect(third).toBeDefined();
  });

  it('keeps first-try scores on link-inspect runs', () => {
    const phishing = mission('find-the-impostor');
    const [a, b] = stepSequence(phishing, undefined);
    const run = {
      interaction: 'link-inspect' as const,
      solved: [a, b] as string[],
      firstTry: [a, b] as string[],
      missedTransfer: [],
    };
    const back = reopenPrevious(phishing, run);
    expect(back?.stepId).toBe(b);
    expect(back?.run).toMatchObject({ solved: [a], firstTry: [a, b] });
  });
});
