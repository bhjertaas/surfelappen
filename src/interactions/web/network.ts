import type { JourneyStep } from '../../content/types.ts';

/** Pure logic for "Pakken på reise": find a way through the network. */

type Cable = readonly [string, string];

const same = (a: Cable, b: Cable) =>
  (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0]);

/** Shortest way from `from` to `to` (breadth-first), avoiding broken cables; null if none. */
export function route(step: JourneyStep, broken: readonly Cable[] = []): string[] | null {
  const working = step.cables.filter((c) => !broken.some((b) => same(b, c)));
  const previous = new Map<string, string | null>([[step.from, null]]);
  const queue = [step.from];
  while (queue.length > 0) {
    const node = queue.shift() as string;
    if (node === step.to) break;
    for (const [a, b] of working) {
      const other = a === node ? b : b === node ? a : null;
      if (other !== null && !previous.has(other)) {
        previous.set(other, node);
        queue.push(other);
      }
    }
  }
  if (!previous.has(step.to)) return null;
  const path: string[] = [];
  for (let n: string | null = step.to; n !== null; n = previous.get(n) ?? null) path.unshift(n);
  return path;
}

/** Is this cable part of the path? */
export function onPath(path: readonly string[] | null, cable: Cable): boolean {
  if (!path) return false;
  for (let i = 1; i < path.length; i++) {
    if (same([path[i - 1] as string, path[i] as string], cable)) return true;
  }
  return false;
}

export function isCut(step: JourneyStep, cable: Cable, broken: boolean): boolean {
  return broken && same(step.cut, cable);
}
