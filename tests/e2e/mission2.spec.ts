import { expect, test } from '@playwright/test';
import { expectHeading, expectNoAxeViolations, storedProgress } from './helpers.ts';
import { completeStep, FINAL_LINE, nb, send, startMission2, us } from './mission2.ts';

test('a flawless run earns Ti fingre and Stø hånd', async ({ page }) => {
  await startMission2(page);
  await expect(page.getByText('Del 1 av 5')).toBeVisible();
  for (const i of [0, 1, 2, 3]) await completeStep(page, i);
  await expect(page).toHaveURL(/\/step-5$/);
  await send(page, nb(FINAL_LINE));
  await expect(page.locator('.feedback')).toBeFocused();
  await expect(page.locator('.feedback')).toContainText('Godt jobbet. 100 % riktig.');
  await page.getByRole('button', { name: 'Neste' }).click();

  await expectHeading(page, 'Oppdraget er fullført');
  await expect(page.getByText('Siste linje: 100 % riktig.')).toBeVisible();
  await expect(page.getByText('Du har klistremerket Ti fingre.')).toBeVisible();
  await expect(page.getByText('Du har klistremerket Stø hånd.')).toBeVisible();
  expect((await storedProgress(page))?.stickers).toEqual(['ten-fingers', 'steady-hand']);
});

test('real key presses work, and the field stays empty', async ({ page }) => {
  await startMission2(page);
  await page.keyboard.press('f');
  await page.keyboard.press('Space');
  await page.keyboard.press('k');
  await expect(page.getByText('Det var K. Prøv J med høyre pekefinger.')).toBeVisible();
  await page.keyboard.press('j');
  await expect(page.getByText('Neste tast: mellomrom, med tommelen.')).toBeVisible();
  await expect(page.locator('.capture__input')).toHaveValue('');
});

test('the final line needs 90 %; below that it is retried', async ({ page }) => {
  await startMission2(page);
  for (const i of [0, 1, 2, 3]) await completeStep(page, i);
  const wrong = nb('xxxx');
  await send(page, [...wrong, ...nb(FINAL_LINE)]);
  // Percentages use a non-breaking space ("88 %"); \s matches it.
  await expect(page.getByText(/88\s%\s+riktig\. Du trenger minst 90\s%/)).toBeVisible();
  await page.getByRole('button', { name: 'Prøv linjen igjen' }).click();
  await expect(page.locator('.capture__input')).toBeFocused();
  await send(page, [...nb('x'), ...nb(FINAL_LINE)]);
  await expect(page.getByText('Godt jobbet. 97 % riktig.')).toBeVisible();
  await page.getByRole('button', { name: 'Neste' }).click();
  await expect(page.getByText('Du har klistremerket Ti fingre.')).toBeVisible();
  await expect(page.getByText('Du kan også få Stø hånd')).toBeVisible();
});

test('another keyboard layout gets a hint and can carry on by key position', async ({ page }) => {
  await startMission2(page);
  // Step 1: "f j f j d k d k s l s l a ø a ø". Type up to the first ø.
  await send(page, nb('f j f j d k d k s l s l a '));
  await send(page, us('øøø'));
  await expect(
    page.getByText('Det ser ut som tastaturet ditt er satt til et annet språk'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Fortsett med dette tastaturet' }).click();
  await expect(page.locator('.capture__input')).toBeFocused();
  await send(page, us('ø a ø'));
  await expect(page.getByText('Godt jobbet. 100 % riktig.')).toBeVisible();
  await expect
    .poll(async () => {
      const missions = (await storedProgress(page))?.missions as
        | Record<string, { run: { positional: boolean } }>
        | undefined;
      return missions?.['ten-fingers']?.run.positional;
    })
    .toBe(true);
});

test('Caps Lock is forgiven and explained', async ({ page }) => {
  await startMission2(page);
  await send(page, [{ key: 'F', code: 'KeyF', modifierCapsLock: true }]);
  await expect(page.getByText('Caps Lock er på')).toBeVisible();
  await expect(page.getByText('Neste tast: mellomrom, med tommelen.')).toBeVisible();
});

test('leaving mid-lesson resumes at the first unfinished step', async ({ page }) => {
  await startMission2(page);
  await completeStep(page, 0);
  await page.reload();
  await expect(page).toHaveURL(/\/step-2$/);
});

test('no axe violations in any Ti fingre state', async ({ page }) => {
  await startMission2(page);
  await expectNoAxeViolations(page);
  await send(page, nb('k'));
  await expectNoAxeViolations(page);
  await send(page, [{ key: 'F', code: 'KeyF', modifierCapsLock: true }]);
  await send(page, nb(' j f j d k d k s l s l a '));
  await send(page, us('øøø'));
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Fortsett med dette tastaturet' }).click();
  await send(page, us('ø a ø'));
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Neste' }).click();
  for (const i of [1, 2, 3, 4]) await completeStep(page, i);
  await expectHeading(page, 'Oppdraget er fullført');
  await expectNoAxeViolations(page);
});
