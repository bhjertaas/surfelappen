import type { ClassifyStep, WebBin } from '../../content/types.ts';

/** Pure state for "Hvem er hvem?": one name at a time, retry until right. */

export interface ClassifyState {
  readonly index: number;
  /** The bin just chosen for this card, if any (shown with feedback). */
  readonly answer: WebBin | null;
  readonly missed: readonly string[];
}

export const START: ClassifyState = { index: 0, answer: null, missed: [] };

export function currentCard(step: ClassifyStep, state: ClassifyState) {
  return step.cards[state.index];
}

export function choose(step: ClassifyStep, state: ClassifyState, bin: WebBin): ClassifyState {
  const card = currentCard(step, state);
  if (!card || state.answer === card.bin) return state;
  const wrong = bin !== card.bin;
  return {
    ...state,
    answer: bin,
    missed: wrong && !state.missed.includes(card.id) ? [...state.missed, card.id] : state.missed,
  };
}

export function isRight(step: ClassifyStep, state: ClassifyState): boolean {
  return state.answer !== null && state.answer === currentCard(step, state)?.bin;
}

export function retry(state: ClassifyState): ClassifyState {
  return { ...state, answer: null };
}

export function next(state: ClassifyState): ClassifyState {
  return { ...state, index: state.index + 1, answer: null };
}

export function isFinished(step: ClassifyStep, state: ClassifyState): boolean {
  return state.index >= step.cards.length;
}

/** Cards already sorted into `bin` (shown in the bins as you go). */
export function sortedInto(step: ClassifyStep, state: ClassifyState, bin: WebBin): string[] {
  const placed = step.cards.slice(0, state.index + (isRight(step, state) ? 1 : 0));
  return placed.filter((c) => c.bin === bin).map((c) => c.id);
}
