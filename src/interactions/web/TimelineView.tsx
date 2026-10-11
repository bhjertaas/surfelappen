import { useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import { Rich } from '../../components/Rich.tsx';
import type { TimelineText } from '../../content/missions/text-types.ts';
import type { TimelineStep } from '../../content/types.ts';
import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import { completeWebStep } from './flow.ts';
import type { WebViewProps } from './types.ts';
import { useHeadingFocus } from './useHeadingFocus.ts';

/** "Tidsreisen": page through moments of the net's history. Nothing to answer. */
export function TimelineView({
  step,
  text,
  guide,
  guideName,
  run,
  advance,
}: WebViewProps & { step: TimelineStep; text: TimelineText }) {
  const { m } = useI18n();
  const [index, setIndex] = useState(0);
  const heading = useHeadingFocus(index);
  const event = step.events[index];
  const t = event ? text.events[event.id] : undefined;
  if (!event || !t) return null;
  const last = index === step.events.length - 1;

  return (
    <section class="web">
      <h2 ref={heading} tabIndex={-1}>
        {m.web.headings.timeline}
      </h2>
      {index === 0 && (
        <Guide portrait={guide} name={guideName}>
          <p>{text.brief}</p>
        </Guide>
      )}
      <nav class="timeline-years" aria-label={m.web.headings.timeline}>
        {step.events.map((e, i) => (
          <button
            key={e.id}
            type="button"
            class="timeline-year"
            aria-current={i === index ? 'step' : undefined}
            onClick={() => setIndex(i)}
          >
            {e.year}
          </button>
        ))}
      </nav>
      <article class="timeline-card" key={event.id}>
        <p class="timeline-card__year">{event.year}</p>
        <h3>{t.title}</h3>
        <p>
          <Rich text={t.body} />
        </p>
        <p class="step-progress">
          {format(m.web.eventProgress, { current: index + 1, total: step.events.length })}
        </p>
      </article>
      {last && (
        <Guide portrait={guide} name={guideName}>
          <p>{text.done}</p>
        </Guide>
      )}
      <div class="actions">
        <button
          type="button"
          class="button button--secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
        >
          {m.web.previous}
        </button>
        {last ? (
          <button
            type="button"
            class="button"
            onClick={() => advance(completeWebStep(run, step.id))}
          >
            {m.web.finish}
          </button>
        ) : (
          <button type="button" class="button" onClick={() => setIndex((i) => i + 1)}>
            {m.web.next}
          </button>
        )}
      </div>
    </section>
  );
}
