import type { LinkCase, LinkInspectMission, MissionStructure } from '../../src/content/types.ts';

export function linkInspectMissions(all: readonly MissionStructure[]): LinkInspectMission[] {
  return all.filter((m): m is LinkInspectMission => m.interaction === 'link-inspect');
}

export function linkCases(mission: LinkInspectMission): LinkCase[] {
  return mission.steps.filter((s): s is LinkCase => s.kind === 'case');
}

/** Every string value in an object tree, with its path, skipping the given keys. */
export function stringsIn(
  value: unknown,
  skipKeys: readonly string[],
  path = '',
): { path: string; value: string }[] {
  if (typeof value === 'string') return [{ path, value }];
  if (Array.isArray(value)) return value.flatMap((v, i) => stringsIn(v, skipKeys, `${path}[${i}]`));
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      skipKeys.includes(k) ? [] : stringsIn(v, skipKeys, path ? `${path}.${k}` : k),
    );
  }
  return [];
}

/** Things that look like domain names: two or more dot-separated labels ending in a letter label. */
const DOMAIN_LIKE = /\b(?:[a-z0-9-]+\.)+[a-z][a-z0-9-]*\b/gi;

export function domainsIn(text: string): string[] {
  return text.match(DOMAIN_LIKE) ?? [];
}
