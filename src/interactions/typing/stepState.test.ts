import { describe, expect, it } from 'vitest';
import { tenFingers } from '../../content/missions/ten-fingers/structure.ts';
import type { TypingStep } from '../../content/types.ts';
import { keyForChar } from './keymap-nb.ts';
import type { KeyInput } from './matcher.ts';
import {
  initialStepState,
  type TypingAction,
  type TypingStepState,
  typingStepReducer,
} from './stepState.ts';

const [step1, step2, , , step5] = tenFingers.steps as readonly TypingStep[];

const nb = (char: string): TypingAction => ({
  type: 'key',
  input: { key: char, code: keyForChar(char)?.code ?? '' },
  capsLock: false,
});
const key = (input: KeyInput, capsLock = false): TypingAction => ({ type: 'key', input, capsLock });

function run(step: TypingStep, actions: TypingAction[], start?: TypingStepState): TypingStepState {
  const reduce = typingStepReducer(step);
  return actions.reduce(reduce, start ?? initialStepState(step, false));
}

const typeText = (text: string) => [...text].map(nb);

describe('typingStepReducer', () => {
  it('finishes a practice step whatever the accuracy', () => {
    const state = run(step1 as TypingStep, [nb('j'), ...typeText(step1?.drills[0] ?? '')]);
    expect(state.result).toMatchObject({ errors: 1, passed: true });
  });

  it('moves through every line of a step and sums the accuracy', () => {
    const [line1, line2] = step2?.drills ?? [];
    const state = run(step2 as TypingStep, [
      ...typeText(line1 ?? ''),
      nb('x'),
      ...typeText(line2 ?? ''),
    ]);
    expect(state.lineIndex).toBe(1);
    expect(state.result?.errors).toBe(1);
    expect(state.result?.percent).toBe(98);
  });

  it('passes the final line at 90 % and fails below', () => {
    const line = step5?.drills[0] ?? '';
    const withErrors = (n: number) => [
      ...Array.from({ length: n }, () => nb('x')),
      ...typeText(line),
    ];
    expect(run(step5 as TypingStep, withErrors(3)).result).toMatchObject({
      percent: 91,
      passed: true,
    });
    expect(run(step5 as TypingStep, withErrors(4)).result).toMatchObject({
      percent: 88,
      passed: false,
    });
    expect(run(step5 as TypingStep, withErrors(0)).result).toMatchObject({
      percent: 100,
      errors: 0,
    });
  });

  it('starts the step over on retry, keeping positional mode', () => {
    const failed = run(step5 as TypingStep, [
      ...Array.from({ length: 5 }, () => nb('x')),
      ...typeText(step5?.drills[0] ?? ''),
    ]);
    const positional = { ...failed, drill: { ...failed.drill, positional: true } };
    const retried = run(step5 as TypingStep, [{ type: 'retry' }], positional);
    expect(retried.result).toBeNull();
    expect(retried.drill).toMatchObject({ position: 0, wrong: 0, positional: true });
  });

  it('remembers the wrong key and the expected one, until the next correct key', () => {
    let state = run(step1 as TypingStep, [nb('j')]);
    expect(state.lastWrong).toEqual({ typed: 'j', expected: 'f' });
    state = run(step1 as TypingStep, [nb('f')], state);
    expect(state.lastWrong).toBeNull();
  });

  it('shows the layout hint after three layout-looking keys, then matches by position', () => {
    const step = { ...step1, drills: ['ø'] } as TypingStep;
    const us = key({ key: ';', code: 'Semicolon' });
    let state = run(step, [us, us]);
    expect(state.layoutHint).toBe(false);
    state = run(step, [us], state);
    expect(state.layoutHint).toBe(true);
    state = run(step, [{ type: 'use-positional' }, us], state);
    expect(state.layoutHint).toBe(false);
    expect(state.result).toMatchObject({ errors: 0, passed: true });
  });

  it('tracks Caps Lock from the latest keystroke', () => {
    const state = run(step1 as TypingStep, [key({ key: 'F', code: 'KeyF' }, true)]);
    expect(state.capsLock).toBe(true);
    expect(state.drill.position).toBe(1);
  });

  it('ignores keys once the step has a result', () => {
    const done = run(step1 as TypingStep, typeText(step1?.drills[0] ?? ''));
    expect(run(step1 as TypingStep, [nb('f')], done)).toBe(done);
  });
});
