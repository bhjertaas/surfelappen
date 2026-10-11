import { href } from '../app/routes.ts';
import { Page } from '../components/Page.tsx';
import { Rich } from '../components/Rich.tsx';
import { findMission } from '../content/missions/index.ts';
import { useI18n, useMissionText } from '../i18n/i18n.ts';
import { ErrorScreen } from './ErrorScreen.tsx';

/** "Vil du vite mer?": real-world examples of what the mission showed, with links out. */
export function MissionMore({ missionId }: { missionId: string }) {
  const { m } = useI18n();
  const mission = findMission(missionId);
  const text = useMissionText(missionId);
  const further = text?.further;
  if (!mission?.further || !text || !further) return <ErrorScreen kind="not-found" />;

  return (
    <Page title={m.more.title} theme={mission.theme}>
      <p class="mission-name">{text.title}</p>
      <p>{further.intro}</p>
      {mission.further.map((reading) => {
        const item = further.items[reading.id];
        if (!item) return null;
        return (
          <section key={reading.id} class="reading">
            <h2>{item.title}</h2>
            <p>
              <Rich text={item.body} />
            </p>
            <p>
              <a class="link-block" href={reading.url}>
                {item.link}
              </a>
            </p>
          </section>
        );
      })}
      <div class="actions">
        <a class="button" href={href({ name: 'town' })}>
          {m.summary.toTown}
        </a>
      </div>
    </Page>
  );
}
