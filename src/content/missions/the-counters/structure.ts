import type { LinkInspectMission, ThreeOptions } from '../../types.ts';

const A: ThreeOptions = [
  { id: 'a', correct: true },
  { id: 'b', correct: false },
  { id: 'c', correct: false },
];
const B: ThreeOptions = [
  { id: 'a', correct: false },
  { id: 'b', correct: true },
  { id: 'c', correct: false },
];
const C: ThreeOptions = [
  { id: 'a', correct: false },
  { id: 'b', correct: false },
  { id: 'c', correct: true },
];

/**
 * Skrankene (Lisenskontoret): the final check. Four counters, one per house, each a
 * clerk's line and three questions in new situations. No hints; a wrong answer is
 * explained and tried again. Reuses the link-inspect choice and info steps.
 */
export const theCounters = {
  id: 'the-counters',
  building: 'licence-bureau',
  interaction: 'link-inspect',
  requires: [],
  guide: 'portrait-stempelsen',
  theme: 'bureau',
  scene: 'scene-bureau',
  stickers: ['licensed'],
  reviewedOn: null,
  // Repeats what the other missions teach; their sources apply.
  sources: [],
  steps: [
    { kind: 'info', id: 'counter-1' },
    { kind: 'choice', id: 'shortcut', options: B },
    { kind: 'choice', id: 'browser', options: C },
    { kind: 'choice', id: 'domain', options: B },
    { kind: 'info', id: 'counter-2' },
    { kind: 'choice', id: 'toll', options: B },
    { kind: 'choice', id: 'padlock', options: A },
    { kind: 'choice', id: 'oops', options: C },
    { kind: 'info', id: 'counter-3' },
    { kind: 'choice', id: 'free-apps', options: A },
    { kind: 'choice', id: 'cream', options: B },
    { kind: 'choice', id: 'feed', options: C },
    { kind: 'info', id: 'counter-4' },
    { kind: 'choice', id: 'first-check', options: B },
    { kind: 'choice', id: 'old-picture', options: A },
    { kind: 'choice', id: 'uncle', options: C },
    { kind: 'info', id: 'stamped' },
  ],
} as const satisfies LinkInspectMission;
