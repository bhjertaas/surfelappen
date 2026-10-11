import { useEffect, useRef, useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import type { ClassifyText } from '../../content/missions/text-types.ts';
import type { ClassifyStep, WebBin } from '../../content/types.ts';
import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import {
  type ClassifyState,
  choose,
  currentCard,
  isFinished,
  isRight,
  next,
  retry,
  START,
  sortedInto,
} from './classify.ts';
import { completeWebStep } from './flow.ts';
import type { WebViewProps } from './types.ts';
import { useHeadingFocus } from './useHeadingFocus.ts';

const BINS: readonly WebBin[] = ['browser', 'search', 'site'];

/** "Hvem er hvem?": sort names into browser, search engine or website, one at a time. */
export function ClassifyView({
  step,
  text,
  guide,
  guideName,
  run,
  advance,
}: WebViewProps & { step: ClassifyStep; text: ClassifyText }) {
  const { m } = useI18n();
  const [state, setState] = useState<ClassifyState>(START);
  const feedback = useRef<HTMLDivElement>(null);
  const heading = useHeadingFocus(state.index);

  useEffect(() => {
    if (state.answer !== null) feedback.current?.focus();
  }, [state.answer]);

  const bins = (
    <div class="web-bins">
      {BINS.map((bin) => (
        <div key={bin} class="web-bin">
          <h3>{m.web.bins[bin]}</h3>
          <ul>
            {sortedInto(step, state, bin).map((id) => (
              <li key={id}>{text.cards[id]?.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  if (isFinished(step, state)) {
    return (
      <section class="web">
        <h2 ref={heading} tabIndex={-1}>
          {m.web.headings.classify}
        </h2>
        {bins}
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

  const card = currentCard(step, state);
  const cardText = card ? text.cards[card.id] : undefined;
  if (!card || !cardText) return null;
  const right = isRight(step, state);
  const answered = state.answer !== null;

  return (
    <section class="web">
      <h2 ref={heading} tabIndex={-1}>
        {m.web.headings.classify}
      </h2>
      <p class="step-progress">
        {format(m.web.cardProgress, { current: state.index + 1, total: step.cards.length })}
      </p>
      {state.index === 0 && (
        <Guide portrait={guide} name={guideName}>
          <p>{text.brief}</p>
        </Guide>
      )}
      <p class="web-card" key={card.id}>
        {cardText.name}
      </p>
      {!answered && (
        <div class="actions web-choices">
          {BINS.map((bin) => (
            <button
              key={bin}
              type="button"
              class="button"
              onClick={() => setState((s) => choose(step, s, bin))}
            >
              {m.web.bins[bin]}
            </button>
          ))}
        </div>
      )}
      {answered && (
        <div
          ref={feedback}
          tabIndex={-1}
          class={right ? 'feedback feedback--correct' : 'feedback feedback--wrong'}
        >
          <h3>
            <span aria-hidden="true">{right ? '✓ ' : '✗ '}</span>
            {right ? m.web.rightHeading : m.web.wrongHeading}
          </h3>
          <p>{right ? cardText.right : cardText.wrong}</p>
          <div class="actions">
            <button type="button" class="button" onClick={() => setState(right ? next : retry)}>
              {right ? m.web.next : m.web.tryAgain}
            </button>
          </div>
        </div>
      )}
      {bins}
    </section>
  );
}
