import { expect, test } from '@playwright/test';
import { expectHeading } from './helpers.ts';
import { serveDist } from './static-server.ts';

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
  await expect(page.locator('.town__picture')).toHaveJSProperty('complete', true);
  expect(
    await page.locator('.town__picture').evaluate((img: HTMLImageElement) => img.naturalWidth),
  ).toBeGreaterThan(0);
  await context.setOffline(false);
});

test('a new version shows the update bar, and reloads only when asked', async ({ page }) => {
  const server = await serveDist();
  try {
    await page.goto(`${server.url}/#/town`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await expect
      .poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null))
      .toBe(true);

    // "Deploy" a new version: the service worker script changes on the server.
    server.overrides.set('/sw.js', (original) => `${original}\n// next version`);
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());

    const bar = page.getByRole('status').filter({ hasText: 'Ny versjon av spillet er klar.' });
    await expect(bar).toBeVisible();
    // It waits for the player: no reload by itself.
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/#\/town$/);
    await expect(bar).toBeVisible();

    await Promise.all([
      page.waitForEvent('load'),
      bar.getByRole('button', { name: 'Last inn på nytt' }).click(),
    ]);
    await expect(page.getByRole('heading', { level: 1, name: 'Lenkevik' })).toBeVisible();
    await expect(bar).toBeHidden();
    // The page is now controlled by the new worker.
    expect(
      await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.waiting),
    ).toBeFalsy();
  } finally {
    await server.close();
  }
});

test('a lesson opened once works offline, pictures included', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null))
    .toBe(true);

  // Opening the lesson caches its media in the background.
  await page.goto('/#/mission/how-the-net-works');
  await expectHeading(page, 'Hva er egentlig nettet?');
  await expect
    .poll(() =>
      page.evaluate(async () => (await (await caches.open('lesson-media')).keys()).length),
    )
    .toBeGreaterThanOrEqual(2);

  await context.setOffline(true);
  await page.reload();
  await expectHeading(page, 'Hva er egentlig nettet?');
  const scene = page.locator('.scene');
  await expect(scene).toHaveJSProperty('complete', true);
  expect(await scene.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await context.setOffline(false);
});
