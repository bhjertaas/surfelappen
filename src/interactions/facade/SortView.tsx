import { useEffect, useRef, useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import { artFor } from '../../content/art.ts';
import type { SortText } from '../../content/missions/text-types.ts';
import type { SortStep } from '../../content/types.ts';
import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import type { FacadeRun } from '../../progress/schema.ts';
import { completeFacadeStep } from './flow.ts';
import {
  answer,
  currentPost,
  firstTryCount,
  isFinished,
  isRight,
  next,
  retry,
  type SortState,
  START,
  transferFlawless,
  type Verdict,
} from './sort.ts';

interface Props {
  step: SortStep;
  text: SortText;
  guide: string;
  guideName: string;
  run: FacadeRun;
  advance: (run: FacadeRun) => void;
}

/** "Reklamejakt": one post at a time; look closer, then sort it as advertising or not. */
export function SortView({ step, text, guide, guideName, run, advance }: Props) {
  const { m } = useI18n();
  const [state, setState] = useState<SortState>(START);
  const [closer, setCloser] = useState(false);
  const feedback = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Feedback gets focus when it appears; a new post moves focus to its heading.
  useEffect(() => {
    if (state.answer !== null) feedback.current?.focus();
  }, [state.answer]);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [state.index]);

  const total = step.posts.length;
  if (isFinished(step, state)) {
    return (
      <section class="compose">
        <h2 ref={heading} tabIndex={-1}>
          {m.facade.sortHeading}
        </h2>
        <Guide portrait={guide} name={guideName}>
          <p>{text.done}</p>
        </Guide>
        <p>{format(m.facade.firstTry, { count: firstTryCount(step, state), total })}</p>
        <div class="actions">
          <button
            type="button"
            class="button"
            onClick={() => advance(completeFacadeStep(run, step.id, transferFlawless(step, state)))}
          >
            {m.facade.finish}
          </button>
        </div>
      </section>
    );
  }

  const post = currentPost(step, state);
  const postText = post ? text.posts[post.id] : undefined;
  const image = post ? artFor(post.image) : undefined;
  if (!post || !postText || !image) return null;

  const right = isRight(step, state);
  const answered = state.answer !== null;
  const firstTransfer = step.posts.findIndex((p) => p.role === 'transfer') === state.index;
  const choose = (verdict: Verdict) => setState((s) => answer(step, s, verdict));

  return (
    <section class="compose">
      <h2 ref={heading} tabIndex={-1}>
        {m.facade.sortHeading}
      </h2>
      <p class="step-progress">
        {format(m.facade.postProgress, { current: state.index + 1, total })}
      </p>
      {state.index === 0 && (
        <Guide portrait={guide} name={guideName}>
          <p>{text.brief}</p>
        </Guide>
      )}
      {firstTransfer && (
        <Guide portrait={guide} name={guideName}>
          <p>{text.transferIntro}</p>
        </Guide>
      )}

      <article class="post" key={post.id}>
        <p class="post__account">
          <span class="post__avatar" aria-hidden="true" />
          {postText.account}
        </p>
        {postText.label && <p class="post__label">{postText.label}</p>}
        <div class="post__picture">
          <img src={image.src} width={image.width} height={image.height} alt="" />
          {post.retouchMark && <span class="post__retouch">{m.facade.retouchMark}</span>}
          {right && (
            <span
              class={post.verdict === 'ad' ? 'post__stamp' : 'post__stamp post__stamp--real'}
              aria-hidden="true"
            >
              {post.verdict === 'ad' ? m.facade.stampAd : m.facade.stampNotAd}
            </span>
          )}
        </div>
        <p class="post__caption">
          <strong>{postText.account}</strong> {postText.caption}
        </p>
        {closer ? (
          <div class="post__clues">
            <p>
              <strong>{m.facade.cluesHeading}</strong>
            </p>
            <ul>
              {postText.clues.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ) : (
          <button type="button" class="button button--secondary" onClick={() => setCloser(true)}>
            <span aria-hidden="true">🔍 </span>
            {m.facade.lookCloser}
          </button>
        )}
      </article>

      {!answered && (
        <div class="actions sort__choices">
          <button type="button" class="button" onClick={() => choose('ad')}>
            {m.facade.isAd}
          </button>
          <button type="button" class="button" onClick={() => choose('not-ad')}>
            {m.facade.notAd}
          </button>
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
            {right ? m.facade.rightHeading : m.facade.wrongHeading}
          </h3>
          <p>{right ? postText.right : postText.wrong}</p>
          <div class="actions">
            {right ? (
              <button
                type="button"
                class="button"
                onClick={() => {
                  setCloser(false);
                  setState(next);
                }}
              >
                {m.facade.next}
              </button>
            ) : (
              <button
                type="button"
                class="button"
                onClick={() => {
                  setCloser(true);
                  setState(retry);
                }}
              >
                {m.facade.tryAgain}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
