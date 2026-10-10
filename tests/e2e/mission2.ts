import { expect, type Page } from '@playwright/test';
import { tenFingers } from '../../src/content/missions/ten-fingers/structure.ts';
import { keyForChar } from '../../src/interactions/typing/keymap-nb.ts';

/** Helpers for playing Ti fingre in tests. */

export interface Stroke {
  key: string;
  code: string;
  modifierCapsLock?: boolean;
}

/** Keystrokes as a Norwegian keyboard sends them. */
export function nb(text: string): Stroke[] {
  return [...text].map((ch) => ({ key: ch, code: keyForChar(ch)?.code ?? '' }));
}

/** Keystrokes from a US keyboard: the Ø and Æ keys type ";" and "'". */
export function us(text: string): Stroke[] {
  return nb(text).map((s) =>
    s.key === 'ø' ? { ...s, key: ';' } : s.key === 'æ' ? { ...s, key: "'" } : s,
  );
}

/** Sends keystrokes to the typing field, all within one task (faster than any re-render). */
export async function send(page: Page, strokes: Stroke[]): Promise<void> {
  await page.locator('.capture__input').evaluate((el, list) => {
    for (const s of list) {
      el.dispatchEvent(new KeyboardEvent('keydown', { ...s, bubbles: true, cancelable: true }));
    }
  }, strokes);
}

export async function startMission2(page: Page): Promise<void> {
  await page.goto('/#/mission/ten-fingers');
  await page.getByRole('button', { name: /^(Begynn|Start likevel)$/ }).click();
  await expect(page).toHaveURL(/\/step-1$/);
  await expect(page.locator('.capture__input')).toBeFocused();
}

/** Types every line of the current step correctly and presses "Neste". */
export async function completeStep(page: Page, index: number): Promise<void> {
  const step = tenFingers.steps[index];
  if (!step) throw new Error(`No step ${index}`);
  await expect(page).toHaveURL(new RegExp(`/${step.id}$`));
  for (const line of step.drills) await send(page, nb(line));
  await page.getByRole('button', { name: 'Neste' }).click();
}

export const FINAL_LINE = tenFingers.steps[4]?.drills[0] ?? '';
