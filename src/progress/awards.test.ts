import { describe, expect, it } from 'vitest';
import { applyAwards } from './awards.ts';
import type { LinkInspectRun } from './schema.ts';
import { emptyProgress, type Progress } from './schema.ts';

const MAIN = [
  'case-1',
  'case-2',
  'case-3',
  'case-4',
  'case-5',
  'case-6',
  'habit',
  'habit-tip',
  'transfer-intro',
];

function linkRun(patch: Partial<LinkInspectRun>): Progress {
  return {
    ...emptyProgress(),
    missions: {
      'find-the-impostor': {
        completedOnce: false,
        run: {
          interaction: 'link-inspect',
          solved: [],
          firstTry: [],
          missedTransfer: [],
          ...patch,
        },
      },
    },
  };
}

describe('applyAwards', () => {
  it('changes nothing for an unfinished mission', () => {
    const p = linkRun({ solved: ['case-1'] });
    expect(applyAwards(p)).toBe(p);
  });

  it('completes the mission and awards Lenkedetektiv', () => {
    const p = applyAwards(linkRun({ solved: [...MAIN, 'transfer-1', 'transfer-2'] }));
    expect(p.missions['find-the-impostor']?.completedOnce).toBe(true);
    expect(p.stickers).toEqual(['link-detective']);
  });

  it('awards Skarpt øye when both transfer cases were right first time', () => {
    const p = applyAwards(
      linkRun({
        solved: [...MAIN, 'transfer-1', 'transfer-2'],
        firstTry: ['transfer-1', 'transfer-2'],
      }),
    );
    expect(p.stickers).toEqual(['link-detective', 'sharp-eye']);
  });

  it('withholds Skarpt øye after a missed transfer case', () => {
    const p = applyAwards(
      linkRun({
        solved: [...MAIN, 'transfer-1', 'transfer-1-backup', 'transfer-2'],
        firstTry: ['transfer-2', 'transfer-1-backup'],
        missedTransfer: ['transfer-1'],
      }),
    );
    expect(p.stickers).toEqual(['link-detective']);
  });

  it('does not judge conditions before the run is finished', () => {
    const p = linkRun({
      solved: ['transfer-1', 'transfer-2'],
      firstTry: ['transfer-1', 'transfer-2'],
    });
    expect(applyAwards(p).stickers).toEqual([]);
  });

  it('keeps stickers on a replay', () => {
    const p: Progress = { ...linkRun({ solved: [] }), stickers: ['link-detective', 'sharp-eye'] };
    expect(applyAwards(p).stickers).toEqual(['link-detective', 'sharp-eye']);
  });

  it('awards Nysgjerrig for visiting every building', () => {
    const p: Progress = {
      ...emptyProgress(),
      visitedBuildings: ['post-office', 'keyboard-hall', 'square', 'library', 'licence-office'],
    };
    expect(applyAwards(p).stickers).toEqual(['curious']);
    expect(applyAwards({ ...p, visitedBuildings: p.visitedBuildings.slice(1) }).stickers).toEqual(
      [],
    );
  });
});
