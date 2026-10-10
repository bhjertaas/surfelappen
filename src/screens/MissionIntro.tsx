import { useEffect, useMemo } from 'preact/hooks';
import { isTouchOnly } from '../app/device.ts';
import { navigate } from '../app/router.ts';
import { href } from '../app/routes.ts';
import { Guide } from '../components/Guide.tsx';
import { Page } from '../components/Page.tsx';
import { Rich } from '../components/Rich.tsx';
import { Scene } from '../components/Scene.tsx';
import { findMission } from '../content/missions/index.ts';
import type { MissionStructure } from '../content/types.ts';
import { useI18n, useMissionText } from '../i18n/i18n.ts';
import { currentStep } from '../interactions/progress.ts';
import { useProgress } from '../progress/hooks.ts';
import type { Progress } from '../progress/schema.ts';
import {
  hasRunProgress,
  isUnfinished,
  restartMission,
  startMission,
  visitBuilding,
} from '../progress/selectors.ts';
import { ErrorScreen } from './ErrorScreen.tsx';

export function MissionIntro({ missionId }: { missionId: string }) {
  const mission = findMission(missionId);
  return mission ? <Intro mission={mission} /> : <ErrorScreen kind="not-found" />;
}

function Intro({ mission }: { mission: MissionStructure }) {
  const { m } = useI18n();
  const { progress, store } = useProgress();
  const text = useMissionText(mission.id);
  const touchOnly = useMemo(isTouchOnly, []);

  useEffect(() => {
    store.update((p) => visitBuilding(p, mission.building));
  }, [store, mission.building]);

  if (!text) return <ErrorScreen kind="not-found" />;

  const entry = progress.missions[mission.id];
  const inProgress = isUnfinished(mission, entry) && hasRunProgress(entry);
  const finished = entry !== undefined && !isUnfinished(mission, entry);
  const needsKeyboard = touchOnly && mission.requires.includes('physical-keyboard');

  /** Applies a progress change and opens the mission's current step. */
  const go = (change: (p: Progress) => Progress) => {
    store.update(change);
    const step = currentStep(mission, store.get().missions[mission.id]?.run);
    if (step !== 'done') navigate({ name: 'mission-step', missionId: mission.id, stepId: step });
  };

  return (
    <Page title={text.title} theme={mission.theme}>
      <Scene id={mission.scene} />
      <Guide name={text.character}>
        {text.intro.map((paragraph) => (
          <p key={paragraph}>
            <Rich text={paragraph} />
          </p>
        ))}
      </Guide>
      <h2>{m.mission.learnHeading}</h2>
      <p>{text.learn}</p>

      {needsKeyboard && (
        <section class="notice" aria-labelledby="needs-keyboard">
          <h2 id="needs-keyboard">{m.keyboard.title}</h2>
          <p>{m.keyboard.body}</p>
        </section>
      )}

      <div class="actions">
        {inProgress ? (
          <>
            <button
              type="button"
              class="button"
              onClick={() => go((p) => startMission(p, mission))}
            >
              {m.mission.continue}
            </button>
            <button
              type="button"
              class="button button--secondary"
              onClick={() => go((p) => restartMission(p, mission))}
            >
              {m.mission.restart}
            </button>
          </>
        ) : (
          <button
            type="button"
            class="button"
            onClick={() =>
              go((p) => (finished ? restartMission(p, mission) : startMission(p, mission)))
            }
          >
            {needsKeyboard
              ? m.keyboard.startAnyway
              : finished
                ? m.mission.playAgain
                : m.mission.begin}
          </button>
        )}
        <a class="button button--secondary" href={href({ name: 'town' })}>
          {m.mission.backToTown}
        </a>
      </div>
    </Page>
  );
}
