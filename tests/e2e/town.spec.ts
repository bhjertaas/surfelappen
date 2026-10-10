import { expect, type Locator, test } from '@playwright/test';
import { storedProgress } from './helpers.ts';

async function destinations(container: Locator) {
  const controls = container.locator('a, button');
  const count = await controls.count();
  const result: { name: string; href: string | null }[] = [];
  for (let i = 0; i < count; i++) {
    const control = controls.nth(i);
    const name = (await control.locator('.building__name').textContent()) ?? '';
    result.push({ name, href: await control.getAttribute('href') });
  }
  return result;
}

test('picture and list offer the same destinations in the same order', async ({ page }) => {
  await page.goto('/#/town');
  const list = await destinations(page.locator('.town__list'));
  const map = await destinations(page.locator('.town__hotspots'));
  expect(list.map((d) => d.name)).toEqual([
    'Postkontoret',
    'Tastaturhallen',
    'Torget',
    'Biblioteket',
    'Lappekontoret',
  ]);
  expect(map).toEqual(list);
});

test('closed buildings say so in text and answer with a friendly line', async ({ page }) => {
  await page.goto('/#/town');
  const list = page.getByRole('navigation', { name: 'Steder i Lenkevik' });
  const square = list.getByRole('button', { name: /Torget/ });
  await expect(square).toContainText('Kommer snart');
  await square.click();
  await expect(page.getByRole('status').filter({ hasText: 'hva du deler på nett' })).toBeVisible();
  await expect(square).toBeFocused();
  expect((await storedProgress(page))?.visitedBuildings).toEqual(['square']);
});

test('the keyboard hall says "Trenger tastatur" only on touch-only devices', async ({ page }) => {
  await page.goto('/#/town');
  const touchOnly = await page.evaluate(
    () => matchMedia('(any-pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches,
  );
  const hall = page
    .getByRole('navigation', { name: 'Steder i Lenkevik' })
    .getByRole('link', { name: /Tastaturhallen/ });
  if (touchOnly) {
    await expect(hall).toContainText('Trenger tastatur');
    await hall.click();
    await expect(page.getByRole('heading', { name: 'Trenger tastatur' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start likevel' })).toBeVisible();
  } else {
    await expect(hall).not.toContainText('Trenger tastatur');
  }
});

test('Lappekontoret opens the passport', async ({ page }) => {
  await page.goto('/#/town');
  await page
    .getByRole('navigation', { name: 'Steder i Lenkevik' })
    .getByRole('link', { name: /Lappekontoret/ })
    .click();
  await expect(page).toHaveURL(/#\/passport$/);
  await expect
    .poll(async () => (await storedProgress(page))?.visitedBuildings)
    .toEqual(['licence-office']);
});
