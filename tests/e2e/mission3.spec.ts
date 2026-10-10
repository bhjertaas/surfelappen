import { expect, test } from '@playwright/test';
import { expectHeading, expectNoAxeViolations } from './helpers.ts';

test('Lag glansbildet: crop away the mess, polish, caption, post, look behind', async ({
  page,
}) => {
  await page.goto('/#/mission/perfect-life');
  await expectHeading(page, 'Det perfekte livet');
  await page.getByRole('button', { name: 'Begynn' }).click();

  const status = page.locator('.compose__status');
  await expect(status).toContainText('oppvasken');
  const finish = page.getByRole('button', { name: 'Ferdig beskåret' });
  await expect(finish).toBeDisabled();

  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Mindre ramme' }).click();
  await expect(status).toContainText('Lina er ikke helt med i bildet.');
  await page.getByRole('button', { name: 'Flytt rammen opp' }).click();
  await expect(status).toContainText('Perfekt utsnitt.');
  await expectNoAxeViolations(page);
  await finish.click();

  await expect(page.getByRole('heading', { name: 'Lys og glød' })).toBeFocused();
  await page.getByRole('slider', { name: 'Lys' }).fill('4');
  await expect(page.getByText('Likes-prognose: 5')).toBeVisible();
  await page.getByRole('button', { name: 'Videre til bildetekst' }).click();

  await page.getByRole('button', { name: /#nofilter/ }).click();
  await page.getByRole('button', { name: 'Publiser' }).click();
  await expect(page.getByRole('heading', { name: 'Publisert' })).toBeFocused();
  await expect(page.getByText('Hvorfor ser mitt liv aldri sånn ut')).toBeVisible();
  await expectNoAxeViolations(page);

  await page.getByRole('button', { name: 'Se bak fasaden' }).click();
  await expect(page.getByText('Dette er hele bildet.')).toBeVisible();
  await page.getByRole('button', { name: 'Neste' }).click();

  await expect(page.getByRole('dialog', { name: 'Nytt klistremerke' })).toContainText(
    'Bak fasaden',
  );
});
