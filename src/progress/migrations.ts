import { AUDIENCES, type Audience } from '../content/types.ts';
import { CURRENT_VERSION, type Progress } from './schema.ts';

/**
 * Migration chain (ADR 0006). To change the schema: bump CURRENT_VERSION, add the
 * new type to schema.ts, and add `[old]: (data) => newShape` here with a fixture test.
 * Migrations are pure and must tolerate unknown or removed content IDs.
 */
const MIGRATIONS: Record<number, (data: Record<string, unknown>) => Record<string, unknown>> = {
  // 1: (data) => ({ ...data, v: 2 }),
};

export type LoadResult =
  | { readonly kind: 'ok'; readonly progress: Progress }
  | { readonly kind: 'empty' }
  | { readonly kind: 'corrupt' }
  | { readonly kind: 'newer'; readonly version: number };

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === 'string');

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function isRun(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (value.interaction === 'link-inspect') {
    return (
      isStringArray(value.solved) &&
      isStringArray(value.firstTry) &&
      isStringArray(value.missedTransfer)
    );
  }
  if (value.interaction === 'typing') {
    return isStringArray(value.done) && typeof value.positional === 'boolean';
  }
  if (value.interaction === 'facade') {
    return (
      isStringArray(value.done) && (value.flawless === undefined || isStringArray(value.flawless))
    );
  }
  return false;
}

/** Checks the shape of current-version data. Unknown extra fields are dropped. */
function validate(data: Record<string, unknown>): Progress | null {
  if (!isStringArray(data.visitedBuildings) || !isStringArray(data.stickers)) return null;
  if (!isRecord(data.missions)) return null;
  if (data.lastMission !== undefined && typeof data.lastMission !== 'string') return null;
  for (const entry of Object.values(data.missions)) {
    if (!isRecord(entry) || typeof entry.completedOnce !== 'boolean' || !isRun(entry.run))
      return null;
  }
  // An unknown audience (e.g. from a later release) is dropped, not fatal.
  const audience = AUDIENCES.find((a) => a === data.audience) as Audience | undefined;
  return {
    v: 1,
    ...(audience ? { audience } : {}),
    ...(typeof data.lastMission === 'string' ? { lastMission: data.lastMission } : {}),
    visitedBuildings: data.visitedBuildings,
    stickers: data.stickers,
    missions: data.missions as Progress['missions'],
  };
}

/** Parses, migrates and validates a stored string. */
export function load(raw: string | null): LoadResult {
  if (raw === null || raw === '') return { kind: 'empty' };
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { kind: 'corrupt' };
  }
  if (!isRecord(data) || typeof data.v !== 'number' || !Number.isInteger(data.v) || data.v < 1) {
    return { kind: 'corrupt' };
  }
  if (data.v > CURRENT_VERSION) return { kind: 'newer', version: data.v };

  let current: Record<string, unknown> = data;
  for (let v = data.v; v < CURRENT_VERSION; v++) {
    const migrate = MIGRATIONS[v];
    if (!migrate) return { kind: 'corrupt' };
    current = migrate(current);
  }
  const progress = validate(current);
  return progress ? { kind: 'ok', progress } : { kind: 'corrupt' };
}
