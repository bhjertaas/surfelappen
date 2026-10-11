import type { BrowserStep } from '../../content/types.ts';

/** Pure logic for the toy browser in "Snarveien". */

export type Typed =
  | { readonly kind: 'address'; readonly host: string }
  | { readonly kind: 'search'; readonly query: string }
  | { readonly kind: 'empty' };

/**
 * What a browser does with what's typed in the address bar: something with a dot
 * and no spaces is an address (`https://`, `www.` and a trailing path are fine);
 * anything else becomes a search, as in real browsers.
 */
export function readAddressBar(input: string): Typed {
  const text = input.trim();
  if (text === '') return { kind: 'empty' };
  if (/\s/.test(text) || !text.includes('.')) return { kind: 'search', query: text };
  const host = text
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, '')
    .replace(/[/?#].*$/, '')
    .replace(/^www\./, '');
  return host === '' ? { kind: 'search', query: text } : { kind: 'address', host };
}

/** Does a search find the target? Any keyword, in any case, anywhere in the query. */
export function searchFinds(step: BrowserStep, query: string): boolean {
  const q = query.toLowerCase();
  return step.keywords.some((k) => q.includes(k.toLowerCase()));
}

/** What the address bar shows on the results page of an engine. */
export function resultsAddress(engineHost: string, query: string): string {
  return `${engineHost}/search?q=${encodeURIComponent(query.trim())}`;
}
