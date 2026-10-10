import { useEffect } from 'preact/hooks';
import { href } from '../app/routes.ts';
import { Page } from '../components/Page.tsx';
import { plural } from '../i18n/format.ts';
import { useI18n } from '../i18n/i18n.ts';
import { useProgress } from '../progress/hooks.ts';
import { visitBuilding } from '../progress/selectors.ts';

/** Passport stub; the sticker album, celebration and reset arrive in phase 5. */
export function Passport() {
  const { m, locale } = useI18n();
  const { progress, store } = useProgress();

  useEffect(() => {
    // Opening the passport counts as visiting Lappekontoret (Nysgjerrig).
    store.update((p) => visitBuilding(p, 'licence-office'));
  }, [store]);

  return (
    <Page title={m.passport.title}>
      <p>{plural(locale, progress.stickers.length, m.town.stickerCount)}</p>
      <p>{m.passport.notReady}</p>
      <p>
        <a class="button" href={href({ name: 'town' })}>
          {m.summary.toTown}
        </a>
      </p>
    </Page>
  );
}
