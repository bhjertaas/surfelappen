import type { MissionId, MissionStructure } from '../types.ts';
import { findTheImpostor } from './find-the-impostor/structure.ts';
import { howTheNetWorks } from './how-the-net-works/structure.ts';
import { perfectLife } from './perfect-life/structure.ts';
import { securityBasics } from './security-basics/structure.ts';
import { tenFingers } from './ten-fingers/structure.ts';
import { theCounters } from './the-counters/structure.ts';
import { theSharkRumour } from './the-shark-rumour/structure.ts';

/** Every mission in this release. Content tests run over this list. */
export const missions = [
  howTheNetWorks,
  findTheImpostor,
  tenFingers,
  perfectLife,
  theSharkRumour,
  securityBasics,
  theCounters,
] as const satisfies readonly MissionStructure[];

export function findMission(id: MissionId): MissionStructure | undefined {
  return missions.find((m) => m.id === id);
}
