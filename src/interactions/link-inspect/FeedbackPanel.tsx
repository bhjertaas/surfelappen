import type { ComponentChildren } from 'preact';
import { useEffect, useId, useRef } from 'preact/hooks';
import { Rich } from '../../components/Rich.tsx';
import { useI18n } from '../../i18n/i18n.ts';

interface Props {
  correct: boolean;
  text: string;
  /** Changes on every answer, so focus moves to the panel each time. */
  attempt: number;
  onNext: () => void;
  onTryAgain: () => void;
  children?: ComponentChildren;
}

/**
 * Feedback after an answer. Focus moves here, which makes screen readers read it
 * once (FR-03); the panel is not also a live region.
 */
export function FeedbackPanel({ correct, text, attempt, onNext, onTryAgain, children }: Props) {
  const { m } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const headingId = useId();

  // Runs again on every new answer (`attempt`), so focus moves each time.
  useEffect(() => {
    ref.current?.focus();
  }, [attempt]);

  return (
    <section
      ref={ref}
      tabIndex={-1}
      class={correct ? 'feedback feedback--correct' : 'feedback feedback--wrong'}
      aria-labelledby={headingId}
    >
      <h2 id={headingId}>
        <span class="feedback__symbol" aria-hidden="true">
          {correct ? '✓' : '✗'}
        </span>{' '}
        {correct ? m.linkInspect.correctHeading : m.linkInspect.wrongHeading}
      </h2>
      <p>
        <Rich text={text} />
      </p>
      {children}
      <div class="actions">
        {correct ? (
          <button type="button" class="button" onClick={onNext}>
            {m.linkInspect.next}
          </button>
        ) : (
          <button type="button" class="button" onClick={onTryAgain}>
            {m.linkInspect.tryAgain}
          </button>
        )}
      </div>
    </section>
  );
}
