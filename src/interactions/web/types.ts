import type { WebRun } from '../../progress/schema.ts';

/** What every web step view gets besides its step and text. */
export interface WebViewProps {
  guide: string;
  guideName: string;
  run: WebRun;
  advance: (run: WebRun) => void;
}
