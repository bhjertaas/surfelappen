import type { TypingStep } from '../../content/types.ts';
import {
  accuracy,
  createDrill,
  type Drill,
  expectedChar,
  isDone,
  type KeyInput,
  press,
  wholePercent,
} from './matcher.ts';

/**
 * State of one typing step, as a pure reducer: keystrokes can arrive faster than
 * renders, so each one is applied to the latest state, never a stale copy.
 */

/** After this many layout-looking keystrokes, suggest switching layout (Appendix B). */
export const LAYOUT_HINT_AFTER = 3;

export interface StepResult {
  readonly ratio: number;
  readonly percent: number;
  readonly errors: number;
  /** Always true for practice steps; the final step needs `minAccuracy`. */
  readonly passed: boolean;
}

export interface TypingStepState {
  readonly lineIndex: number;
  readonly drill: Drill;
  /** Correct and wrong keystrokes on lines already finished in this attempt. */
  readonly earlier: { readonly correct: number; readonly wrong: number };
  readonly lastWrong: { readonly typed: string; readonly expected: string } | null;
  readonly layoutHint: boolean;
  readonly capsLock: boolean;
  readonly result: StepResult | null;
}

export type TypingAction =
  | { readonly type: 'key'; readonly input: KeyInput; readonly capsLock: boolean }
  | { readonly type: 'use-positional' }
  | { readonly type: 'retry' };

export function initialStepState(step: TypingStep, positional: boolean): TypingStepState {
  return {
    lineIndex: 0,
    drill: createDrill(step.drills[0] ?? '', positional),
    earlier: { correct: 0, wrong: 0 },
    lastWrong: null,
    layoutHint: false,
    capsLock: false,
    result: null,
  };
}

export function typingStepReducer(step: TypingStep) {
  return (state: TypingStepState, action: TypingAction): TypingStepState => {
    switch (action.type) {
      case 'use-positional':
        return { ...state, layoutHint: false, drill: { ...state.drill, positional: true } };

      case 'retry':
        return initialStepState(step, state.drill.positional);

      case 'key': {
        if (state.result) return state;
        const { drill, outcome } = press(state.drill, action.input);
        const base = { ...state, capsLock: action.capsLock };
        switch (outcome.kind) {
          case 'ignored':
            return base;
          case 'wrong':
            return {
              ...base,
              drill,
              lastWrong: { typed: outcome.typed, expected: expectedChar(state.drill) ?? '' },
            };
          case 'layout-suspect':
            return {
              ...base,
              drill,
              layoutHint: base.layoutHint || drill.layoutSuspects >= LAYOUT_HINT_AFTER,
            };
          case 'correct':
            break;
        }

        const next = { ...base, drill, lastWrong: null };
        if (!isDone(drill)) return next;

        const earlier = {
          correct: state.earlier.correct + drill.correct,
          wrong: state.earlier.wrong + drill.wrong,
        };
        const nextLine = step.drills[state.lineIndex + 1];
        if (nextLine !== undefined) {
          return {
            ...next,
            lineIndex: state.lineIndex + 1,
            drill: createDrill(nextLine, drill.positional),
            earlier,
          };
        }
        const ratio = accuracy(earlier.correct, earlier.wrong);
        const passed = step.minAccuracy === undefined || ratio * 100 >= step.minAccuracy;
        return {
          ...next,
          earlier,
          result: { ratio, percent: wholePercent(ratio), errors: earlier.wrong, passed },
        };
      }
    }
  };
}
