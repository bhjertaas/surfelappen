import { useEffect, useRef, useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import { Rich } from '../../components/Rich.tsx';
import { artFor } from '../../content/art.ts';
import type { ComposeText } from '../../content/missions/text-types.ts';
import type { ComposeStep } from '../../content/types.ts';
import { format, formatNumber } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import type { FacadeRun } from '../../progress/schema.ts';
import {
  canGrow,
  canShrink,
  cropReady,
  type Frame,
  initialFrame,
  likesFor,
  moveFrame,
  NO_POLISH,
  POLISH_MAX,
  type Polish,
  polishFilter,
  resizeFrame,
  subjectInFrame,
  visibleMess,
} from './compose.ts';
import { completeFacadeStep } from './flow.ts';

type Phase = 'crop' | 'polish' | 'caption' | 'posted';

/** How far one press of an arrow button moves the frame, in picture pixels. */
const STEP_PX = 48;

const pct = (value: number, of: number) => `${(value / of) * 100}%`;

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** Counts up to `target` over about a second (at once with reduced motion). */
function useCountUp(target: number, active: boolean): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (reducedMotion()) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1200, 1);
      setValue(Math.round(target * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return value;
}

interface Props {
  step: ComposeStep;
  text: ComposeText;
  guide: string;
  guideName: string;
  run: FacadeRun;
  advance: (run: FacadeRun) => void;
}

/** The chosen square of the picture, polished: what the post shows. Decoration. */
function Crop({
  src,
  step,
  frame,
  polish,
}: {
  src: string;
  step: ComposeStep;
  frame: Frame;
  polish: Polish;
}) {
  const free = (total: number) => (total - frame.size === 0 ? 0 : (1 / (total - frame.size)) * 100);
  return (
    <div
      class="compose__crop"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${(step.width / frame.size) * 100}% auto`,
        backgroundPosition: `${frame.x * free(step.width)}% ${frame.y * free(step.height)}%`,
        filter: polishFilter(polish),
      }}
    />
  );
}

/** "Lag glansbildet": crop away the mess, polish, caption, post, and see what it does. */
export function ComposeView({ step, text, guide, guideName, run, advance }: Props) {
  const { m, locale } = useI18n();
  const image = artFor(step.image);
  const [phase, setPhase] = useState<Phase>('crop');
  const [frame, setFrame] = useState<Frame>(() => initialFrame(step));
  const [polish, setPolish] = useState<Polish>(NO_POLISH);
  const [caption, setCaption] = useState<string | null>(null);
  const [behind, setBehind] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; frame: Frame } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstPhase = useRef(true);

  // Each new phase gets focus on its heading, so screen readers follow along.
  useEffect(() => {
    if (firstPhase.current) {
      firstPhase.current = false;
      return;
    }
    heading.current?.focus();
  }, [phase]);

  const likes = likesFor(step, caption, polish);
  const shownLikes = useCountUp(likes, phase === 'posted');
  if (!image) return null;

  const mess = visibleMess(step, frame);
  const subjectIn = subjectInFrame(step, frame);
  const ready = cropReady(step, frame);
  const list = new Intl.ListFormat(locale, { type: 'conjunction' });

  const move = (dx: number, dy: number) => setFrame((f) => moveFrame(step, f, dx, dy));

  if (phase === 'crop') {
    return (
      <section class="compose">
        <Guide portrait={guide} name={guideName}>
          <p>{text.brief}</p>
        </Guide>
        <div class="compose__stage" ref={stage}>
          <img
            class="compose__picture"
            src={image.src}
            width={step.width}
            height={step.height}
            alt=""
          />
          <div
            class={ready ? 'compose__frame compose__frame--ready' : 'compose__frame'}
            aria-hidden="true"
            style={{
              left: pct(frame.x, step.width),
              top: pct(frame.y, step.height),
              width: pct(frame.size, step.width),
              height: pct(frame.size, step.height),
            }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = { x: e.clientX, y: e.clientY, frame };
            }}
            onPointerMove={(e) => {
              const start = drag.current;
              const width = stage.current?.clientWidth;
              if (!start || !width) return;
              const scale = step.width / width;
              setFrame(
                moveFrame(
                  step,
                  start.frame,
                  (e.clientX - start.x) * scale,
                  (e.clientY - start.y) * scale,
                ),
              );
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
          />
        </div>
        <p class="muted">{m.facade.dragHint}</p>
        <fieldset class="compose__controls">
          <legend class="visually-hidden">{m.facade.frameLabel}</legend>
          <button
            type="button"
            class="button button--secondary"
            aria-label={m.facade.left}
            onClick={() => move(-STEP_PX, 0)}
          >
            ←
          </button>
          <button
            type="button"
            class="button button--secondary"
            aria-label={m.facade.up}
            onClick={() => move(0, -STEP_PX)}
          >
            ↑
          </button>
          <button
            type="button"
            class="button button--secondary"
            aria-label={m.facade.down}
            onClick={() => move(0, STEP_PX)}
          >
            ↓
          </button>
          <button
            type="button"
            class="button button--secondary"
            aria-label={m.facade.right}
            onClick={() => move(STEP_PX, 0)}
          >
            →
          </button>
          <button
            type="button"
            class="button button--secondary"
            disabled={!canShrink(step, frame)}
            onClick={() => setFrame((f) => resizeFrame(step, f, 1))}
          >
            {m.facade.smaller}
          </button>
          <button
            type="button"
            class="button button--secondary"
            disabled={!canGrow(step, frame)}
            onClick={() => setFrame((f) => resizeFrame(step, f, -1))}
          >
            {m.facade.larger}
          </button>
        </fieldset>
        <div class="compose__status" aria-live="polite">
          {mess.length > 0 && (
            <p>
              {format(m.facade.messLeft, {
                list: list.format(mess.map((id) => text.mess[id] ?? id)),
              })}
            </p>
          )}
          {!subjectIn && <p>{format(m.facade.subjectOut, { name: text.subjectName })}</p>}
          {ready && <p class="compose__ready">✓ {m.facade.cropReady}</p>}
        </div>
        <div class="actions">
          <button type="button" class="button" disabled={!ready} onClick={() => setPhase('polish')}>
            {m.facade.cropNext}
          </button>
        </div>
      </section>
    );
  }

  if (phase === 'polish') {
    const slider = (key: keyof Polish, label: string) => (
      <label class="compose__slider">
        <span>{label}</span>
        <input
          type="range"
          min={0}
          max={POLISH_MAX}
          step={1}
          value={polish[key]}
          onInput={(e) => {
            const value = Number(e.currentTarget.value);
            setPolish((p) => ({ ...p, [key]: value }));
          }}
        />
      </label>
    );
    return (
      <section class="compose">
        <h2 ref={heading} tabIndex={-1}>
          {m.facade.polishHeading}
        </h2>
        <Guide portrait={guide} name={guideName}>
          <p>{text.cropDone}</p>
          <p>{text.polishIntro}</p>
        </Guide>
        <div class="compose__polish">
          <Crop src={image.src} step={step} frame={frame} polish={polish} />
          <div class="compose__sliders">
            {slider('light', m.facade.light)}
            {slider('glow', m.facade.glow)}
            {slider('warmth', m.facade.warmth)}
            <p class="compose__forecast" aria-live="polite">
              {format(m.facade.forecast, { likes: formatNumber(locale, likes) })}
            </p>
          </div>
        </div>
        <div class="actions">
          <button type="button" class="button" onClick={() => setPhase('caption')}>
            {m.facade.toCaption}
          </button>
        </div>
      </section>
    );
  }

  if (phase === 'caption') {
    return (
      <section class="compose">
        <h2 ref={heading} tabIndex={-1}>
          {m.facade.captionHeading}
        </h2>
        <Guide portrait={guide} name={guideName}>
          <p>{text.captionIntro}</p>
        </Guide>
        <fieldset class="options">
          <legend class="visually-hidden">{m.facade.captionHeading}</legend>
          {step.captions.map((c) => (
            <button
              key={c.id}
              type="button"
              class="option"
              aria-pressed={caption === c.id}
              onClick={() => setCaption(c.id)}
            >
              <span class="option__label">{text.captions[c.id]}</span>
            </button>
          ))}
        </fieldset>
        <div class="actions">
          <button
            type="button"
            class="button"
            disabled={caption === null}
            onClick={() => setPhase('posted')}
          >
            {m.facade.post}
          </button>
        </div>
      </section>
    );
  }

  const chosen = caption ?? step.captions[0]?.id ?? '';
  return (
    <section class="compose">
      <h2 ref={heading} tabIndex={-1}>
        {m.facade.postedHeading}
      </h2>
      <article class="post">
        <p class="post__account">
          <span class="post__avatar" aria-hidden="true" />
          {text.account}
        </p>
        {behind ? (
          <div class="compose__stage compose__stage--reveal">
            <img
              class="compose__picture"
              src={image.src}
              width={step.width}
              height={step.height}
              alt=""
            />
            <div
              class="compose__frame compose__frame--ready"
              aria-hidden="true"
              style={{
                left: pct(frame.x, step.width),
                top: pct(frame.y, step.height),
                width: pct(frame.size, step.width),
                height: pct(frame.size, step.height),
              }}
            />
          </div>
        ) : (
          <Crop src={image.src} step={step} frame={frame} polish={polish} />
        )}
        <p class="post__likes">
          <span aria-hidden="true">♥ </span>
          {format(m.facade.likes, { likes: formatNumber(locale, shownLikes) })}
        </p>
        <p class="post__caption">
          <strong>{text.account}</strong> {text.captions[chosen]}
        </p>
        <ul class="post__comments" aria-label={m.facade.commentsLabel}>
          {(text.comments[chosen] ?? []).map((c) => (
            <li key={c}>{c}</li>
          ))}
          <li class="post__sara">
            <strong>{text.saraAccount}</strong> {text.saraComment[chosen]}
          </li>
        </ul>
      </article>
      {behind && (
        <p class="compose__reveal">
          <Rich text={text.reveal} />
        </p>
      )}
      <Guide portrait={guide} name={guideName}>
        <p>{format(text.reaction[chosen] ?? '', { likes: formatNumber(locale, likes) })}</p>
      </Guide>
      <div class="actions">
        <button
          type="button"
          class="button button--secondary"
          aria-pressed={behind}
          onClick={() => setBehind((b) => !b)}
        >
          {behind ? m.facade.front : m.facade.behind}
        </button>
        <button
          type="button"
          class="button"
          onClick={() => advance(completeFacadeStep(run, step.id))}
        >
          {m.facade.next}
        </button>
      </div>
    </section>
  );
}
