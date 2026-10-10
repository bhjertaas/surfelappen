import type { MissionId, MissionStructure } from '../types.ts';
import { findTheImpostor } from './find-the-impostor/structure.ts';
import { perfectLife } from './perfect-life/structure.ts';
import { tenFingers } from './ten-fingers/structure.ts';

/** Every mission in this release. Content tests run over this list. */
export const missions = [
  findTheImpostor,
  tenFingers,
  perfectLife,
] as const satisfies readonly MissionStructure[];

export function findMission(id: MissionId): MissionStructure | undefined {
  return missions.find((m) => m.id === id);
}
