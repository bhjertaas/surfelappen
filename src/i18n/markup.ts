/**
 * The only inline markup allowed in text: `*em*` and `**strong**` (ADR 0005).
 * Parsed into segments; nothing is ever interpreted as HTML.
 */

export interface Segment {
  readonly text: string;
  readonly style?: 'em' | 'strong';
}

export function parseMarkup(source: string): Segment[] {
  const segments: Segment[] = [];
  let plain = '';
  let i = 0;
  const flush = () => {
    if (plain !== '') segments.push({ text: plain });
    plain = '';
  };

  while (i < source.length) {
    const marker = source.startsWith('**', i) ? '**' : source[i] === '*' ? '*' : null;
    if (marker !== null) {
      const end = source.indexOf(marker, i + marker.length);
      // `*` must not match the first half of a `**` and spans must not be empty.
      const valid = end > i + marker.length && !(marker === '*' && source.startsWith('**', end));
      if (valid) {
        flush();
        segments.push({
          text: source.slice(i + marker.length, end),
          style: marker === '**' ? 'strong' : 'em',
        });
        i = end + marker.length;
        continue;
      }
    }
    plain += source[i];
    i++;
  }
  flush();
  return segments;
}

/** True when every `*` belongs to a well-formed span. Content tests use this. */
export function isBalanced(source: string): boolean {
  return parseMarkup(source).every((s) => s.style !== undefined || !s.text.includes('*'));
}
