import { useEffect, useRef, useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import { Rich } from '../../components/Rich.tsx';
import type { AddressText } from '../../content/missions/text-types.ts';
import type { AddressStep } from '../../content/types.ts';
import { useI18n } from '../../i18n/i18n.ts';
import { useHeadingFocus } from '../useHeadingFocus.ts';
import { completeWebStep } from './flow.ts';
import type { WebViewProps } from './types.ts';

/**
 * "Les adressen": tap every part of an address to learn what it is, then tap the
 * part that answers the question. Three addresses: web, email, and a search.
 */
export function AddressView({
  step,
  text,
  guide,
  guideName,
  run,
  advance,
}: WebViewProps & { step: AddressStep; text: AddressText }) {
  const { m } = useI18n();
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState<string[]>([]);
  const [shown, setShown] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const heading = useHeadingFocus(index);
  const feedback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answer !== null) feedback.current?.focus();
  }, [answer]);

  const address = step.addresses[index];
  if (!address) {
    return (
      <section class="web">
        <h2 ref={heading} tabIndex={-1}>
          {m.web.headings.address}
        </h2>
        <Guide portrait={guide} name={guideName}>
          <p>{text.done}</p>
        </Guide>
        <div class="actions">
          <button
            type="button"
            class="button"
            onClick={() => advance(completeWebStep(run, step.id))}
          >
            {m.web.next}
          </button>
        </div>
      </section>
    );
  }

  const t = text.addresses[address.id];
  if (!t) return null;
  const asking = address.parts.every((p) => seen.includes(p.id));
  const right = answer === address.answer;

  const tap = (partId: string) => {
    if (!asking) {
      setShown(partId);
      setSeen((s) => (s.includes(partId) ? s : [...s, partId]));
    } else if (!right) {
      setAnswer(partId);
    }
  };

  return (
    <section class="web">
      <h2 ref={heading} tabIndex={-1}>
        {m.web.headings.address}
      </h2>
      {index === 0 && (
        <Guide portrait={guide} name={guideName}>
          <p>{text.brief}</p>
        </Guide>
      )}
      <p>{t.intro}</p>
      <fieldset class="address-parts">
        <legend class="visually-hidden">{m.web.partsLabel}</legend>
        {address.parts.map((part) => {
          const state =
            asking && answer === part.id
              ? right
                ? 'address-part address-part--right'
                : 'address-part address-part--wrong'
              : seen.includes(part.id)
                ? 'address-part address-part--seen'
                : 'address-part';
          return (
            <button
              key={part.id}
              type="button"
              class={state}
              aria-pressed={!asking ? shown === part.id : undefined}
              onClick={() => tap(part.id)}
            >
              {part.text}
            </button>
          );
        })}
      </fieldset>
      {!asking && (
        <div class="address-explain" aria-live="polite">
          {shown && t.parts[shown] ? (
            <p>
              <Rich text={t.parts[shown] ?? ''} />
            </p>
          ) : (
            <p class="muted">{m.web.allParts}</p>
          )}
        </div>
      )}
      {asking && answer === null && (
        <div class="address-question">
          <p>
            <strong>{t.question}</strong>
          </p>
          <p class="muted">{m.web.answerPrompt}</p>
        </div>
      )}
      {asking && answer !== null && (
        <div
          ref={feedback}
          tabIndex={-1}
          class={right ? 'feedback feedback--correct' : 'feedback feedback--wrong'}
        >
          <h3>
            <span aria-hidden="true">{right ? '✓ ' : '✗ '}</span>
            {right ? m.web.rightHeading : m.web.wrongHeading}
          </h3>
          <p>{right ? t.right : t.wrong}</p>
          <div class="actions">
            <button
              type="button"
              class="button"
              onClick={() => {
                if (right) {
                  setIndex((i) => i + 1);
                  setSeen([]);
                  setShown(null);
                }
                setAnswer(null);
              }}
            >
              {right ? m.web.next : m.web.tryAgain}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
