import { useEffect, useRef, useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import { artFor } from '../../content/art.ts';
import type { TraceText } from '../../content/missions/text-types.ts';
import type { TraceStep } from '../../content/types.ts';
import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import { completeRumourStep } from './flow.ts';
import type { RumourViewProps } from './types.ts';

/** "Følg sporet": reveal the shares one step further back, until the source; then say how it started. */
export function TraceView({
  step,
  text,
  guide,
  guideName,
  run,
  advance,
}: RumourViewProps & { step: TraceStep; text: TraceText }) {
  const { m } = useI18n();
  const [shown, setShown] = useState(1);
  const [answer, setAnswer] = useState<string | null>(null);
  const newest = useRef<HTMLElement>(null);
  const feedback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shown > 1) newest.current?.focus();
  }, [shown]);
  useEffect(() => {
    if (answer !== null) feedback.current?.focus();
  }, [answer]);

  const atSource = shown >= step.hops.length;
  const lastShown = step.hops[shown - 1];
  const option = step.options.find((o) => o.id === answer);

  return (
    <section class="rumour">
      <h2>{text.heading}</h2>
      <Guide portrait={guide} name={guideName}>
        <p>{text.brief}</p>
      </Guide>
      <ol class="trail">
        {step.hops.slice(0, shown).map((hop, i) => {
          const t = text.hops[hop.id];
          const image = hop.image ? artFor(hop.image) : undefined;
          const isSource = atSource && i === step.hops.length - 1;
          if (!t) return null;
          return (
            <li key={hop.id} class={isSource ? 'trail__hop trail__hop--source' : 'trail__hop'}>
              <article ref={i === shown - 1 ? newest : null} tabIndex={-1}>
                {isSource && <p class="trail__badge">{m.rumour.source}</p>}
                <h3 class="trail__who">{t.who}</h3>
                <p class="trail__where">{t.where}</p>
                <p class="trail__body">{t.body}</p>
                {image && (
                  <img
                    class="trail__picture"
                    src={image.src}
                    width={image.width}
                    height={image.height}
                    alt=""
                  />
                )}
                {t.note && (
                  <p class="trail__note">
                    <span aria-hidden="true">🔍 </span>
                    {t.note}
                  </p>
                )}
              </article>
            </li>
          );
        })}
      </ol>

      {!atSource && lastShown && (
        <div class="actions">
          <button type="button" class="button" onClick={() => setShown((n) => n + 1)}>
            {format(m.rumour.askSource, { who: text.hops[lastShown.id]?.who ?? '' })}
          </button>
        </div>
      )}

      {atSource && answer === null && (
        <fieldset class="rumour-options">
          <legend>{text.question}</legend>
          {step.options.map((o) => (
            <button
              key={o.id}
              type="button"
              class="button button--secondary rumour-option"
              onClick={() => setAnswer(o.id)}
            >
              {text.options[o.id]?.label}
            </button>
          ))}
        </fieldset>
      )}

      {option && (
        <div
          ref={feedback}
          tabIndex={-1}
          class={option.correct ? 'feedback feedback--correct' : 'feedback feedback--wrong'}
        >
          <h3>
            <span aria-hidden="true">{option.correct ? '✓ ' : '✗ '}</span>
            {option.correct ? m.rumour.rightHeading : m.rumour.wrongHeading}
          </h3>
          <p>{text.options[option.id]?.feedback}</p>
          {option.correct && (
            <Guide portrait={guide} name={guideName}>
              <p>{text.done}</p>
            </Guide>
          )}
          <div class="actions">
            {option.correct ? (
              <button
                type="button"
                class="button"
                onClick={() => advance(completeRumourStep(run, step.id))}
              >
                {m.rumour.next}
              </button>
            ) : (
              <button type="button" class="button" onClick={() => setAnswer(null)}>
                {m.rumour.tryAgain}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
