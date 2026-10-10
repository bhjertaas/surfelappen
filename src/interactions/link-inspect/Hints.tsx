import { Rich } from '../../components/Rich.tsx';
import { useI18n } from '../../i18n/i18n.ts';

interface Props {
  hints: readonly [string, string];
  shown: number;
  onShowMore: () => void;
}

/** Two hint levels, always available (PRD "Feedback and hints"). New hints are announced politely. */
export function Hints({ hints, shown, onShowMore }: Props) {
  const { m } = useI18n();
  return (
    <div class="hints">
      {shown < hints.length && (
        <button type="button" class="button button--secondary" onClick={onShowMore}>
          {shown === 0 ? m.linkInspect.hint : m.linkInspect.hintMore}
        </button>
      )}
      <div aria-live="polite">
        {hints.slice(0, shown).map((hint) => (
          <p key={hint} class="hint">
            <strong>{m.linkInspect.hintHeading}:</strong> <Rich text={hint} />
          </p>
        ))}
      </div>
    </div>
  );
}
