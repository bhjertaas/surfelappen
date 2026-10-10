import { useCallback, useEffect, useId, useState } from 'preact/hooks';
import { artFor } from '../content/art.ts';
import { stickers } from '../content/stickers.ts';
import type { StickerId } from '../content/types.ts';
import { useI18n } from '../i18n/i18n.ts';
import { useProgressStore } from '../progress/hooks.ts';
import { Dialog } from './Dialog.tsx';

/**
 * A small, skippable celebration when stickers are earned (FR-07). It is
 * announced through its label, closes with Escape or its button, and its
 * animation respects reduced motion.
 */
export function StickerCelebration() {
  const { m } = useI18n();
  const store = useProgressStore();
  const headingId = useId();
  const [earned, setEarned] = useState<StickerId[]>([]);

  useEffect(
    () =>
      store.onUpdate((before, after) => {
        const fresh = after.stickers.filter((id) => !before.stickers.includes(id));
        if (fresh.length === 0) return;
        // Updates come from effects and event handlers; the dialog opens in a later
        // effect, after the new screen has focused its heading (which focus returns to).
        setEarned((current) => [...current, ...fresh]);
      }),
    [store],
  );

  const close = useCallback(() => setEarned([]), []);

  return (
    <Dialog open={earned.length > 0} onClose={close} labelledBy={headingId} class="celebration">
      <h2 id={headingId}>{earned.length > 1 ? m.celebration.titleMany : m.celebration.title}</h2>
      <ul class="celebration__list">
        {earned.map((id) => {
          const image = artFor(stickers.find((s) => s.id === id)?.image ?? '');
          const text = m.stickers[id];
          return (
            <li key={id}>
              {image && (
                <img class="celebration__image" src={image.src} width={96} height={96} alt="" />
              )}
              <p class="celebration__name">{text?.name}</p>
              <p class="muted">{text?.howTo}</p>
            </li>
          );
        })}
      </ul>
      <form method="dialog">
        <button type="submit" class="button">
          {m.celebration.close}
        </button>
      </form>
    </Dialog>
  );
}
