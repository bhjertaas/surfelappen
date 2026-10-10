import { Page } from '../components/Page.tsx';
import { Rich } from '../components/Rich.tsx';
import { useI18n } from '../i18n/i18n.ts';

/** About and privacy. Sources, review dates, credits and reset instructions arrive in phase 5. */
export function About() {
  const { m } = useI18n();
  return (
    <Page title={m.about.title}>
      <p>{m.about.what}</p>
      <h2>{m.about.privacyHeading}</h2>
      {m.about.privacy.map((paragraph) => (
        <p key={paragraph}>
          <Rich text={paragraph} />
        </p>
      ))}
      <h2>{m.about.informalHeading}</h2>
      <p>{m.about.informal}</p>
      <h2>{m.about.fictionHeading}</h2>
      <p>
        <Rich text={m.about.fiction} />
      </p>
      <p class="version">
        {m.app.version} {__APP_VERSION__}
      </p>
    </Page>
  );
}
