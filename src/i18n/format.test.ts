import { describe, expect, it } from 'vitest';
import { format, percent, plural } from './format.ts';

describe('format', () => {
  it('fills placeholders', () => {
    expect(format('Sak {current} av {total}', { current: 3, total: 6 })).toBe('Sak 3 av 6');
  });
  it('leaves unknown placeholders visible', () => {
    expect(format('Hei {name}', {})).toBe('Hei {name}');
  });
});

describe('plural', () => {
  const forms = {
    zero: 'Ingen klistremerker',
    one: '{count} klistremerke',
    other: '{count} klistremerker',
  };
  it.each([
    [0, 'Ingen klistremerker'],
    [1, '1 klistremerke'],
    [2, '2 klistremerker'],
    [12, '12 klistremerker'],
  ])('%i', (n, expected) => {
    expect(plural('nb', n, forms)).toBe(expected);
  });
  it('falls back to other for 0 without a zero form', () => {
    expect(plural('nb', 0, { one: '{count} sak', other: '{count} saker' })).toBe('0 saker');
  });
});

describe('percent', () => {
  it('uses a non-breaking space before % in Norwegian', () => {
    expect(percent('nb', 0.93)).toBe('93 %');
  });
  it('rounds to whole percent', () => {
    expect(percent('nb', 30 / 31)).toBe('97 %');
    expect(percent('nb', 1)).toBe('100 %');
  });
});

describe('formatDate', () => {
  it('writes a long Norwegian date', async () => {
    const { formatDate } = await import('./format.ts');
    expect(formatDate('nb', '2026-10-10')).toBe('10. oktober 2026');
  });
});
