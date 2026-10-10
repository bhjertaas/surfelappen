import { keyForChar } from './keymap-nb.ts';

/**
 * Pure keystroke matching for one drill line (ADR 0014).
 *
 * - Characters are matched by `KeyboardEvent.key`, ignoring case until a lesson
 *   teaches capitals (Caps Lock is forgiven, and noted).
 * - The right physical key typing a different character (e.g. `;` on the Ø key)
 *   means another keyboard layout: not counted as an error ("layout-suspect").
 * - In positional mode (after the player accepts the layout hint) keys are
 *   matched by physical position, `KeyboardEvent.code`.
 * - Modifiers, shortcuts, dead keys, IME composition and auto-repeat are ignored.
 */

export interface KeyInput {
  readonly key: string;
  readonly code: string;
  readonly repeat?: boolean;
  readonly isComposing?: boolean;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
  readonly altKey?: boolean;
}

export type Outcome =
  | { readonly kind: 'ignored' }
  | { readonly kind: 'correct' }
  | { readonly kind: 'wrong'; readonly typed: string }
  | { readonly kind: 'layout-suspect' };

export interface Drill {
  readonly text: string;
  readonly position: number;
  readonly correct: number;
  readonly wrong: number;
  readonly layoutSuspects: number;
  readonly positional: boolean;
}

export function createDrill(text: string, positional = false): Drill {
  return { text, position: 0, correct: 0, wrong: 0, layoutSuspects: 0, positional };
}

export function isDone(drill: Drill): boolean {
  return drill.position >= drill.text.length;
}

export function expectedChar(drill: Drill): string | undefined {
  return drill.text[drill.position];
}

function ignorable(input: KeyInput): boolean {
  return (
    input.isComposing === true ||
    input.repeat === true ||
    input.ctrlKey === true ||
    input.metaKey === true ||
    input.altKey === true ||
    // Named keys (Shift, Tab, Dead, Process, ArrowLeft, …) are longer than one character.
    [...input.key].length !== 1
  );
}

export function press(drill: Drill, input: KeyInput): { drill: Drill; outcome: Outcome } {
  const expected = expectedChar(drill);
  if (expected === undefined || ignorable(input)) return { drill, outcome: { kind: 'ignored' } };

  const expectedCode = keyForChar(expected)?.code;
  const matches = drill.positional
    ? input.code === expectedCode
    : input.key.toLowerCase() === expected.toLowerCase();

  if (matches) {
    return {
      drill: { ...drill, position: drill.position + 1, correct: drill.correct + 1 },
      outcome: { kind: 'correct' },
    };
  }
  if (!drill.positional && input.code !== '' && input.code === expectedCode) {
    return {
      drill: { ...drill, layoutSuspects: drill.layoutSuspects + 1 },
      outcome: { kind: 'layout-suspect' },
    };
  }
  return {
    drill: { ...drill, wrong: drill.wrong + 1 },
    outcome: { kind: 'wrong', typed: input.key },
  };
}

/** Correct keystrokes ÷ all counted keystrokes (FR-05). 1 when nothing was typed wrong. */
export function accuracy(correct: number, wrong: number): number {
  const total = correct + wrong;
  return total === 0 ? 1 : correct / total;
}

/** Whole percent, as shown and saved. */
export function wholePercent(ratio: number): number {
  return Math.round(ratio * 100);
}
