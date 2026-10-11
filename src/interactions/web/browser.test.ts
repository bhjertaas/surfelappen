import { describe, expect, it } from 'vitest';
import { howTheNetWorks } from '../../content/missions/how-the-net-works/structure.ts';
import type { BrowserStep } from '../../content/types.ts';
import { readAddressBar, resultsAddress, searchFinds } from './browser.ts';

const step = howTheNetWorks.steps.find((s) => s.kind === 'browser') as BrowserStep;

describe('readAddressBar', () => {
  it.each([
    ['nrk.no', 'nrk.no'],
    ['NRK.no', 'nrk.no'],
    ['  www.nrk.no ', 'nrk.no'],
    ['https://www.nrk.no/sport', 'nrk.no'],
    ['http://nrk.no?x=1', 'nrk.no'],
  ])('reads %j as the address %s', (input, host) => {
    expect(readAddressBar(input)).toEqual({ kind: 'address', host });
  });

  it('turns words without a dot, or with spaces, into a search', () => {
    expect(readAddressBar('nrk')).toEqual({ kind: 'search', query: 'nrk' });
    expect(readAddressBar('nrk nyheter')).toEqual({ kind: 'search', query: 'nrk nyheter' });
    expect(readAddressBar('hva er nrk.no')).toEqual({ kind: 'search', query: 'hva er nrk.no' });
  });

  it('ignores an empty bar', () => {
    expect(readAddressBar('   ')).toEqual({ kind: 'empty' });
  });
});

describe('searchFinds', () => {
  it('finds the target for its keyword in any case', () => {
    expect(searchFinds(step, 'NRK nyheter')).toBe(true);
    expect(searchFinds(step, 'været')).toBe(false);
  });
});

it('shows a search address for results', () => {
  expect(resultsAddress('ecosia.org', ' nrk tv ')).toBe('ecosia.org/search?q=nrk%20tv');
});
