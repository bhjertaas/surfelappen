import { Rich } from '../../components/Rich.tsx';
import type { InfoText } from '../../content/missions/text-types.ts';
import type { InfoStep } from '../../content/types.ts';
import { useI18n } from '../../i18n/i18n.ts';
import type { LinkInspectRun } from '../../progress/schema.ts';
import { solveStep } from './flow.ts';

interface Props {
  step: InfoStep;
  text: InfoText;
  run: LinkInspectRun;
  advance: (run: LinkInspectRun) => void;
}

/** A single text screen, e.g. the habit tip or the transfer intro. */
export function InfoView({ step, text, run, advance }: Props) {
  const { m } = useI18n();
  return (
    <>
      <h2>{text.heading}</h2>
      {text.body.map((paragraph) => (
        <p key={paragraph}>
          <Rich text={paragraph} />
        </p>
      ))}
      <div class="actions">
        <button type="button" class="button" onClick={() => advance(solveStep(run, step.id))}>
          {m.linkInspect.next}
        </button>
      </div>
    </>
  );
}
