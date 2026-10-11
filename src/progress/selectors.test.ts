import { describe, expect, it } from 'vitest';
import { findTheImpostor } from '../content/missions/find-the-impostor/structure.ts';
import { missions } from '../content/missions/index.ts';
import { tenFingers } from '../content/missions/ten-fingers/structure.ts';
import { buildings } from '../content/town.ts';
import { emptyProgress, type Progress } from './schema.ts';
import {
  hasStarted,
  isLocked,
  restartMission,
  resumeRoute,
  startMission,
  visitBuilding,
} from './selectors.ts';

const ALL_LINK_STEPS = [
  'case-1',
  'case-2',
  'case-3',
  'case-4',
  'case-5',
  'case-6',
  'habit',
  'habit-tip',
  'transfer-intro',
  'transfer-1',
  'transfer-2',
];

function withLinkRun(solved: string[], extra: Partial<Progress> = {}): Progress {
  return {
    ...emptyProgress(),
    ...extra,
    missions: {
      'find-the-impostor': {
        completedOnce: false,
        run: { interaction: 'link-inspect', solved, firstTry: [], missedTransfer: [] },
      },
    },
  };
}

describe('resumeRoute', () => {
  it('goes to the town when nothing was started', () => {
    expect(resumeRoute(emptyProgress(), missions)).toEqual({ name: 'town' });
    expect(hasStarted(emptyProgress())).toBe(false);
  });

  it('goes to the first unfinished step of the last mission', () => {
    const p = withLinkRun(['case-1', 'case-2'], { lastMission: 'find-the-impostor' });
    expect(hasStarted(p)).toBe(true);
    expect(resumeRoute(p, missions)).toEqual({
      name: 'mission-step',
      missionId: 'find-the-impostor',
      stepId: 'case-3',
    });
  });

  it('falls back to another unfinished mission when the last one is finished', () => {
    const p: Progress = {
      ...withLinkRun(ALL_LINK_STEPS, { lastMission: 'find-the-impostor' }),
    };
    const both: Progress = {
      ...p,
      missions: {
        ...p.missions,
        'ten-fingers': {
          completedOnce: false,
          run: { interaction: 'typing', done: ['step-1'], positional: false },
        },
      },
    };
    expect(resumeRoute(both, missions)).toEqual({
      name: 'mission-step',
      missionId: 'ten-fingers',
      stepId: 'step-2',
    });
  });

  it('goes to the town when every started mission is finished', () => {
    expect(resumeRoute(withLinkRun(ALL_LINK_STEPS), missions)).toEqual({ name: 'town' });
  });
});

describe('startMission', () => {
  it('creates a run and remembers the mission', () => {
    const p = startMission(emptyProgress(), tenFingers);
    expect(p.lastMission).toBe('ten-fingers');
    expect(p.missions['ten-fingers']).toEqual({
      completedOnce: false,
      run: { interaction: 'typing', done: [], positional: false },
    });
  });

  it('keeps an unfinished run', () => {
    const p = withLinkRun(['case-1'], { lastMission: 'find-the-impostor' });
    expect(startMission(p, findTheImpostor)).toBe(p);
  });

  it('starts a new run after a finished one, keeping completedOnce', () => {
    const done: Progress = {
      ...emptyProgress(),
      missions: {
        'find-the-impostor': {
          completedOnce: true,
          run: {
            interaction: 'link-inspect',
            solved: ALL_LINK_STEPS,
            firstTry: [],
            missedTransfer: [],
          },
        },
      },
    };
    const p = startMission(done, findTheImpostor);
    expect(p.missions['find-the-impostor']?.completedOnce).toBe(true);
    expect(p.missions['find-the-impostor']?.run).toMatchObject({ solved: [] });
  });
});

describe('restartMission', () => {
  it('resets the run but keeps stickers', () => {
    const p = { ...withLinkRun(['case-1', 'case-2']), stickers: ['link-detective'] };
    const r = restartMission(p, findTheImpostor);
    expect(r.missions['find-the-impostor']?.run).toMatchObject({ solved: [] });
    expect(r.stickers).toEqual(['link-detective']);
  });
});

describe('visitBuilding', () => {
  it('records a visit once', () => {
    const p = visitBuilding(emptyProgress(), 'rumour-exchange');
    expect(p.visitedBuildings).toEqual(['rumour-exchange']);
    expect(visitBuilding(p, 'rumour-exchange')).toBe(p);
  });
});

describe('isLocked', () => {
  const agnbua = buildings.find((b) => b.id === 'gone-phishing');
  const arcade = buildings.find((b) => b.id === 'arcade');

  it('keeps Agnbua shut until the café mission is done', () => {
    if (!agnbua || !arcade) throw new Error('missing building');
    const fresh = emptyProgress();
    expect(isLocked(fresh, agnbua)).toBe(true);
    expect(isLocked(fresh, arcade)).toBe(false);
    const cafe = missions.find((m) => m.id === 'how-the-net-works');
    if (!cafe) throw new Error('missing mission');
    const started = startMission(fresh, cafe);
    expect(isLocked(started, agnbua)).toBe(true);
    const done: Progress = {
      ...started,
      missions: {
        ...started.missions,
        'how-the-net-works': { completedOnce: true, run: { interaction: 'web', done: [] } },
      },
    };
    expect(isLocked(done, agnbua)).toBe(false);
  });

  it('lets in players who already started a mission inside', () => {
    if (!agnbua) throw new Error('missing building');
    expect(isLocked(startMission(emptyProgress(), findTheImpostor), agnbua)).toBe(false);
  });
});
