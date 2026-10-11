import { expect, test } from '@playwright/test';
import { expectHeading, expectNoAxeViolations, STORAGE_KEY, storedProgress } from './helpers.ts';

const list = (page: import('@playwright/test').Page) =>
  page.getByRole('navigation', { name: 'Steder i Lenkevik' });

/** Visits every building, which earns Nysgjerrig on the last one (the passport). */
async function visitEveryBuilding(page: import('@playwright/test').Page) {
  await page.goto('/#/town');
  await page.goto('/#/mission/perfect-life');
  await expectHeading(page, 'Det perfekte livet');
  await page.goto('/#/mission/the-shark-rumour');
  await expectHeading(page, 'Haien i Lenkevik');
  await page.goto('/#/town');
  await list(page)
    .getByRole('button', { name: /Agnbua/ })
    .click();
  await list(page)
    .getByRole('link', { name: /Kafé Krøllalfa/ })
    .click();
  await expectHeading(page, 'Hva er egentlig nettet?');
  await page.goto('/#/mission/ten-fingers');
  await expectHeading(page, 'Ti fingre');
  await page
    .getByRole('navigation', { name: 'Hovedmeny' })
    .getByRole('link', { name: 'Passet' })
    .click();
}

test('the passport shows every sticker and how to earn it', async ({ page }) => {
  await page.goto('/#/passport');
  const album = page.getByRole('list', { name: 'Klistremerker' });
  await expect(album.getByRole('heading')).toHaveText([
    'Lenkedetektiv',
    'Skarpt øye',
    'Ti fingre',
    'Stø hånd',
    'Bak fasaden',
    'Reklamejeger',
    'Nettkjenner',
    'Faktasjekker',
    'Surfelapp',
    'Nysgjerrig',
  ]);
  await expect(album.getByText('Ikke tjent ennå')).toHaveCount(10);
  await expect(page.getByText('Du har besøkt 1 av 6 hus.')).toBeVisible();
  await expectNoAxeViolations(page);
});

test('a new sticker is celebrated in a dialog that can be skipped', async ({ page }) => {
  await visitEveryBuilding(page);
  const dialog = page.getByRole('dialog', { name: 'Nytt klistremerke' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Nysgjerrig');
  await expectNoAxeViolations(page);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('heading', { level: 1, name: 'Passet ditt' })).toBeFocused();
  await expect(page.getByRole('listitem').filter({ hasText: 'Nysgjerrig' })).toContainText('Tjent');
});

test('the celebration does not animate with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await visitEveryBuilding(page);
  const dialog = page.getByRole('dialog', { name: 'Nytt klistremerke' });
  await expect(dialog).toBeVisible();
  const duration = await dialog.evaluate((el) => getComputedStyle(el).animationDuration);
  expect(Number.parseFloat(duration)).toBeLessThan(0.01);
});

test('stickers survive a reload and are cleared only by a confirmed reset', async ({ page }) => {
  await visitEveryBuilding(page);
  await page.getByRole('button', { name: 'Fint' }).click();
  await page.reload();
  await expect(page.getByRole('listitem').filter({ hasText: 'Nysgjerrig' })).toContainText('Tjent');

  // Cancel keeps everything; it's the button that gets focus.
  await page.getByRole('button', { name: 'Nullstill fremgang' }).click();
  const confirm = page.getByRole('dialog', { name: 'Slette all fremgang?' });
  await expect(confirm.getByRole('button', { name: 'Avbryt' })).toBeFocused();
  await expectNoAxeViolations(page);
  await confirm.getByRole('button', { name: 'Avbryt' }).click();
  expect((await storedProgress(page))?.stickers).toEqual(['curious']);

  await page.getByRole('button', { name: 'Nullstill fremgang' }).click();
  await confirm.getByRole('button', { name: 'Ja, slett alt' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Fremgangen er slettet.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('list', { name: 'Klistremerker' }).getByText('Ikke tjent ennå'),
  ).toHaveCount(10);
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Fortsett der du slapp' })).toHaveCount(0);
});

test('the about page explains storage, deletion, sources and licence', async ({ page }) => {
  await page.goto('/#/about');
  await expect(
    page.getByRole('heading', { name: 'Slik sletter du det som er lagret' }),
  ).toBeVisible();
  await expect(page.getByText('Nullstill fremgang')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Nettvett.no (NorSIS)' })).toHaveAttribute(
    'href',
    'https://nettvett.no',
  );
  await expect(page.getByText('Ikke kontrollert mot kildene ennå.').first()).toBeVisible();
  await expect(page.getByText('ikke et bevis på kompetanse')).toBeVisible();
  await expect(page.getByText(/^Versjon \d+\.\d+\.\d+\+\w+$/)).toBeVisible();
  await expectNoAxeViolations(page);
});
