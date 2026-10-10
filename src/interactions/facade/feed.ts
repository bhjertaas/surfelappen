import type { FeedCategory, FeedPost, FeedStep } from '../../content/types.ts';

/**
 * Pure logic for "Tren feeden": a toy recommender. A feed is filled in
 * proportion to category weights; stopping at a post raises its weight.
 */

export type Weights = Readonly<Record<FeedCategory, number>>;

export const CATEGORIES: readonly FeedCategory[] = ['glossy', 'friends', 'hobby', 'funny'];

export const EVEN: Weights = { glossy: 1, friends: 1, hobby: 1, funny: 1 };

/** How much one stop (training) or one follow raises a category. */
export const STOP_BOOST = 3;
export const FOLLOW_BOOST = 2;
/** How much "Vis færre som dette" lowers glossy posts. */
export const MUTE_DROP = 3;

/** Slots per category, in proportion to the weights (largest remainder). */
export function allocate(weights: Weights, size: number): Record<FeedCategory, number> {
  const total = CATEGORIES.reduce((sum, c) => sum + Math.max(weights[c], 0), 0);
  const result = { glossy: 0, friends: 0, hobby: 0, funny: 0 };
  if (total === 0) return result;
  const exact = CATEGORIES.map((c) => ({ c, v: (Math.max(weights[c], 0) / total) * size }));
  for (const { c, v } of exact) result[c] = Math.floor(v);
  let left = size - CATEGORIES.reduce((sum, c) => sum + result[c], 0);
  const byRemainder = [...exact].sort((a, b) => b.v - Math.floor(b.v) - (a.v - Math.floor(a.v)));
  for (const { c } of byRemainder) {
    if (left <= 0) break;
    result[c] += 1;
    left -= 1;
  }
  return result;
}

/** The feed itself: categories interleaved, posts cycling within a category. */
export function feedFor(step: FeedStep, weights: Weights, size = step.feedSize): FeedPost[] {
  const slots = allocate(weights, size);
  const pools = Object.fromEntries(
    CATEGORIES.map((c) => [c, step.posts.filter((p) => p.category === c)]),
  ) as Record<FeedCategory, FeedPost[]>;
  const used = { glossy: 0, friends: 0, hobby: 0, funny: 0 };
  const feed: FeedPost[] = [];
  while (feed.length < size) {
    let added = false;
    for (const c of CATEGORIES) {
      const pool = pools[c];
      if (used[c] < slots[c] && pool.length > 0) {
        feed.push(pool[used[c] % pool.length] as FeedPost);
        used[c] += 1;
        added = true;
      }
    }
    if (!added) break;
  }
  return feed;
}

/** One training round: one post per category, a different picture each round. */
export function roundChoices(step: FeedStep, round: number): FeedPost[] {
  return CATEGORIES.flatMap((c) => {
    const pool = step.posts.filter((p) => p.category === c);
    const post = pool[round % Math.max(pool.length, 1)];
    return post ? [post] : [];
  });
}

export function stopAt(weights: Weights, category: FeedCategory): Weights {
  return { ...weights, [category]: weights[category] + STOP_BOOST };
}

export function mute(weights: Weights): Weights {
  return { ...weights, glossy: Math.max(weights.glossy - MUTE_DROP, 0) };
}

export function follow(weights: Weights, category: FeedCategory): Weights {
  return { ...weights, [category]: weights[category] + FOLLOW_BOOST };
}

export function glossyCount(feed: readonly FeedPost[]): number {
  return feed.filter((p) => p.category === 'glossy').length;
}

/** The category the player stopped at most during training. */
export function favourite(picks: readonly FeedCategory[]): FeedCategory | undefined {
  let best: FeedCategory | undefined;
  let bestCount = 0;
  for (const c of CATEGORIES) {
    const count = picks.filter((p) => p === c).length;
    if (count > bestCount) {
      best = c;
      bestCount = count;
    }
  }
  return best;
}
