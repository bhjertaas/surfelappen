import { expect, test } from '@playwright/test';
import { expectHeading, expectNoAxeViolations } from './helpers.ts';

test('Haien i Lenkevik: react, follow the trail, check the pictures, tell Randi', async ({
  page,
}) => {
  await page.goto('/#/mission/the-shark-rumour');
  await expectHeading(page, 'Haien i Lenkevik');
  await page.getByRole('button', { name: 'Begynn' }).click();

  // Meldingen: sharing spreads it; then check first.
  await page.getByRole('button', { name: /Deler det med naboene/ }).click();
  await expect(page.locator('.feedback')).toBeFocused();
  await expect(page.getByText('4 800 har sett det')).toBeVisible();
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Prøv igjen' }).click();
  await page.getByRole('button', { name: /Hvor kommer dette fra/ }).click();
  await expect(page.locator('.feedback')).toContainText('God detektivrefleks');
  await page.getByRole('button', { name: 'Neste' }).click();

  // Følg sporet: back to the joke account.
  for (const who of ['Tante Randi', 'Bente Bakke', 'Trond T.']) {
    await page.getByRole('button', { name: `Hvor har ${who} det fra?` }).click();
  }
  await expect(page.getByText('Her startet det')).toBeVisible();
  await page.getByRole('button', { name: 'En spøk som ble tatt på alvor' }).click();
  await expect(page.locator('.feedback')).toContainText('Nettopp');
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Neste' }).click();

  // Bildene: search, find the clues, judge.
  await page.getByRole('button', { name: /Søk etter bildet/ }).click();
  await expect(page.getByText('Waikiki')).toBeVisible();
  for (const spot of ['Palmene', 'Fjellet']) await page.getByRole('button', { name: spot }).click();
  await page.getByRole('button', { name: 'Gammelt bilde, ny historie' }).click();
  await expect(page.locator('.feedback')).toContainText('Riktig');
  await page.getByRole('button', { name: 'Neste' }).click();

  await page.getByRole('button', { name: /Søk etter bildet/ }).click();
  await expect(page.getByText('Ingen treff')).toBeVisible();
  await page.getByRole('button', { name: 'Haien' }).click();
  await expect(page.getByText('To ryggfinner')).toBeVisible();
  for (const spot of ['Telefonen', 'Skiltet'])
    await page.getByRole('button', { name: spot }).click();
  await page.getByRole('button', { name: 'Ekte og nytt' }).click();
  await expect(page.locator('.feedback')).toContainText('Ikke helt');
  await page.getByRole('button', { name: 'Prøv igjen' }).click();
  await page.getByRole('button', { name: 'Laget med AI' }).click();
  await expect(page.locator('.feedback')).toContainText('Riktig');
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Neste' }).click();
  await page.getByRole('button', { name: 'Neste' }).click();

  // Si fra: the kind reply.
  await page.getByRole('button', { name: /Slutt å spre/ }).click();
  await expect(page.getByText('Unnskyld at jeg prøvde')).toBeVisible();
  await page.getByRole('button', { name: 'Prøv igjen' }).click();
  await page.getByRole('button', { name: /Takk for at du passer på oss/ }).click();
  await expect(page.getByText('så flaut')).toBeVisible();
  await page.getByRole('button', { name: 'Neste' }).click();

  const dialog = page.getByRole('dialog', { name: 'Nytt klistremerke' });
  await expect(dialog).toContainText('Faktasjekker');
  await dialog.getByRole('button', { name: 'Fint' }).click();

  await page.getByRole('link', { name: /Vil du vite mer/ }).click();
  await expect(page.getByRole('heading', { name: 'Haien på motorveien' })).toBeVisible();
  await expectNoAxeViolations(page);
});
