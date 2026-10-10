import { expect, test } from '@playwright/test';
import { expectHeading } from './helpers.ts';

test('the manifest describes an installable Norwegian app', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(href).not.toBeNull();
  const manifest = await (await request.get(href ?? '')).json();
  expect(manifest).toMatchObject({
    name: 'Surfelappen',
    lang: 'nb',
    display: 'standalone',
    start_url: '/',
  });
  for (const icon of manifest.icons as { src: string }[]) {
    expect((await request.get(icon.src)).ok(), icon.src).toBe(true);
  }
});

test('Chromium finds no installability problems', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Installability check uses the Chrome DevTools Protocol');
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  const cdp = await page.context().newCDPSession(page);
  const { installabilityErrors } = await cdp.send('Page.getInstallabilityErrors');
  expect(installabilityErrors).toEqual([]);
});

test('works offline after the first visit', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  // Reload once so the service worker controls the page.
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null))
    .toBe(true);

  await context.setOffline(true);
  await page.reload();
  await expectHeading(page, 'Surfelappen');
  await page.goto('/#/mission/find-the-impostor');
  await expectHeading(page, 'Finn bedrageren');
  await page.goto('/#/town');
  await expectHeading(page, 'Lenkevik');
  await expect(page.locator('.town__map img')).toHaveJSProperty('complete', true);
  expect(
    await page.locator('.town__map img').evaluate((img: HTMLImageElement) => img.naturalWidth),
  ).toBeGreaterThan(0);
  await context.setOffline(false);
});
