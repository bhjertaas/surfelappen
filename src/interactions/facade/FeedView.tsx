import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import { artFor } from '../../content/art.ts';
import type { FeedText } from '../../content/missions/text-types.ts';
import type { FeedCategory, FeedPost, FeedStep } from '../../content/types.ts';
import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import type { FacadeRun } from '../../progress/schema.ts';
import {
  EVEN,
  favourite,
  feedFor,
  follow,
  glossyCount,
  mute,
  roundChoices,
  stopAt,
  type Weights,
} from './feed.ts';
import { completeFacadeStep } from './flow.ts';

type Phase = 'train' | 'trained' | 'sara';

interface Props {
  step: FeedStep;
  text: FeedText;
  guide: string;
  guideName: string;
  run: FacadeRun;
  advance: (run: FacadeRun) => void;
}

/** A small post in a feed grid. Its picture is decoration; account and caption are text. */
function MiniPost({
  post,
  text,
  children,
}: {
  post: FeedPost;
  text: FeedText;
  children?: ComponentChildren;
}) {
  const image = artFor(post.image);
  const t = text.posts[post.id];
  return (
    <li class={`mini-post mini-post--${post.category}`}>
      {image && <img src={image.src} width={image.width} height={image.height} alt="" />}
      <p class="mini-post__text">
        <strong>{t?.account}</strong> {t?.caption}
      </p>
      {children}
    </li>
  );
}

/** "Tren feeden": train a toy feed, then help Sara change hers. */
export function FeedView({ step, text, guide, guideName, run, advance }: Props) {
  const { m } = useI18n();
  const [phase, setPhase] = useState<Phase>('train');
  const [round, setRound] = useState(0);
  const [picks, setPicks] = useState<FeedCategory[]>([]);
  const [weights, setWeights] = useState<Weights>(EVEN);
  const [sara, setSara] = useState<Weights>(step.sara);
  const [followed, setFollowed] = useState<string[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // A new round or phase moves focus to the heading, so screen readers follow along.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [phase, round]);

  const header = (
    <h2 ref={heading} tabIndex={-1}>
      {phase === 'sara' ? m.facade.saraFeed : m.facade.feedHeading}
    </h2>
  );

  if (phase === 'train') {
    return (
      <section class="compose">
        {header}
        {round === 0 && (
          <Guide portrait={guide} name={guideName}>
            <p>{text.brief}</p>
          </Guide>
        )}
        <p class="step-progress">
          {format(text.roundPrompt, { round: round + 1, rounds: step.rounds })}
        </p>
        <ul class="feed-grid">
          {roundChoices(step, round).map((post) => (
            <MiniPost key={post.id} post={post} text={text}>
              <button
                type="button"
                class="button button--secondary"
                onClick={() => {
                  setWeights((w) => stopAt(w, post.category));
                  setPicks((p) => [...p, post.category]);
                  if (round + 1 >= step.rounds) setPhase('trained');
                  else setRound(round + 1);
                }}
              >
                {m.facade.stopHere}
                <span class="visually-hidden">: {text.posts[post.id]?.account}</span>
              </button>
            </MiniPost>
          ))}
        </ul>
      </section>
    );
  }

  if (phase === 'trained') {
    const fav = favourite(picks);
    return (
      <section class="compose">
        {header}
        <p>{format(text.trained, { category: fav ? text.categories[fav] : '' })}</p>
        <h3>{m.facade.yourFeed}</h3>
        <ul class="feed-grid feed-grid--small">
          {feedFor(step, weights).map((post, i) => (
            <MiniPost key={`${post.id}-${i}`} post={post} text={text} />
          ))}
        </ul>
        <Guide portrait={guide} name={guideName}>
          <p>{text.explain}</p>
          <p>{text.why}</p>
        </Guide>
        <div class="actions">
          <button type="button" class="button" onClick={() => setPhase('sara')}>
            {m.facade.toSara}
          </button>
        </div>
      </section>
    );
  }

  const feed = feedFor(step, sara);
  const glossy = glossyCount(feed);
  const reached = glossy <= step.goal;
  return (
    <section class="compose">
      {header}
      <Guide portrait={guide} name={guideName}>
        <p>{reached ? text.done : text.saraIntro}</p>
      </Guide>
      <p class={reached ? 'feed-meter feed-meter--ok' : 'feed-meter'} aria-live="polite">
        {format(m.facade.meter, { count: glossy, total: feed.length })}
        {reached && <> {m.facade.goalReached}</>}
      </p>
      <ul class="feed-grid feed-grid--small">
        {feed.map((post, i) => (
          <MiniPost key={`${post.id}-${i}`} post={post} text={text}>
            {post.category === 'glossy' && (
              <button type="button" class="button button--secondary" onClick={() => setSara(mute)}>
                {m.facade.mute}
                <span class="visually-hidden">: {text.posts[post.id]?.account}</span>
              </button>
            )}
          </MiniPost>
        ))}
      </ul>
      <h3>{m.facade.suggestionsHeading}</h3>
      <ul class="suggestions">
        {step.suggestions.map((s) => {
          const t = text.suggestions[s.id];
          const done = followed.includes(s.id);
          return (
            <li key={s.id}>
              <span>
                <strong>{t?.account}</strong> {t?.about}
              </span>
              <button
                type="button"
                class={done ? 'button button--secondary' : 'button'}
                aria-pressed={done}
                disabled={done}
                onClick={() => {
                  setSara((w) => follow(w, s.category));
                  setFollowed((f) => [...f, s.id]);
                }}
              >
                {done ? m.facade.following : m.facade.follow}
                <span class="visually-hidden">: {t?.account}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div class="actions">
        <button
          type="button"
          class="button"
          disabled={!reached}
          onClick={() => advance(completeFacadeStep(run, step.id))}
        >
          {m.facade.finish}
        </button>
      </div>
    </section>
  );
}
