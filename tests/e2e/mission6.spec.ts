import { expect, test } from '@playwright/test';
import { expectHeading, expectNoAxeViolations } from './helpers.ts';
import { choose, next } from './mission1.ts';

/** Correct answers per counter, in order (each counter starts with an info screen). */
const COUNTERS: readonly (readonly ('A' | 'B' | 'C')[])[] = [
  ['B', 'C', 'B'],
  ['B', 'A', 'C'],
  ['A', 'B', 'C'],
  ['B', 'A', 'C'],
];

test('Skrankene: four counters, a wrong answer explained, then the stamp', async ({ page }) => {
  await page.goto('/#/mission/the-counters');
  await expectHeading(page, 'Skrankene');
  await page.getByRole('button', { name: 'Begynn' }).click();

  await expect(page.getByRole('heading', { name: 'Luke 1: Nettet' })).toBeVisible();
  await next(page);
  // A wrong answer first: explained, then tried again.
  await choose(page, 'A');
  await expect(page.locator('.feedback')).toContainText('Ikke helt');
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Prøv igjen' }).click();

  for (const [i, answers] of COUNTERS.entries()) {
    if (i > 0) {
      await expect(page.getByRole('heading', { name: new RegExp(`^Luke ${i + 1}`) })).toBeVisible();
      await next(page);
    }
    for (const letter of answers) {
      await choose(page, letter);
      await expect(page.locator('.feedback')).toContainText('Riktig');
      await next(page);
    }
  }

  await expect(page.getByRole('heading', { name: 'Stemplet!' })).toBeVisible();
  await next(page);
  const dialog = page.getByRole('dialog', { name: 'Nytt klistremerke' });
  await expect(dialog).toContainText('Surfelapp');
  await dialog.getByRole('button', { name: 'Fint' }).click();
  await expect(page.getByText(/saker/)).toHaveCount(0);
  await expectNoAxeViolations(page);
});
