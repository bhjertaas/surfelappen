import { useEffect } from 'preact/hooks';
import { replace } from '../app/router.ts';
import { href } from '../app/routes.ts';
import { Page } from '../components/Page.tsx';
import { Rich } from '../components/Rich.tsx';
import { findMission } from '../content/missions/index.ts';
import { missionTexts } from '../content/missions/texts.ts';
import type { MissionStructure } from '../content/types.ts';
import { useI18n } from '../i18n/i18n.ts';
import { currentStep } from '../interactions/progress.ts';
import { useProgress } from '../progress/hooks.ts';
import { ErrorScreen } from './ErrorScreen.tsx';

export function MissionSummary({ missionId }: { missionId: string }) {
  const mission = findMission(missionId);
  return mission ? <Summary mission={mission} /> : <ErrorScreen kind="not-found" />;
}

/** Wrap-up. Sticker and first-try details arrive in phase 3. */
function Summary({ mission }: { mission: MissionStructure }) {
  const { m, locale } = useI18n();
  const { progress } = useProgress();
  const text = missionTexts[locale][mission.id];
  const entry = progress.missions[mission.id];
  const step = entry ? currentStep(mission, entry.run) : null;

  useEffect(() => {
    if (step === null) replace({ name: 'mission-intro', missionId: mission.id });
    else if (step !== 'done')
      replace({ name: 'mission-step', missionId: mission.id, stepId: step });
  }, [step, mission.id]);

  if (!text) return <ErrorScreen kind="not-found" />;
  if (step !== 'done') return null;

  return (
    <Page title={m.summary.title}>
      <p class="character">{text.title}</p>
      <h2>{m.summary.takeawayHeading}</h2>
      <p>
        <Rich text={text.summary.takeaway} />
      </p>
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
