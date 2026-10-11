import { describe, expect, it } from 'vitest';
import type { Spot } from '../../content/types.ts';
import { canJudge, cluesFound, FRESH, judge, retry, search, tap } from './inspect.ts';

const spots: Spot[] = [
  { id: 'fin', x: 0, y: 0, w: 10, h: 10, clue: true },
  { id: 'hand', x: 0, y: 0, w: 10, h: 10, clue: true },
  { id: 'sky', x: 0, y: 0, w: 10, h: 10, clue: false },
];

describe('checking a picture', () => {
  it('needs the search and every clue before a verdict', () => {
    let check = tap(tap(FRESH, 'fin'), 'sky');
    expect(cluesFound(spots, check)).toBe(1);
    expect(canJudge(spots, check)).toBe(false);
    check = tap(check, 'hand');
    expect(canJudge(spots, check)).toBe(false);
    check = search(check);
    expect(canJudge(spots, check)).toBe(true);
  });

  it('counts a spot once and shows the last one tapped', () => {
    const check = tap(tap(tap(FRESH, 'fin'), 'sky'), 'fin');
    expect(check.tapped).toEqual(['fin', 'sky']);
    expect(check.showing).toBe('fin');
  });

  it('lets a wrong verdict be tried again', () => {
    const check = judge(search(FRESH), 'real');
    expect(check.verdict).toBe('real');
    expect(retry(check).verdict).toBeNull();
  });

  it('needs only the search when there are no clues', () => {
    expect(canJudge([], search(FRESH))).toBe(true);
  });
});
