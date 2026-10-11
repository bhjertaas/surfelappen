import { useEffect } from 'preact/hooks';
import { replace } from '../app/router.ts';
import { href } from '../app/routes.ts';
import { Page } from '../components/Page.tsx';
import { usePrefetchLesson } from '../components/usePrefetchLesson.ts';
import { findMission } from '../content/missions/index.ts';
import type { MissionStructure } from '../content/types.ts';
import { useI18n, useMissionText } from '../i18n/i18n.ts';
import { currentStep } from '../interactions/progress.ts';
import { interactionViews } from '../interactions/registry.ts';
import { useProgress } from '../progress/hooks.ts';
import type { Run } from '../progress/schema.ts';
import { isUnfinished, setRun, startMission } from '../progress/selectors.ts';
import { ErrorScreen } from './ErrorScreen.tsx';

export function MissionStep({ missionId, stepId }: { missionId: string; stepId: string }) {
  const mission = findMission(missionId);
  usePrefetchLesson(mission);
  return mission ? <Step mission={mission} stepId={stepId} /> : <ErrorScreen kind="not-found" />;
}

/**
 * The generic step shell. Only the player's current step can be shown: any other
 * step URL (an old link, or a step further ahead) is replaced by the current one.
 */
function Step({ mission, stepId }: { mission: MissionStructure; stepId: string }) {
  const { m } = useI18n();
  const { progress, store } = useProgress();
  const text = useMissionText(mission.id);
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
  if (current !== stepId || !entry) return null;

  const save = (run: Run) => store.update((p) => setRun(p, mission, run));
  const advance = (run: Run) => {
    save(run);
    const next = currentStep(mission, store.get().missions[mission.id]?.run);
    replace(
      next === 'done'
        ? { name: 'mission-summary', missionId: mission.id }
        : { name: 'mission-step', missionId: mission.id, stepId: next },
    );
  };

  const { StepView } = interactionViews[mission.interaction];
  return (
    <Page title={text.title} theme={mission.theme}>
      <StepView
        mission={mission}
        text={text}
        stepId={stepId}
        run={entry.run}
        save={save}
        advance={advance}
      />
      <p class="exit">
        <a href={href({ name: 'town' })}>{m.mission.exit}</a>
      </p>
    </Page>
  );
}
