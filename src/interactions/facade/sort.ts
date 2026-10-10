import type { SortPost, SortStep } from '../../content/types.ts';

/** Pure state for "Reklamejakt": one post at a time, retry until right. */

export type Verdict = SortPost['verdict'];

export interface SortState {
  /** Index of the post on screen. */
  readonly index: number;
  /** The answer just given on this post, if any (shown with feedback). */
  readonly answer: Verdict | null;
  /** Posts answered wrongly at least once. */
  readonly missed: readonly string[];
}

export const START: SortState = { index: 0, answer: null, missed: [] };

export function currentPost(step: SortStep, state: SortState): SortPost | undefined {
  return step.posts[state.index];
}

export function answer(step: SortStep, state: SortState, verdict: Verdict): SortState {
  const post = currentPost(step, state);
  if (!post || state.answer === post.verdict) return state;
  const wrong = verdict !== post.verdict;
  return {
    ...state,
    answer: verdict,
    missed: wrong && !state.missed.includes(post.id) ? [...state.missed, post.id] : state.missed,
  };
}

export function isRight(step: SortStep, state: SortState): boolean {
  return state.answer !== null && state.answer === currentPost(step, state)?.verdict;
}

/** After a wrong answer: back to choosing. */
export function retry(state: SortState): SortState {
  return { ...state, answer: null };
}

/** After a right answer: the next post. */
export function next(state: SortState): SortState {
  return { ...state, index: state.index + 1, answer: null };
}

export function isFinished(step: SortStep, state: SortState): boolean {
  return state.index >= step.posts.length;
}

/** Posts right on the first try so far (for "x av y riktig på første forsøk"). */
export function firstTryCount(step: SortStep, state: SortState): number {
  return step.posts.slice(0, state.index).filter((p) => !state.missed.includes(p.id)).length;
}

/** Every transfer post right on the first try (the Reklamejeger sticker). */
export function transferFlawless(step: SortStep, state: SortState): boolean {
  return step.posts.filter((p) => p.role === 'transfer').every((p) => !state.missed.includes(p.id));
}
