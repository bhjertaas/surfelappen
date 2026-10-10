import { useEffect } from 'preact/hooks';
import { replace } from '../app/router.ts';
import { href } from '../app/routes.ts';
import { Page } from '../components/Page.tsx';
import { Rich } from '../components/Rich.tsx';
import { findMission } from '../content/missions/index.ts';
import type { MissionStructure } from '../content/types.ts';
import { format } from '../i18n/format.ts';
import { useI18n, useMissionText } from '../i18n/i18n.ts';
import { currentStep } from '../interactions/progress.ts';
import { interactionViews } from '../interactions/registry.ts';
import { useProgress } from '../progress/hooks.ts';
import { ErrorScreen } from './ErrorScreen.tsx';

export function MissionSummary({ missionId }: { missionId: string }) {
  const mission = findMission(missionId);
  return mission ? <Summary mission={mission} /> : <ErrorScreen kind="not-found" />;
}

/** Wrap-up: the takeaway, the interaction's details (e.g. first-try score) and stickers. */
function Summary({ mission }: { mission: MissionStructure }) {
  const { m } = useI18n();
  const { progress } = useProgress();
  const text = useMissionText(mission.id);
  const entry = progress.missions[mission.id];
  const step = entry ? currentStep(mission, entry.run) : null;

  useEffect(() => {
    if (step === null) replace({ name: 'mission-intro', missionId: mission.id });
    else if (step !== 'done')
      replace({ name: 'mission-step', missionId: mission.id, stepId: step });
  }, [step, mission.id]);

  if (!text) return <ErrorScreen kind="not-found" />;
  if (step !== 'done') return null;
  const { SummaryDetails } = interactionViews[mission.interaction];

  return (
    <Page title={m.summary.title}>
      <p class="character">{text.title}</p>
      <h2>{m.summary.takeawayHeading}</h2>
      <p>
        <Rich text={text.summary.takeaway} />
      </p>
      {SummaryDetails && entry && <SummaryDetails mission={mission} run={entry.run} />}
      <h2>{m.summary.stickersHeading}</h2>
      <ul class="sticker-list">
        {mission.stickers.map((id) => {
          const sticker = m.stickers[id];
          if (!sticker) return null;
          const has = progress.stickers.includes(id);
          return (
            <li
              key={id}
              class={has ? 'sticker-list__item sticker-list__item--earned' : 'sticker-list__item'}
            >
              <span aria-hidden="true">{has ? '★' : '☆'}</span>{' '}
              {has
                ? format(m.summary.stickerEarned, { name: sticker.name })
                : format(m.summary.stickerMissing, { name: sticker.name, howTo: sticker.howTo })}
            </li>
          );
        })}
      </ul>
      <div class="actions">
        <a class="button" href={href({ name: 'passport' })}>
          {m.summary.toPassport}
        </a>
        <a class="button button--secondary" href={href({ name: 'town' })}>
          {m.summary.toTown}
        </a>
      </div>
    </Page>
  );
}
