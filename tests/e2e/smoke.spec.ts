import { expect, test } from '@playwright/test';

test('start page renders in Norwegian', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'nb');
  await expect(page.getByRole('heading', { level: 1, name: 'Surfelappen' })).toBeVisible();
});

test('makes no requests to other origins', async ({ page, baseURL }) => {
  const origin = new URL(baseURL ?? '').origin;
  const foreign: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.protocol.startsWith('http') && url.origin !== origin) foreign.push(request.url());
  });
  for (const path of ['/', '/#/town', '/#/mission/find-the-impostor']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
  }
  expect(foreign).toEqual([]);
});

test('has no console errors (including CSP violations)', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  for (const path of ['/', '/#/town', '/#/mission/find-the-impostor', '/#/about']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
  }
  expect(errors).toEqual([]);
});
