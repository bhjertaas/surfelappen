import { expect, test } from '@playwright/test';
import { expectHeading, expectNoAxeViolations } from './helpers.ts';
import { choose, next } from './mission1.ts';

/** Sikkerhet, in order: a choice is a letter, an info screen is 'next'. */
const RUN = ['C', 'B', 'next', 'B', 'B', 'A', 'B', 'B', 'B', 'next'] as const;

test('Sikkerhet in Lenkevikbanken: eight questions, two tips, a sticker and further reading', async ({
  page,
}) => {
  await page.goto('/#/mission/security-basics');
  await expectHeading(page, 'Sikkerhet');
  await page.getByRole('button', { name: 'Begynn' }).click();

  // A wrong answer first: it shows what happens, then try again.
  await choose(page, 'A');
  await expect(page.locator('.feedback')).toContainText('Ikke helt');
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Prøv igjen' }).click();

  for (const step of RUN) {
    if (step === 'next') {
      await next(page);
      continue;
    }
    await choose(page, step);
    await expect(page.locator('.feedback')).toContainText('Riktig');
    await next(page);
  }

  const dialog = page.getByRole('dialog', { name: 'Nytt klistremerke' });
  await expect(dialog).toContainText('Sikret');
  await dialog.getByRole('button', { name: 'Fint' }).click();
  await page.getByRole('link', { name: /Vil du vite mer/ }).click();
  await expect(page.getByRole('link', { name: /DNS4EU/ })).toBeVisible();
  await expectNoAxeViolations(page);
});
