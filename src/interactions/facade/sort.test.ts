import { describe, expect, it } from 'vitest';
import type { SortStep } from '../../content/types.ts';
import {
  answer,
  firstTryCount,
  isFinished,
  isRight,
  next,
  retry,
  START,
  transferFlawless,
} from './sort.ts';

const step: SortStep = {
  kind: 'sort',
  id: 'ad-hunt',
  posts: [
    { id: 'a', image: 'x', verdict: 'ad', role: 'main' },
    { id: 'b', image: 'x', verdict: 'not-ad', role: 'transfer' },
  ],
};

describe('sort', () => {
  it('a right answer moves on; a wrong one is retried and remembered', () => {
    let s = answer(step, START, 'not-ad');
    expect(isRight(step, s)).toBe(false);
    expect(s.missed).toEqual(['a']);
    s = answer(step, retry(s), 'ad');
    expect(isRight(step, s)).toBe(true);
    s = next(s);
    s = next(answer(step, s, 'not-ad'));
    expect(isFinished(step, s)).toBe(true);
    expect(firstTryCount(step, s)).toBe(1);
    expect(transferFlawless(step, s)).toBe(true);
  });

  it('a missed transfer post loses the flawless mark', () => {
    let s = next(answer(step, START, 'ad'));
    s = answer(step, s, 'ad');
    expect(transferFlawless(step, s)).toBe(false);
  });
});
