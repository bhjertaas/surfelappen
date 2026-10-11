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

  // Reklamejakt: a wrong answer is explained and retried; the rest right first time.
  await expect(page.getByRole('heading', { name: 'Reklamejakt' })).toBeVisible();
  await expect(page.getByText('Innlegg 1 av 7')).toBeVisible();
  await page.getByRole('button', { name: 'Ikke reklame', exact: true }).click();
  await expect(page.locator('.feedback')).toBeFocused();
  await expect(page.locator('.feedback')).toContainText('Ikke helt');
  await page.getByRole('button', { name: 'Prøv igjen' }).click();
  await expect(page.getByText('rabattkode med navnet hennes')).toBeVisible();
  const verdicts = [
    'Reklame',
    'Ikke reklame',
    'Reklame',
    'Ikke reklame',
    'Reklame',
    'Reklame',
    'Ikke reklame',
  ];
  for (const verdict of verdicts) {
    await page.getByRole('button', { name: verdict, exact: true }).click();
    await expect(page.locator('.feedback')).toContainText('Riktig');
    await page.getByRole('button', { name: 'Neste' }).click();
  }
  await expect(page.getByText('Riktig på første forsøk: 6 av 7.')).toBeVisible();
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Ferdig' }).click();

  // Tren feeden: three stops at the same kind, then fix Sara's feed.
  await expect(page.getByText('Runde 1 av 3')).toBeVisible();
  for (let i = 0; i < 3; i++) {
    await page
      .getByRole('button', { name: /^Stopp her/ })
      .first()
      .click();
  }
  await expect(page.getByText('Du stoppet mest ved glansbilder.')).toBeVisible();
  await page.getByRole('button', { name: 'Se Saras feed' }).click();
  await expect(page.getByText('Glansbilder i Saras feed: 5 av 6')).toBeVisible();
  const done = page.getByRole('button', { name: 'Ferdig' });
  await expect(done).toBeDisabled();
  await page
    .getByRole('button', { name: /^Vis færre som dette/ })
    .first()
    .click();
  await page
    .getByRole('button', { name: /^Vis færre som dette/ })
    .first()
    .click();
  for (const account of ['@klatreklubben', '@tigerpus', '@ida.m']) {
    await page
      .getByRole('button', { name: new RegExp(`^Følg\\W+${account.replace('.', '\\.')}`) })
      .click();
  }
  await expect(page.getByText('Glansbildene tar ikke over lenger.')).toBeVisible();
  await expectNoAxeViolations(page);
  await done.click();

  const dialog = page.getByRole('dialog', { name: 'Nye klistremerker' });
  await expect(dialog).toContainText('Bak fasaden');
  await expect(dialog).toContainText('Reklamejeger');
  await dialog.getByRole('button', { name: 'Fint' }).click();

  // Further reading: real examples, linking out.
  await page.getByRole('link', { name: /Vil du vite mer/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Vil du vite mer?' })).toBeFocused();
  await expect(page.getByRole('link', { name: /BBC News/ })).toHaveAttribute(
    'href',
    /^https:\/\/www\.bbc\.com\//,
  );
  await expectNoAxeViolations(page);
});
