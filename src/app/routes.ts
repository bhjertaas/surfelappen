import type { MissionId, StepId } from '../content/types.ts';

/** Every screen in the app. This file is the only place URLs are spelled (ADR 0003). */
export type Route =
  | { readonly name: 'start' }
  | { readonly name: 'town' }
  | { readonly name: 'mission-intro'; readonly missionId: MissionId }
  | { readonly name: 'mission-step'; readonly missionId: MissionId; readonly stepId: StepId }
  | { readonly name: 'mission-summary'; readonly missionId: MissionId }
  | { readonly name: 'mission-more'; readonly missionId: MissionId }
  | { readonly name: 'passport' }
  | { readonly name: 'about' }
  | { readonly name: 'not-found'; readonly path: string };

export const SUMMARY_SEGMENT = 'done';
export const MORE_SEGMENT = 'more';

/** Turns `#/mission/x/case-1` (or `''`) into a Route. Unknown paths become `not-found`. */
export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '');
  const segments = path
    .split('/')
    .filter((s) => s !== '')
    .map((s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    });

  const [first, second, third, ...rest] = segments;
  if (rest.length > 0) return { name: 'not-found', path };

  switch (first) {
    case undefined:
      return { name: 'start' };
    case 'town':
      return second === undefined ? { name: 'town' } : { name: 'not-found', path };
    case 'passport':
      return second === undefined ? { name: 'passport' } : { name: 'not-found', path };
    case 'about':
      return second === undefined ? { name: 'about' } : { name: 'not-found', path };
    case 'mission':
      if (second === undefined) return { name: 'not-found', path };
      if (third === undefined) return { name: 'mission-intro', missionId: second };
      if (third === SUMMARY_SEGMENT) return { name: 'mission-summary', missionId: second };
      if (third === MORE_SEGMENT) return { name: 'mission-more', missionId: second };
      return { name: 'mission-step', missionId: second, stepId: third };
    default:
      return { name: 'not-found', path };
  }
}

/** Turns a Route into an href like `#/town`. */
export function href(route: Route): string {
  const e = encodeURIComponent;
  switch (route.name) {
    case 'start':
      return '#/';
    case 'town':
      return '#/town';
    case 'passport':
      return '#/passport';
    case 'about':
      return '#/about';
    case 'mission-intro':
      return `#/mission/${e(route.missionId)}`;
    case 'mission-step':
      return `#/mission/${e(route.missionId)}/${e(route.stepId)}`;
    case 'mission-summary':
      return `#/mission/${e(route.missionId)}/${SUMMARY_SEGMENT}`;
    case 'mission-more':
      return `#/mission/${e(route.missionId)}/${MORE_SEGMENT}`;
    case 'not-found':
      return `#${route.path}`;
  }
}

/** A stable key for "is this the same screen?", used for focus handling. */
export function routeKey(route: Route): string {
  return href(route);
}
