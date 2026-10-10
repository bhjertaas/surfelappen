import { describe, expect, it } from 'vitest';
import { tenFingers } from '../../content/missions/ten-fingers/structure.ts';
import { keyForChar, NB_ROWS } from './keymap-nb.ts';
import {
  accuracy,
  createDrill,
  type Drill,
  isDone,
  type KeyInput,
  press,
  wholePercent,
} from './matcher.ts';

/** A keystroke on a Norwegian keyboard. */
function nb(char: string): KeyInput {
  return { key: char, code: keyForChar(char)?.code ?? '' };
}

function typeAll(drill: Drill, inputs: KeyInput[]): Drill {
  return inputs.reduce((d, input) => press(d, input).drill, drill);
}

describe('press', () => {
  it('advances on the right character', () => {
    const { drill, outcome } = press(createDrill('fj'), nb('f'));
    expect(outcome).toEqual({ kind: 'correct' });
    expect(drill).toMatchObject({ position: 1, correct: 1, wrong: 0 });
  });

  it('counts a wrong key and waits', () => {
    const { drill, outcome } = press(createDrill('fj'), nb('j'));
    expect(outcome).toEqual({ kind: 'wrong', typed: 'j' });
    expect(drill).toMatchObject({ position: 0, correct: 0, wrong: 1 });
  });

  it('types a whole Norwegian drill with ø, æ and spaces', () => {
    const text = 'øæø gh æ';
    const drill = typeAll(createDrill(text), [...text].map(nb));
    expect(isDone(drill)).toBe(true);
    expect(drill.wrong).toBe(0);
  });

  it('forgives Caps Lock: capitals match until capitals are taught', () => {
    expect(press(createDrill('f'), { key: 'F', code: 'KeyF' }).outcome).toEqual({
      kind: 'correct',
    });
  });

  it.each<[string, KeyInput]>([
    ['Shift', { key: 'Shift', code: 'ShiftLeft' }],
    ['Caps Lock', { key: 'CapsLock', code: 'CapsLock' }],
    ['Tab', { key: 'Tab', code: 'Tab' }],
    ['a dead key', { key: 'Dead', code: 'BracketRight' }],
    ['IME composition', { key: 'f', code: 'KeyF', isComposing: true }],
    ['IME processing', { key: 'Process', code: 'KeyF' }],
    ['auto-repeat', { key: 'f', code: 'KeyF', repeat: true }],
    ['a shortcut', { key: 'f', code: 'KeyF', ctrlKey: true }],
  ])('ignores %s', (_, input) => {
    const start = createDrill('f');
    const { drill, outcome } = press(start, input);
    expect(outcome).toEqual({ kind: 'ignored' });
    expect(drill).toBe(start);
  });

  it('ignores keys after the line is done', () => {
    const done = typeAll(createDrill('f'), [nb('f')]);
    expect(press(done, nb('f')).outcome).toEqual({ kind: 'ignored' });
  });
});

describe('another keyboard layout', () => {
  /** US layout: the Ø key types ";" and the Æ key types "'". */
  const usOslash: KeyInput = { key: ';', code: 'Semicolon' };
  const usAe: KeyInput = { key: "'", code: 'Quote' };

  it('is suspected, not counted, when the right key types another character', () => {
    const { drill, outcome } = press(createDrill('ø'), usOslash);
    expect(outcome).toEqual({ kind: 'layout-suspect' });
    expect(drill).toMatchObject({ wrong: 0, layoutSuspects: 1, position: 0 });
  });

  it('is matched by position once the player chooses to continue', () => {
    const drill = typeAll(createDrill('øæ f', true), [usOslash, usAe, nb(' '), nb('f')]);
    expect(isDone(drill)).toBe(true);
    expect(drill.wrong).toBe(0);
  });

  it('still counts a genuinely wrong key in positional mode', () => {
    expect(press(createDrill('ø', true), nb('l')).outcome).toEqual({ kind: 'wrong', typed: 'l' });
  });
});

describe('accuracy', () => {
  it('is correct ÷ all counted keystrokes', () => {
    expect(accuracy(30, 0)).toBe(1);
    expect(wholePercent(accuracy(30, 3))).toBe(91);
    expect(accuracy(30, 3)).toBeGreaterThanOrEqual(0.9);
    expect(accuracy(30, 4)).toBeLessThan(0.9);
  });
});

describe('the Norwegian key map', () => {
  it('has a key, once, for every character in Ti fingre', () => {
    const chars = new Set(tenFingers.steps.flatMap((s) => [...s.drills.join('')]));
    for (const ch of chars) expect(keyForChar(ch), `no key for "${ch}"`).toBeDefined();
    const codes = NB_ROWS.flat().map((k) => k.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('matches the PRD finger map for the home row', () => {
    const finger = (ch: string) => keyForChar(ch)?.finger;
    expect([finger('a'), finger('s'), finger('d'), finger('f'), finger('g')]).toEqual([
      'left-pinky',
      'left-ring',
      'left-middle',
      'left-index',
      'left-index',
    ]);
    expect([finger('h'), finger('j'), finger('k'), finger('l'), finger('ø'), finger('æ')]).toEqual([
      'right-index',
      'right-index',
      'right-middle',
      'right-ring',
      'right-pinky',
      'right-pinky',
    ]);
    expect(finger(' ')).toBe('thumb');
  });
});
