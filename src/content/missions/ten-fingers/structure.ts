import type { TypingMission } from '../../types.ts';

const HOME_ROW = ['f', 'j', 'd', 'k', 's', 'l', 'a', 'ø', ' '];

/** Ti fingre, lesson 1 (PRD Mission 2, Appendix B). */
export const tenFingers = {
  id: 'ten-fingers',
  building: 'keyboard-hall',
  interaction: 'typing',
  requires: ['physical-keyboard'],
  stickers: ['ten-fingers', 'steady-hand'],
  reviewedOn: null,
  sources: [],
  steps: [
    {
      id: 'step-1',
      keysTaught: HOME_ROW,
      keysAllowed: HOME_ROW,
      drills: ['f j f j d k d k s l s l a ø a ø'],
    },
    {
      id: 'step-2',
      keysTaught: [],
      keysAllowed: HOME_ROW,
      drills: ['fff jjj ddd kkk sss lll aaa øøø', 'fjdk slaø fjdk slaø'],
    },
    {
      id: 'step-3',
      keysTaught: ['g', 'h', 'æ'],
      keysAllowed: [...HOME_ROW, 'g', 'h', 'æ'],
      drills: ['fgf jhj fgf jhj øæø øæø', 'gh hg gh hg æ æ'],
    },
    {
      id: 'step-4',
      keysTaught: [],
      keysAllowed: [...HOME_ROW, 'g', 'h', 'æ'],
      drills: ['da ha sal dag lag', 'glad hall skall'],
    },
    {
      id: 'step-5',
      keysTaught: [],
      keysAllowed: [...HOME_ROW, 'g', 'h', 'æ'],
      drills: ['glad dag da hall skall lag sal'],
      minAccuracy: 90,
    },
  ],
} as const satisfies TypingMission;
