import type { TypingText } from '../text-types.ts';
import type { tenFingers } from './structure.ts';

/** Ti fingre, bokmål (PRD Appendix B). */
export const tenFingersNb: TypingText<typeof tenFingers> = {
  title: 'Ti fingre',
  character: 'Kai i Tastaturhallen',
  intro: [
    'Med alle ti fingrene på tastaturet skriver du roligere, og du slipper å se ned hele tiden. Det går sakte i starten, og det er helt normalt. Nøyaktighet først – farten kommer av seg selv.',
  ],
  learn: 'Du lærer hvor fingrene skal ligge på tastaturet, og å skrive enkle ord uten å se ned.',
  steps: {
    'step-1': {
      instruction:
        'Kjenn etter de små hakkene på F og J. Legg pekefingrene der, og de andre fingrene ved siden av. Tomlene hviler på mellomromstasten.',
    },
    'step-2': { instruction: 'Én finger om gangen. Se på skjermen, ikke på tastaturet.' },
    'step-3': {
      instruction:
        'Pekefingrene strekker seg innover til G og H. Lillefingeren til høyre strekker seg ut til Æ.',
    },
    'step-4': { instruction: 'Nå blir bokstavene til ord.' },
    'step-5': { instruction: 'Siste linje. Ta den tiden du trenger.' },
  },
  summary: {
    takeaway:
      'Fingrene har hver sin plass. Finn hakkene på F og J, så finner fingrene veien hjem. Øv litt hver gang, så sitter det.',
  },
};
