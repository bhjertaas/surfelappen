import { useEffect, useId, useState } from 'preact/hooks';
import { href } from '../app/routes.ts';
import { Dialog } from '../components/Dialog.tsx';
import { Page } from '../components/Page.tsx';
import { artFor } from '../content/art.ts';
import { stickers } from '../content/stickers.ts';
import { buildings } from '../content/town.ts';
import { format, plural } from '../i18n/format.ts';
import { useI18n } from '../i18n/i18n.ts';
import { useProgress } from '../progress/hooks.ts';
import { visitBuilding } from '../progress/selectors.ts';

/** The sticker album (FR-07): every sticker in this release, earned or not, and reset (FR-06). */
export function Passport() {
  const { m, locale } = useI18n();
  const { progress, store } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const confirmTitleId = useId();

  useEffect(() => {
    // Opening the passport counts as visiting Lappekontoret (Nysgjerrig).
    store.update((p) => visitBuilding(p, 'licence-bureau'));
  }, [store]);

  const visitedCount = buildings.filter((b) => progress.visitedBuildings.includes(b.id)).length;

  return (
    <Page title={m.passport.title}>
      <p>{m.passport.intro}</p>
      <p class="sticker-count">{plural(locale, progress.stickers.length, m.town.stickerCount)}</p>

      <ul class="album" aria-label={m.passport.albumLabel}>
        {stickers.map((sticker) => {
          const earned = progress.stickers.includes(sticker.id);
          const image = artFor(sticker.image);
          const text = m.stickers[sticker.id];
          return (
            <li key={sticker.id} class={earned ? 'album__item album__item--earned' : 'album__item'}>
              {image && (
                <img
                  class={
                    earned
                      ? 'pixel-art album__image'
                      : 'pixel-art album__image album__image--locked'
                  }
                  src={image.src}
                  width={96}
                  height={96}
                  alt=""
                />
              )}
              <div>
                <h2 class="album__name">{text?.name}</h2>
                <p class="album__status">
                  <span aria-hidden="true">{earned ? '★ ' : '☆ '}</span>
                  {earned ? m.passport.earned : m.passport.notEarned}
                </p>
                <p class="muted">{text?.howTo}</p>
                {'town' in sticker.awardedBy && !earned && (
                  <p class="muted">
                    {format(m.passport.visited, { visited: visitedCount, total: buildings.length })}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <section class="reset" aria-labelledby="reset-heading">
        <h2 id="reset-heading">{m.passport.resetHeading}</h2>
        <p>{m.passport.resetIntro}</p>
        <button type="button" class="button button--secondary" onClick={() => setConfirming(true)}>
          {m.passport.reset}
        </button>
        <p role="status" class="reset__status">
          {resetMessage}
        </p>
      </section>

      <Dialog open={confirming} onClose={() => setConfirming(false)} labelledBy={confirmTitleId}>
        <h2 id={confirmTitleId}>{m.passport.resetConfirmTitle}</h2>
        <p>{m.passport.resetConfirmBody}</p>
        <form method="dialog" class="actions">
          {/* Cancel comes first: a modal dialog focuses its first button, and that should be the safe one. */}
          <button type="submit" class="button button--secondary">
            {m.passport.resetCancel}
          </button>
          <button
            type="submit"
            class="button button--danger"
            onClick={() => {
              store.reset();
              setResetMessage(m.passport.resetDone);
            }}
          >
            {m.passport.resetConfirm}
          </button>
        </form>
      </Dialog>

      <p>
        <a class="button" href={href({ name: 'town' })}>
          {m.summary.toTown}
        </a>
      </p>
    </Page>
  );
}
