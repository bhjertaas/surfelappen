import { useEffect, useRef, useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import { artFor } from '../../content/art.ts';
import type { InspectText } from '../../content/missions/text-types.ts';
import type { InspectStep, Verdict } from '../../content/types.ts';
import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import { useHeadingFocus } from '../useHeadingFocus.ts';
import { completeRumourStep } from './flow.ts';
import {
  canJudge,
  clueCount,
  cluesFound,
  FRESH,
  judge,
  type PictureCheck,
  retry,
  search,
  tap,
} from './inspect.ts';
import type { RumourViewProps } from './types.ts';

const VERDICTS: readonly Verdict[] = ['old', 'ai', 'real'];

/** "Bildene": search for each picture, tap its parts for clues, then say what it is. */
export function InspectView({
  step,
  text,
  guide,
  guideName,
  run,
  advance,
}: RumourViewProps & { step: InspectStep; text: InspectText }) {
  const { m } = useI18n();
  const [index, setIndex] = useState(0);
  const [check, setCheck] = useState<PictureCheck>(FRESH);
  const heading = useHeadingFocus(index);
  const feedback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (check.verdict !== null) feedback.current?.focus();
  }, [check.verdict]);

  const picture = step.pictures[index];
  if (!picture) {
    return (
      <section class="rumour">
        <h2 ref={heading} tabIndex={-1}>
          {text.heading}
        </h2>
        <Guide portrait={guide} name={guideName}>
          <p>{text.done}</p>
        </Guide>
        <div class="actions">
          <button
            type="button"
            class="button"
            onClick={() => advance(completeRumourStep(run, step.id))}
          >
            {m.rumour.next}
          </button>
        </div>
      </section>
    );
  }

  const t = text.pictures[picture.id];
  const image = artFor(picture.image);
  if (!t || !image) return null;
  const ready = canJudge(picture.spots, check);
  const right = check.verdict === picture.answer;
  const showing = check.showing ? t.spots[check.showing] : undefined;
  const showingSpot = picture.spots.find((s) => s.id === check.showing);

  return (
    <section class="rumour">
      <h2 ref={heading} tabIndex={-1}>
        {text.heading}
      </h2>
      {index === 0 && check === FRESH && (
        <Guide portrait={guide} name={guideName}>
          <p>{text.brief}</p>
        </Guide>
      )}
      <p class="step-progress">
        {format(m.rumour.pictureProgress, { current: index + 1, total: step.pictures.length })}
      </p>
      <p>{t.intro}</p>

      <fieldset class="inspect">
        <legend class="visually-hidden">{m.rumour.spotsLabel}</legend>
        <img src={image.src} width={image.width} height={image.height} alt="" />
        {picture.spots.map((spot) => {
          const tapped = check.tapped.includes(spot.id);
          const found = tapped && spot.clue;
          return (
            <button
              key={spot.id}
              type="button"
              class={`inspect__spot${tapped ? ' inspect__spot--tapped' : ''}${found ? ' inspect__spot--clue' : ''}`}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: `${spot.w}%`,
                height: `${spot.h}%`,
              }}
              aria-pressed={check.showing === spot.id}
              onClick={() => setCheck((c) => tap(c, spot.id))}
            >
              <span class="visually-hidden">{t.spots[spot.id]?.label}</span>
              {found && <span aria-hidden="true">🔍</span>}
            </button>
          );
        })}
      </fieldset>
      <div class="inspect__explain" aria-live="polite">
        {showing ? (
          <p>
            <strong>{showing.label}:</strong> {showing.text}
            {showingSpot && !showingSpot.clue && ` ${m.rumour.nothingOdd}`}
          </p>
        ) : null}
      </div>
      {clueCount(picture.spots) > 0 && (
        <p class="muted">
          {format(m.rumour.cluesFound, {
            found: cluesFound(picture.spots, check),
            total: clueCount(picture.spots),
          })}
        </p>
      )}

      {check.searched ? (
        <section class="search-result" aria-labelledby="search-heading">
          <h3 id="search-heading">{m.rumour.searchHeading}</h3>
          <p>{t.found}</p>
        </section>
      ) : (
        <div class="actions">
          <button type="button" class="button" onClick={() => setCheck((c) => search(c))}>
            <span aria-hidden="true">🔎&nbsp;</span>
            {m.rumour.search}
          </button>
        </div>
      )}

      {check.verdict === null &&
        (ready ? (
          <fieldset class="rumour-options">
            <legend>{m.rumour.verdictQuestion}</legend>
            {VERDICTS.map((v) => (
              <button
                key={v}
                type="button"
                class="button button--secondary rumour-option"
                onClick={() => setCheck((c) => judge(c, v))}
              >
                {m.rumour.verdicts[v]}
              </button>
            ))}
          </fieldset>
        ) : (
          <p class="muted">{check.searched ? m.rumour.needClues : m.rumour.needSearch}</p>
        ))}

      {check.verdict !== null && (
        <div
          ref={feedback}
          tabIndex={-1}
          class={right ? 'feedback feedback--correct' : 'feedback feedback--wrong'}
        >
          <h3>
            <span aria-hidden="true">{right ? '✓ ' : '✗ '}</span>
            {right ? m.rumour.rightHeading : m.rumour.wrongHeading}
          </h3>
          <p>{right ? t.right : t.wrong}</p>
          <div class="actions">
            <button
              type="button"
              class="button"
              onClick={() => {
                if (right) {
                  setIndex((i) => i + 1);
                  setCheck(FRESH);
                } else setCheck((c) => retry(c));
              }}
            >
              {right ? m.rumour.next : m.rumour.tryAgain}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
