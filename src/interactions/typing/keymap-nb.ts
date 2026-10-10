/**
 * The Norwegian keyboard layout (ADR 0014): physical key (`KeyboardEvent.code`)
 * → what it types, its label on the on-screen keyboard, and which finger presses it.
 */

export type Finger =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumb';

export interface KeyDef {
  readonly code: string;
  /** The character this key types on a Norwegian layout, lower case. */
  readonly char: string;
  readonly finger: Finger;
  /** F and J have small bumps: "the way home". */
  readonly homeBump?: true;
}

const key = (code: string, char: string, finger: Finger, homeBump?: true): KeyDef =>
  homeBump ? { code, char, finger, homeBump } : { code, char, finger };

/** Letter rows plus space, as drawn on screen. */
export const NB_ROWS: readonly (readonly KeyDef[])[] = [
  [
    key('KeyQ', 'q', 'left-pinky'),
    key('KeyW', 'w', 'left-ring'),
    key('KeyE', 'e', 'left-middle'),
    key('KeyR', 'r', 'left-index'),
    key('KeyT', 't', 'left-index'),
    key('KeyY', 'y', 'right-index'),
    key('KeyU', 'u', 'right-index'),
    key('KeyI', 'i', 'right-middle'),
    key('KeyO', 'o', 'right-ring'),
    key('KeyP', 'p', 'right-pinky'),
    key('BracketLeft', 'å', 'right-pinky'),
  ],
  [
    key('KeyA', 'a', 'left-pinky'),
    key('KeyS', 's', 'left-ring'),
    key('KeyD', 'd', 'left-middle'),
    key('KeyF', 'f', 'left-index', true),
    key('KeyG', 'g', 'left-index'),
    key('KeyH', 'h', 'right-index'),
    key('KeyJ', 'j', 'right-index', true),
    key('KeyK', 'k', 'right-middle'),
    key('KeyL', 'l', 'right-ring'),
    key('Semicolon', 'ø', 'right-pinky'),
    key('Quote', 'æ', 'right-pinky'),
  ],
  [
    key('KeyZ', 'z', 'left-pinky'),
    key('KeyX', 'x', 'left-ring'),
    key('KeyC', 'c', 'left-middle'),
    key('KeyV', 'v', 'left-index'),
    key('KeyB', 'b', 'left-index'),
    key('KeyN', 'n', 'right-index'),
    key('KeyM', 'm', 'right-index'),
    key('Comma', ',', 'right-middle'),
    key('Period', '.', 'right-ring'),
    key('Slash', '-', 'right-pinky'),
  ],
  [key('Space', ' ', 'thumb')],
];

const BY_CHAR = new Map(NB_ROWS.flat().map((k) => [k.char, k]));

/** The key that types `char` on a Norwegian layout. */
export function keyForChar(char: string): KeyDef | undefined {
  return BY_CHAR.get(char.toLowerCase());
}
