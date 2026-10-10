import { describe, expect, it, vi } from 'vitest';
import { memoryBackend, type StorageBackend } from './backends.ts';
import { load } from './migrations.ts';
import { emptyProgress, type Progress } from './schema.ts';
import { createProgressStore } from './store.ts';

const sample: Progress = {
  v: 1,
  lastMission: 'find-the-impostor',
  visitedBuildings: ['post-office'],
  stickers: ['link-detective'],
  missions: {
    'find-the-impostor': {
      completedOnce: true,
      run: {
        interaction: 'link-inspect',
        solved: ['case-1'],
        firstTry: ['case-1'],
        missedTransfer: [],
      },
    },
    'ten-fingers': {
      completedOnce: false,
      run: { interaction: 'typing', done: ['step-1'], positional: false },
    },
  },
};

describe('load', () => {
  it('returns empty for nothing stored', () => {
    expect(load(null)).toEqual({ kind: 'empty' });
  });
  it('round-trips valid data', () => {
    expect(load(JSON.stringify(sample))).toEqual({ kind: 'ok', progress: sample });
  });
  it.each(['{', '[]', '"x"', '{"v":"1"}', '{"v":0}', '{"v":1,"stickers":"x"}'])(
    'treats %s as corrupt',
    (raw) => {
      expect(load(raw).kind).toBe('corrupt');
    },
  );
  it('rejects a run with an unknown interaction', () => {
    const bad = {
      ...sample,
      missions: { x: { completedOnce: false, run: { interaction: 'dance' } } },
    };
    expect(load(JSON.stringify(bad)).kind).toBe('corrupt');
  });
  it('recognises data from a newer version', () => {
    expect(load('{"v":7}')).toEqual({ kind: 'newer', version: 7 });
  });
  it('drops unknown top-level fields', () => {
    const result = load(JSON.stringify({ ...sample, extra: 'x' }));
    expect(result.kind === 'ok' && 'extra' in result.progress).toBe(false);
  });
});

describe('createProgressStore', () => {
  it('loads stored progress', () => {
    const store = createProgressStore(memoryBackend(JSON.stringify(sample)));
    expect(store.get()).toEqual(sample);
    expect(store.status()).toBe('ok');
  });

  it('saves on update and notifies subscribers', () => {
    const backend = memoryBackend();
    const store = createProgressStore(backend);
    const listener = vi.fn();
    store.subscribe(listener);
    store.update((p) => ({ ...p, visitedBuildings: ['library'] }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(JSON.parse(backend.read() ?? '')).toMatchObject({ v: 1, visitedBuildings: ['library'] });
  });

  it('skips saving and notifying when nothing changed', () => {
    const backend = memoryBackend();
    const write = vi.spyOn(backend, 'write');
    const store = createProgressStore(backend);
    const listener = vi.fn();
    store.subscribe(listener);
    store.update((p) => p);
    expect(write).not.toHaveBeenCalled();
    expect(listener).not.toHaveBeenCalled();
  });

  it('starts fresh over corrupt data and replaces it on the next save', () => {
    const backend = memoryBackend('{not json');
    const store = createProgressStore(backend);
    expect(store.get()).toEqual(emptyProgress());
    store.update((p) => ({ ...p, stickers: ['curious'] }));
    expect(JSON.parse(backend.read() ?? '').stickers).toEqual(['curious']);
  });

  it('never overwrites data from a newer version', () => {
    const backend = memoryBackend('{"v":2,"future":true}');
    const store = createProgressStore(backend);
    expect(store.status()).toBe('newer-version');
    store.update((p) => ({ ...p, stickers: ['curious'] }));
    expect(store.get().stickers).toEqual(['curious']);
    expect(backend.read()).toBe('{"v":2,"future":true}');
  });

  it('plays without storage', () => {
    const store = createProgressStore(null);
    expect(store.status()).toBe('unavailable');
    store.update((p) => ({ ...p, stickers: ['curious'] }));
    expect(store.get().stickers).toEqual(['curious']);
  });

  it('becomes unavailable when a write fails, keeping state in memory', () => {
    const failing: StorageBackend = {
      read: () => null,
      write: () => {
        throw new Error('QuotaExceededError');
      },
      clear: () => {},
    };
    const store = createProgressStore(failing);
    store.update((p) => ({ ...p, stickers: ['curious'] }));
    expect(store.status()).toBe('unavailable');
    expect(store.get().stickers).toEqual(['curious']);
  });

  it('resets state and storage', () => {
    const backend = memoryBackend(JSON.stringify(sample));
    const store = createProgressStore(backend);
    const listener = vi.fn();
    store.subscribe(listener);
    store.reset();
    expect(store.get()).toEqual(emptyProgress());
    expect(backend.read()).toBeNull();
    expect(listener).toHaveBeenCalled();
  });

  it('reloads after another tab changed storage', () => {
    const backend = memoryBackend();
    const store = createProgressStore(backend);
    backend.write(JSON.stringify(sample));
    store.reload();
    expect(store.get()).toEqual(sample);
  });
});
