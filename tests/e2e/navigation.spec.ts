import { expect, test } from '@playwright/test';
import { expectHeading } from './helpers.ts';

test('start leads to the town, and focus moves to the new heading', async ({ page }) => {
  await page.goto('/');
  await expectHeading(page, 'Surfelappen');
  await expect(page.getByRole('link', { name: 'Fortsett der du slapp' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Start', exact: true }).click();
  await expect(page).toHaveURL(/#\/town$/);
  await expectHeading(page, 'Lenkevik');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page).toHaveTitle('Lenkevik – Surfelappen');
});

for (const [path, heading] of [
  ['#/town', 'Lenkevik'],
  ['#/passport', 'Passet ditt'],
  ['#/about', 'Om Surfelappen'],
  ['#/mission/find-the-impostor', 'Finn bedrageren'],
  ['#/mission/ten-fingers', 'Ti fingre'],
] as const) {
  test(`deep link ${path} works after refresh`, async ({ page }) => {
    await page.goto(`/${path}`);
    await expectHeading(page, heading);
    await page.reload();
    await expectHeading(page, heading);
  });
}

test('every screen but start has a visible way back to the town', async ({ page }) => {
  for (const path of ['#/passport', '#/about', '#/mission/find-the-impostor', '#/nowhere']) {
    await page.goto(`/${path}`);
    await page
      .getByRole('navigation', { name: 'Hovedmeny' })
      .getByRole('link', { name: 'Byen' })
      .click();
    await expectHeading(page, 'Lenkevik');
  }
});

test('unknown pages show a friendly not-found screen', async ({ page }) => {
  for (const path of [
    '#/nowhere',
    '#/mission/no-such-mission',
    '#/mission/no-such-mission/case-1',
  ]) {
    await page.goto(`/${path}`);
    await expectHeading(page, 'Fant ikke siden');
  }
  await page.getByRole('main').getByRole('link', { name: 'Tilbake til byen' }).click();
  await expectHeading(page, 'Lenkevik');
});

test('the back button leaves a mission instead of stepping through it', async ({ page }) => {
  await page.goto('/#/town');
  await page
    .getByRole('navigation', { name: 'Steder i Lenkevik' })
    .getByRole('link', { name: /Kafé Alfakrøll/ })
    .click();
  await expectHeading(page, 'Hva er egentlig nettet?');
  await page.getByRole('button', { name: 'Begynn' }).click();
  await expect(page).toHaveURL(/#\/mission\/how-the-net-works\/who-is-who$/);
  await page.goBack();
  await expectHeading(page, 'Hva er egentlig nettet?');
  await page.goBack();
  await expectHeading(page, 'Lenkevik');
});

test('a step link beyond the player’s progress goes to their current step', async ({ page }) => {
  await page.goto('/#/mission/find-the-impostor/case-4');
  await expect(page).toHaveURL(/#\/mission\/find-the-impostor\/case-1$/);
  await page.goto('/#/mission/find-the-impostor/done');
  await expect(page).toHaveURL(/#\/mission\/find-the-impostor\/case-1$/);
});

test('"Fortsett" appears once a mission is started and resumes it', async ({ page }) => {
  await page.goto('/#/mission/ten-fingers');
  await page.getByRole('button', { name: /Begynn|Start likevel/ }).click();
  await expect(page).toHaveURL(/#\/mission\/ten-fingers\/step-1$/);
  await page.goto('/');
  // The second button no longer says "Start": it goes to the town.
  await expect(page.getByRole('link', { name: 'Gå til byen' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start', exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: 'Fortsett der du slapp' }).click();
  await expect(page).toHaveURL(/#\/mission\/ten-fingers\/step-1$/);
  await page.goto('/#/mission/ten-fingers');
  await expect(page.getByRole('button', { name: /Begynn|Start likevel/ })).toBeVisible();
});
