import { type KeyDef, NB_ROWS } from './keymap-nb.ts';

interface Props {
  /** The character to type next; its key is marked. */
  next: string | undefined;
  spaceLabel: string;
}

/**
 * A Norwegian keyboard showing which key comes next. Decoration only: the same
 * information (key and finger) is given in text, so this is hidden from screen readers.
 */
export function OnScreenKeyboard({ next, spaceLabel }: Props) {
  const isNext = (k: KeyDef) => next !== undefined && k.char === next.toLowerCase();
  return (
    <div class="keyboard" aria-hidden="true">
      {NB_ROWS.map((row) => (
        <div key={row[0]?.code} class="keyboard__row">
          {row.map((k) => (
            <span
              key={k.code}
              class={[
                'keyboard__key',
                `keyboard__key--${k.finger}`,
                k.code === 'Space' ? 'keyboard__key--space' : '',
                isNext(k) ? 'keyboard__key--next' : '',
                k.homeBump ? 'keyboard__key--bump' : '',
              ].join(' ')}
            >
              {k.code === 'Space' ? spaceLabel : k.char.toUpperCase()}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
