import { missions as allMissions } from '../content/missions/index.ts';
import { stickers as allStickers } from '../content/stickers.ts';
import { buildings as allBuildings } from '../content/town.ts';
import type {
  Building,
  MissionStructure,
  Sticker,
  StickerCondition,
  StickerId,
} from '../content/types.ts';
import { transferFirstTry } from '../interactions/link-inspect/flow.ts';
import { currentStep } from '../interactions/progress.ts';
import type { Progress, Run } from './schema.ts';

/**
 * Sticker rules (FR-07). Applied after every progress change, so a sticker is
 * awarded the moment it's earned, wherever that happens. Stickers are never
 * taken away, except by a full reset.
 */

function conditionMet(condition: StickerCondition, mission: MissionStructure, run: Run): boolean {
  switch (condition) {
    case 'transfer-first-try':
      return (
        mission.interaction === 'link-inspect' &&
        run.interaction === 'link-inspect' &&
        transferFirstTry(mission, run)
      );
    case 'final-line-flawless':
      return run.interaction === 'typing' && run.finalErrors === 0;
  }
}

function earned(
  sticker: Sticker,
  progress: Progress,
  missions: readonly MissionStructure[],
  buildings: readonly Building[],
): boolean {
  const rule = sticker.awardedBy;
  if ('town' in rule) return buildings.every((b) => progress.visitedBuildings.includes(b.id));
  const mission = missions.find((m) => m.id === rule.mission);
  const entry = progress.missions[rule.mission];
  if (!mission || !entry) return false;
  if (!('condition' in rule)) return entry.completedOnce;
  // Conditions are judged on a finished playthrough.
  return (
    currentStep(mission, entry.run) === 'done' && conditionMet(rule.condition, mission, entry.run)
  );
}

/** Marks finished runs as completed and adds newly earned stickers. Same object if nothing changed. */
export function applyAwards(
  progress: Progress,
  missions: readonly MissionStructure[] = allMissions,
  stickers: readonly Sticker[] = allStickers,
  buildings: readonly Building[] = allBuildings,
): Progress {
  let next = progress;

  for (const mission of missions) {
    const entry = next.missions[mission.id];
    if (entry && !entry.completedOnce && currentStep(mission, entry.run) === 'done') {
      next = {
        ...next,
        missions: { ...next.missions, [mission.id]: { ...entry, completedOnce: true } },
      };
    }
  }

  const fresh: StickerId[] = stickers
    .filter((s) => !next.stickers.includes(s.id) && earned(s, next, missions, buildings))
    .map((s) => s.id);
  return fresh.length > 0 ? { ...next, stickers: [...next.stickers, ...fresh] } : next;
}
