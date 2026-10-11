import type { Route } from '../app/routes.ts';
import {
  type Audience,
  type Building,
  type BuildingId,
  DEFAULT_AUDIENCE,
  type MissionStructure,
} from '../content/types.ts';
import { currentStep, emptyRun } from '../interactions/progress.ts';
import type { MissionProgress, Progress, Run } from './schema.ts';

/** Pure questions and updates on Progress. Updates return the same object when nothing changes. */

export function hasStarted(progress: Progress): boolean {
  return Object.keys(progress.missions).length > 0;
}

export function isUnfinished(
  mission: MissionStructure,
  entry: MissionProgress | undefined,
): boolean {
  return entry !== undefined && currentStep(mission, entry.run) !== 'done';
}

/** True when the current run has finished at least one step. */
export function hasRunProgress(entry: MissionProgress | undefined): boolean {
  if (!entry) return false;
  return entry.run.interaction === 'link-inspect'
    ? entry.run.solved.length > 0
    : entry.run.done.length > 0;
}

/**
 * Where "Fortsett" goes: the first unfinished step of the most recently played
 * unfinished mission, then any other unfinished mission, else the town (FR-01).
 */
export function resumeRoute(progress: Progress, missions: readonly MissionStructure[]): Route {
  const order = [
    ...missions.filter((m) => m.id === progress.lastMission),
    ...missions.filter((m) => m.id !== progress.lastMission),
  ];
  for (const mission of order) {
    const entry = progress.missions[mission.id];
    if (!entry) continue;
    const step = currentStep(mission, entry.run);
    if (step !== 'done') return { name: 'mission-step', missionId: mission.id, stepId: step };
  }
  return { name: 'town' };
}

/** Starts a mission: keeps an unfinished run, starts a new run after a finished one. */
export function startMission(progress: Progress, mission: MissionStructure): Progress {
  const entry = progress.missions[mission.id];
  const keepRun = entry !== undefined && isUnfinished(mission, entry);
  if (keepRun && progress.lastMission === mission.id) return progress;
  return {
    ...progress,
    lastMission: mission.id,
    missions: {
      ...progress.missions,
      [mission.id]: {
        completedOnce: entry?.completedOnce ?? false,
        run: keepRun && entry ? entry.run : emptyRun(mission),
      },
    },
  };
}

/** Throws away the current run (never stickers or completedOnce). */
export function restartMission(progress: Progress, mission: MissionStructure): Progress {
  return {
    ...progress,
    lastMission: mission.id,
    missions: {
      ...progress.missions,
      [mission.id]: {
        completedOnce: progress.missions[mission.id]?.completedOnce ?? false,
        run: emptyRun(mission),
      },
    },
  };
}

/**
 * A building with `after` stays shut until those missions are done. Deep links still
 * work (the lock is for the town, not a wall).
 */
export function isLocked(progress: Progress, building: Building): boolean {
  return building.after?.some((id) => !progress.missions[id]?.completedOnce) ?? false;
}

/** "Begynn her": the starting place, until its missions are done. */
export function isStartHere(progress: Progress, building: Building): boolean {
  return (
    building.start === true &&
    !building.missions.every((id) => progress.missions[id]?.completedOnce)
  );
}

export function visitBuilding(progress: Progress, id: BuildingId): Progress {
  if (progress.visitedBuildings.includes(id)) return progress;
  return { ...progress, visitedBuildings: [...progress.visitedBuildings, id] };
}

/** Saves the current run of a mission (and makes it the last played). */
export function setRun(progress: Progress, mission: MissionStructure, run: Run): Progress {
  return {
    ...progress,
    lastMission: mission.id,
    missions: {
      ...progress.missions,
      [mission.id]: { completedOnce: progress.missions[mission.id]?.completedOnce ?? false, run },
    },
  };
}

export function audienceOf(progress: Progress): Audience {
  return progress.audience ?? DEFAULT_AUDIENCE;
}

export function setAudience(progress: Progress, audience: Audience): Progress {
  return progress.audience === audience ? progress : { ...progress, audience };
}
