import { describe, expect, it } from 'vitest';
import { isBalanced, parseMarkup } from './markup.ts';

describe('parseMarkup', () => {
  it('returns plain text as one segment', () => {
    expect(parseMarkup('Hei')).toEqual([{ text: 'Hei' }]);
  });
  it('parses em and strong', () => {
    expect(parseMarkup('Se *kornmune*, med **r** og **n**.')).toEqual([
      { text: 'Se ' },
      { text: 'kornmune', style: 'em' },
      { text: ', med ' },
      { text: 'r', style: 'strong' },
      { text: ' og ' },
      { text: 'n', style: 'strong' },
      { text: '.' },
    ]);
  });
  it('treats HTML as text', () => {
    expect(parseMarkup('<b>x</b>')).toEqual([{ text: '<b>x</b>' }]);
  });
  it('keeps unmatched markers as text', () => {
    expect(parseMarkup('2 * 3')).toEqual([{ text: '2 * 3' }]);
  });
});

describe('isBalanced', () => {
  it.each([
    ['plain', true],
    ['*em* and **strong**', true],
    ['Står det *m* eller *rn*?', true],
    ['Står det *m** eller rn*?', false],
    ['dangling *', false],
    ['**', false],
  ])('%s → %s', (text, expected) => {
    expect(isBalanced(text)).toBe(expected);
  });
});
