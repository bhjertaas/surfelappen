import { expect, test } from '@playwright/test';
import { expectHeading, STORAGE_KEY } from './helpers.ts';

test('without storage, a note explains and the game still plays', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/');
  const note = page.getByRole('status').filter({ hasText: 'blir ikke lagret' });
  await expect(note).toBeVisible();
  await note.getByRole('button', { name: 'Lukk' }).click();
  await expect(note).toHaveCount(0);
  await page.getByRole('link', { name: 'Start', exact: true }).click();
  await expectHeading(page, 'Lenkevik');
});

test('corrupt saved data does not break the game', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, '{not json'), STORAGE_KEY);
  await page.goto('/#/town');
  await expectHeading(page, 'Lenkevik');
});

test('data from a newer version is left alone, with a note', async ({ page }) => {
  await page.addInitScript((key) => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem(key, '{"v":99}');
      sessionStorage.setItem('seeded', '1');
    }
  }, STORAGE_KEY);
  await page.goto('/#/town');
  await expect(page.getByRole('status').filter({ hasText: 'nyere versjon' })).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Steder i Lenkevik' })
    .getByRole('button', { name: /Ryktebørsen/ })
    .click();
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe('{"v":99}');
});
