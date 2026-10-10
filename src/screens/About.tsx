import { Page } from '../components/Page.tsx';
import { Rich } from '../components/Rich.tsx';
import { missions } from '../content/missions/index.ts';
import { missionText } from '../content/missions/texts.ts';
import { SOURCE_CODE_URL } from '../content/project.ts';
import type { MissionStructure } from '../content/types.ts';
import { format, formatDate } from '../i18n/format.ts';
import { useI18n } from '../i18n/i18n.ts';

/** About and privacy (FR-10): what is stored and how to delete it, sources, credits, licence, version. */
export function About() {
  const { m, locale, audience } = useI18n();
  return (
    <Page title={m.about.title}>
      <p>{m.about.what}</p>

      <h2>{m.about.privacyHeading}</h2>
      {m.about.privacy.map((paragraph) => (
        <p key={paragraph}>
          <Rich text={paragraph} />
        </p>
      ))}
      <h3>{m.about.deleteHeading}</h3>
      <p>{m.about.delete}</p>

      <h2>{m.about.sourcesHeading}</h2>
      <p>{m.about.sourcesIntro}</p>
      {(missions as readonly MissionStructure[]).map((mission) => (
        <section key={mission.id} class="source">
          <h3>{missionText(locale, audience, mission.id)?.title}</h3>
          {mission.sources.length === 0 ? (
            <p>{m.about.noSources}</p>
          ) : (
            <>
              <ul>
                {mission.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url}>{source.title}</a>
                  </li>
                ))}
              </ul>
              <p class="muted">
                {mission.reviewedOn
                  ? format(m.about.reviewedOn, { date: formatDate(locale, mission.reviewedOn) })
                  : m.about.notReviewed}
              </p>
            </>
          )}
        </section>
      ))}

      <h2>{m.about.informalHeading}</h2>
      <p>{m.about.informal}</p>
      <h2>{m.about.fictionHeading}</h2>
      <p>
        <Rich text={m.about.fiction} />
      </p>

      <h2>{m.about.creditsHeading}</h2>
      {m.about.credits.map((line) => (
        <p key={line}>{line}</p>
      ))}

      <h2>{m.about.licenceHeading}</h2>
      <p>{m.about.licence}</p>
      <p>
        <a class="link-block" href={SOURCE_CODE_URL}>
          {m.about.sourceCode}
        </a>
      </p>

      <p class="version">
        {m.app.version} {__APP_VERSION__}
      </p>
    </Page>
  );
}
