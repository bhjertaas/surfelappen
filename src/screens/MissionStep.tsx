import { useEffect } from 'preact/hooks';
import { replace } from '../app/router.ts';
import { href } from '../app/routes.ts';
import { Page } from '../components/Page.tsx';
import { findMission } from '../content/missions/index.ts';
import { missionTexts } from '../content/missions/texts.ts';
import type { MissionStructure } from '../content/types.ts';
import { format } from '../i18n/format.ts';
import { useI18n } from '../i18n/i18n.ts';
import { currentStep, stepSequence } from '../interactions/progress.ts';
import { useProgress } from '../progress/hooks.ts';
import { isUnfinished, startMission } from '../progress/selectors.ts';
import { ErrorScreen } from './ErrorScreen.tsx';

export function MissionStep({ missionId, stepId }: { missionId: string; stepId: string }) {
  const mission = findMission(missionId);
  return mission ? <Step mission={mission} stepId={stepId} /> : <ErrorScreen kind="not-found" />;
}

/**
 * The generic step shell. Only the player's current step can be shown: any other
 * step URL (an old link, or a step further ahead) is replaced by the current one.
 * The interaction views arrive in phases 3 and 4.
 */
function Step({ mission, stepId }: { mission: MissionStructure; stepId: string }) {
  const { m, locale } = useI18n();
  const { progress, store } = useProgress();
  const text = missionTexts[locale][mission.id];
  const entry = progress.missions[mission.id];
  const current = currentStep(mission, entry?.run);

  useEffect(() => {
    // A deep link straight to a step starts the mission (or makes it the last played).
    // A finished mission is not restarted: its URLs lead to the summary instead.
    const unfinished = isUnfinished(mission, entry);
    if (!entry || (unfinished && progress.lastMission !== mission.id)) {
      store.update((p) => startMission(p, mission));
    }
  }, [entry, progress.lastMission, store, mission]);

  useEffect(() => {
    if (current === 'done') replace({ name: 'mission-summary', missionId: mission.id });
    else if (current !== stepId)
      replace({ name: 'mission-step', missionId: mission.id, stepId: current });
  }, [current, stepId, mission.id]);

  if (!text) return <ErrorScreen kind="not-found" />;
  if (current !== stepId) return null;

  const sequence = stepSequence(mission, entry?.run);
  return (
    <Page title={text.title}>
      <p class="step-progress">
        {format(m.mission.progress, {
          current: sequence.indexOf(stepId) + 1,
          total: sequence.length,
        })}
      </p>
      <p>{m.mission.notReady}</p>
      <p>
        <a href={href({ name: 'town' })}>{m.mission.exit}</a>
      </p>
    </Page>
  );
}
