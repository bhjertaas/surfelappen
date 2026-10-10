import { describe, expect, it } from 'vitest';
import type { FeedStep } from '../../content/types.ts';
import { allocate, EVEN, favourite, feedFor, follow, glossyCount, mute, stopAt } from './feed.ts';

const step: FeedStep = {
  kind: 'feed',
  id: 'train-the-feed',
  posts: [
    { id: 'g1', category: 'glossy', image: 'x' },
    { id: 'g2', category: 'glossy', image: 'x' },
    { id: 'f1', category: 'friends', image: 'x' },
    { id: 'h1', category: 'hobby', image: 'x' },
    { id: 'u1', category: 'funny', image: 'x' },
  ],
  rounds: 3,
  feedSize: 6,
  sara: { glossy: 9, friends: 1, hobby: 0, funny: 0 },
  suggestions: [],
  goal: 2,
};

describe('feed', () => {
  it('fills a feed in proportion to the weights', () => {
    expect(allocate(EVEN, 8)).toEqual({ glossy: 2, friends: 2, hobby: 2, funny: 2 });
    expect(allocate(step.sara, 6)).toEqual({ glossy: 5, friends: 1, hobby: 0, funny: 0 });
  });

  it('stopping at the same kind three times takes over the feed', () => {
    const w = stopAt(stopAt(stopAt(EVEN, 'funny'), 'funny'), 'funny');
    const feed = feedFor(step, w);
    expect(feed).toHaveLength(6);
    expect(feed.filter((p) => p.category === 'funny').length).toBeGreaterThanOrEqual(4);
  });

  it('Sara gets to her goal by muting and following', () => {
    expect(glossyCount(feedFor(step, step.sara))).toBe(5);
    let w = mute(mute(step.sara));
    w = follow(follow(follow(w, 'hobby'), 'funny'), 'friends');
    expect(glossyCount(feedFor(step, w))).toBeLessThanOrEqual(2);
  });

  it('knows the favourite', () => {
    expect(favourite(['funny', 'glossy', 'funny'])).toBe('funny');
    expect(favourite([])).toBeUndefined();
  });
});
