import { useEffect, useRef, useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import { Rich } from '../../components/Rich.tsx';
import { artFor } from '../../content/art.ts';
import { audioFor } from '../../content/audio.ts';
import type { TimelineText } from '../../content/missions/text-types.ts';
import type { TimelineStep } from '../../content/types.ts';
import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import { completeWebStep } from './flow.ts';
import type { WebViewProps } from './types.ts';

/**
 * "Tidsreisen": moments of the net's history, to page through or to play as a short
 * narrated film. The card text is what the narrator says, so it doubles as subtitles.
 * Nothing plays until the player presses play; pause stops it at once.
 */
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
  const [playing, setPlaying] = useState(false);
  const player = useRef<HTMLAudioElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  const event = step.events[index];
  const last = index === step.events.length - 1;

  // Paging by hand moves focus to the heading; while the film plays, focus stays on pause.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!playing) heading.current?.focus();
  }, [index]);

  // While playing, each card speaks its own narration.
  useEffect(() => {
    const audio = player.current;
    const src = event ? audioFor(event.voice) : undefined;
    if (!audio) return;
    if (!playing || !src) {
      audio.pause();
      return;
    }
    if (!audio.src.endsWith(src)) audio.src = src;
    audio.play().catch(() => setPlaying(false));
  }, [playing, event]);

  useEffect(() => () => player.current?.pause(), []);

  if (!event) return null;
  const t = text.events[event.id];
  const image = artFor(event.image);
  if (!t) return null;

  const onEnded = () => {
    if (last) setPlaying(false);
    else setIndex((i) => i + 1);
  };

  return (
    <section class="web">
      <h2 ref={heading} tabIndex={-1}>
        {m.web.headings.timeline}
      </h2>
      {index === 0 && !playing && (
        <Guide portrait={guide} name={guideName}>
          <p>{text.brief}</p>
        </Guide>
      )}
      {/* biome-ignore lint/a11y/useMediaCaption: the card text below is the transcript. */}
      <audio ref={player} preload="none" onEnded={onEnded} />
      <div class="actions timeline-play">
        <button
          type="button"
          class="button"
          aria-pressed={playing}
          onClick={() => setPlaying((p) => !p)}
        >
          <span aria-hidden="true">{playing ? '❚❚ ' : '▶ '}</span>
          {playing ? m.web.pause : m.web.play}
        </button>
      </div>
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
        {image && (
          <img
            class="timeline-card__picture"
            src={image.src}
            width={image.width}
            height={image.height}
            alt=""
          />
        )}
        <p class="timeline-card__year">{event.year}</p>
        <h3>{t.title}</h3>
        <p>
          <Rich text={t.body} />
        </p>
        <p class="step-progress">
          {format(m.web.eventProgress, { current: index + 1, total: step.events.length })}
        </p>
      </article>
      {last && !playing && (
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
            onClick={() => {
              setPlaying(false);
              advance(completeWebStep(run, step.id));
            }}
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
