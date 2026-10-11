import type { RumourRun } from '../../progress/schema.ts';

/** What every rumour step view gets besides its step and text. */
export interface RumourViewProps {
  guide: string;
  guideName: string;
  run: RumourRun;
  advance: (run: RumourRun) => void;
}
