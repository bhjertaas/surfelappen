import type { MissionStructure } from '../types.ts';
import { findTheImpostor } from './find-the-impostor/structure.ts';

/** Every mission in this release. Content tests run over this list. */
export const missions = [findTheImpostor] as const satisfies readonly MissionStructure[];
