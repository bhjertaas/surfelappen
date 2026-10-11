import { describe, expect, it } from 'vitest';
import type { ClassifyStep } from '../../content/types.ts';
import { choose, isFinished, isRight, next, retry, START, sortedInto } from './classify.ts';

const step: ClassifyStep = {
  kind: 'classify',
  id: 'x',
  cards: [
    { id: 'chrome', bin: 'browser' },
    { id: 'google', bin: 'search' },
  ],
};

describe('classify', () => {
  it('marks a wrong bin as missed, lets you retry, and places the card when right', () => {
    let s = choose(step, START, 'search');
    expect(isRight(step, s)).toBe(false);
    expect(s.missed).toEqual(['chrome']);
    expect(sortedInto(step, s, 'browser')).toEqual([]);
    s = choose(step, retry(s), 'browser');
    expect(isRight(step, s)).toBe(true);
    expect(sortedInto(step, s, 'browser')).toEqual(['chrome']);
    s = choose(step, next(s), 'search');
    expect(sortedInto(step, s, 'search')).toEqual(['google']);
    expect(isFinished(step, next(s))).toBe(true);
  });

  it('ignores more answers once right', () => {
    const s = choose(step, START, 'browser');
    expect(choose(step, s, 'site')).toBe(s);
  });
});
