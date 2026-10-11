import { useEffect, useRef, useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import { Rich } from '../../components/Rich.tsx';
import { artFor } from '../../content/art.ts';
import type { ChatMessage, ChatText } from '../../content/missions/text-types.ts';
import type { ChatStep } from '../../content/types.ts';
import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import { useHeadingFocus } from '../useHeadingFocus.ts';
import { completeRumourStep } from './flow.ts';
import type { RumourViewProps } from './types.ts';

/** How long each round of a spreading rumour shows before the next. */
const ROUND_MS = 900;

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** A chat thread: react to the message, then see what happens. Wrong choices can be undone. */
export function ChatView({
  step,
  text,
  guide,
  guideName,
  run,
  advance,
}: RumourViewProps & { step: ChatStep; text: ChatText }) {
  const { m, locale } = useI18n();
  const [choice, setChoice] = useState<string | null>(null);
  const [rounds, setRounds] = useState(0);
  const heading = useHeadingFocus(choice === null ? 'ask' : 'answered');
  const feedback = useRef<HTMLDivElement>(null);

  const option = step.options.find((o) => o.id === choice);
  const spread = option?.spread ?? [];
  const spreading = rounds < spread.length;

  // A spreading rumour shows one round at a time; with reduced motion, all at once.
  useEffect(() => {
    if (!option || !spreading) return;
    if (reducedMotion()) {
      setRounds(spread.length);
      return;
    }
    const timer = window.setTimeout(() => setRounds((r) => r + 1), rounds === 0 ? 0 : ROUND_MS);
    return () => window.clearTimeout(timer);
  }, [option, spreading, rounds, spread.length]);

  useEffect(() => {
    if (option && !spreading) feedback.current?.focus();
  }, [option, spreading]);

  const t = choice ? text.options[choice] : undefined;
  const image = step.image ? artFor(step.image) : undefined;
  const thread: ChatMessage[] = [...text.messages];
  const last = text.messages.length - 1;
  const reset = () => {
    setChoice(null);
    setRounds(0);
  };

  return (
    <section class="rumour">
      <h2 ref={heading} tabIndex={-1}>
        {text.heading}
      </h2>
      {choice === null && (
        <Guide portrait={guide} name={guideName}>
          <p>{text.brief}</p>
        </Guide>
      )}
      <div class="chat">
        <p class="chat__thread">{text.thread}</p>
        <ul class="chat__messages">
          {thread.map((msg, i) => (
            <li key={`${msg.from}-${i}`} class="chat__msg">
              <strong class="chat__from">{msg.from}</strong>
              <span>{msg.body}</span>
              {i === last && image && (
                <img
                  class="chat__picture"
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  alt=""
                />
              )}
            </li>
          ))}
          {t?.says && (
            <li class="chat__msg chat__msg--me">
              <strong class="chat__from">{m.rumour.me}</strong>
              <span>{t.says}</span>
            </li>
          )}
          {!spreading &&
            t?.outcome.map((msg, i) => (
              <li key={`out-${msg.from}-${i}`} class="chat__msg">
                <strong class="chat__from">{msg.from}</strong>
                <span>{msg.body}</span>
              </li>
            ))}
        </ul>
      </div>

      {choice === null && (
        <fieldset class="rumour-options">
          <legend>{text.prompt}</legend>
          {step.options.map((o) => (
            <button
              key={o.id}
              type="button"
              class="button button--secondary rumour-option"
              onClick={() => setChoice(o.id)}
            >
              {text.options[o.id]?.label}
            </button>
          ))}
        </fieldset>
      )}

      {spread.length > 0 && (
        <ol class="spread" aria-live="polite">
          {spread.slice(0, rounds).map((count, i) => (
            <li key={count} class="spread__round">
              <strong>{format(m.rumour.reached, { count: count.toLocaleString(locale) })}</strong>{' '}
              {t?.spread?.[i]}
            </li>
          ))}
        </ol>
      )}

      {option && t && !spreading && (
        <div
          ref={feedback}
          tabIndex={-1}
          class={option.correct ? 'feedback feedback--correct' : 'feedback feedback--wrong'}
        >
          <h3>
            <span aria-hidden="true">{option.correct ? '✓ ' : '✗ '}</span>
            {option.correct ? m.rumour.rightHeading : m.rumour.wrongHeading}
          </h3>
          <Guide portrait={guide} name={guideName}>
            <p>
              <Rich text={t.explain} />
            </p>
            {option.correct && <p>{text.done}</p>}
          </Guide>
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
              <button type="button" class="button" onClick={reset}>
                {m.rumour.tryAgain}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
