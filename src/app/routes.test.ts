import { describe, expect, it } from 'vitest';
import { href, parseHash, type Route } from './routes.ts';

describe('parseHash', () => {
  it.each<[string, Route]>([
    ['', { name: 'start' }],
    ['#', { name: 'start' }],
    ['#/', { name: 'start' }],
    ['#/town', { name: 'town' }],
    ['#/town/', { name: 'town' }],
    ['#/passport', { name: 'passport' }],
    ['#/about', { name: 'about' }],
    ['#/mission/find-the-impostor', { name: 'mission-intro', missionId: 'find-the-impostor' }],
    [
      '#/mission/find-the-impostor/case-3',
      { name: 'mission-step', missionId: 'find-the-impostor', stepId: 'case-3' },
    ],
    ['#/mission/ten-fingers/done', { name: 'mission-summary', missionId: 'ten-fingers' }],
    ['#/nowhere', { name: 'not-found', path: '/nowhere' }],
    ['#/town/extra', { name: 'not-found', path: '/town/extra' }],
    ['#/mission', { name: 'not-found', path: '/mission' }],
    ['#/mission/a/b/c', { name: 'not-found', path: '/mission/a/b/c' }],
  ])('%s', (hash, expected) => {
    expect(parseHash(hash)).toEqual(expected);
  });

  it('survives malformed percent-encoding', () => {
    expect(parseHash('#/mission/%E0%A4%A')).toEqual({
      name: 'mission-intro',
      missionId: '%E0%A4%A',
    });
  });
});

describe('href', () => {
  const routes: Route[] = [
    { name: 'start' },
    { name: 'town' },
    { name: 'passport' },
    { name: 'about' },
    { name: 'mission-intro', missionId: 'find-the-impostor' },
    { name: 'mission-step', missionId: 'find-the-impostor', stepId: 'transfer-1-backup' },
    { name: 'mission-summary', missionId: 'ten-fingers' },
  ];

  it.each(routes)('round-trips $name', (route) => {
    expect(parseHash(href(route))).toEqual(route);
  });
});
