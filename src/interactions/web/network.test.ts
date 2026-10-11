import { describe, expect, it } from 'vitest';
import { howTheNetWorks } from '../../content/missions/how-the-net-works/structure.ts';
import type { JourneyStep } from '../../content/types.ts';
import { isCut, onPath, route } from './network.ts';

const step = howTheNetWorks.steps.find((s) => s.kind === 'journey') as JourneyStep;

describe('route', () => {
  it('goes via Oslo while every cable works', () => {
    expect(route(step)).toEqual(['you', 'home', 'provider', 'oslo', 'server']);
  });

  it('finds another way when the cut cable is broken, in either direction', () => {
    expect(route(step, [step.cut])).toEqual(['you', 'home', 'provider', 'bergen', 'server']);
    expect(route(step, [['oslo', 'provider']])).toEqual([
      'you',
      'home',
      'provider',
      'bergen',
      'server',
    ]);
  });

  it('gives up when there is no way', () => {
    expect(route(step, [['you', 'home']])).toBeNull();
  });
});

it('knows which cables are on the path and which is cut', () => {
  const path = route(step);
  expect(onPath(path, ['oslo', 'server'])).toBe(true);
  expect(onPath(path, ['server', 'oslo'])).toBe(true);
  expect(onPath(path, ['bergen', 'server'])).toBe(false);
  expect(isCut(step, ['oslo', 'provider'], true)).toBe(true);
  expect(isCut(step, ['oslo', 'provider'], false)).toBe(false);
});
