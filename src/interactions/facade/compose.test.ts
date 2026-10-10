import { describe, expect, it } from 'vitest';
import type { ComposeStep } from '../../content/types.ts';
import {
  clampFrame,
  cropReady,
  initialFrame,
  likesFor,
  moveFrame,
  NO_POLISH,
  resizeFrame,
  visibleMess,
} from './compose.ts';

const step: ComposeStep = {
  kind: 'compose',
  id: 'make-the-picture',
  image: 'room',
  width: 1000,
  height: 600,
  subject: { x: 450, y: 200, w: 100, h: 150 },
  mess: [
    { id: 'left', rect: { x: 0, y: 0, w: 300, h: 600 } },
    { id: 'right', rect: { x: 700, y: 0, w: 300, h: 600 } },
  ],
  frameSizes: [600, 300],
  captions: [
    { id: 'honest', likes: 100 },
    { id: 'nofilter', likes: 500 },
  ],
};

describe('compose', () => {
  it('starts large and centred on the subject, showing the mess', () => {
    const f = initialFrame(step);
    expect(f).toEqual({ x: 200, y: 0, size: 600 });
    expect(visibleMess(step, f)).toEqual(['left', 'right']);
    expect(cropReady(step, f)).toBe(false);
  });

  it('a smaller frame around the subject hides the mess', () => {
    const f = resizeFrame(step, initialFrame(step), 1);
    expect(f.size).toBe(300);
    expect(visibleMess(step, f)).toEqual([]);
    expect(cropReady(step, f)).toBe(true);
  });

  it('losing the subject is not ready, even without mess', () => {
    const f = moveFrame(step, resizeFrame(step, initialFrame(step), 1), 0, 300);
    expect(visibleMess(step, f)).toEqual([]);
    expect(cropReady(step, f)).toBe(false);
  });

  it('a sliver of mess at the edge does not count', () => {
    expect(visibleMess(step, { x: 290, y: 0, size: 300 })).toEqual([]);
  });

  it('keeps the frame inside the picture', () => {
    expect(clampFrame(step, { x: -50, y: 900, size: 300 })).toEqual({ x: 0, y: 300, size: 300 });
  });

  it('likes depend on the caption and grow with polish', () => {
    expect(likesFor(step, 'honest', NO_POLISH)).toBe(100);
    expect(likesFor(step, 'nofilter', NO_POLISH)).toBe(500);
    expect(likesFor(step, 'nofilter', { light: 4, glow: 4, warmth: 4 })).toBe(800);
  });
});
