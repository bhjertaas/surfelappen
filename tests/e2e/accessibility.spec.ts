import { test } from '@playwright/test';
import { expectHeading, expectNoAxeViolations } from './helpers.ts';

for (const [path, heading] of [
  ['', 'Surfelappen'],
  ['#/town', 'Lenkevik'],
  ['#/mission/find-the-impostor', 'Finn bedrageren'],
  ['#/mission/ten-fingers', 'Ti fingre'],
  ['#/mission/find-the-impostor/case-1', 'Finn bedrageren'],
  ['#/passport', 'Passet ditt'],
  ['#/about', 'Om Surfelappen'],
  ['#/nowhere', 'Fant ikke siden'],
] as const) {
  test(`no axe violations on ${path || 'start'}`, async ({ page }) => {
    await page.goto(`/${path}`);
    await expectHeading(page, heading);
    await expectNoAxeViolations(page);
  });
}

test('no axe violations with the storage note showing', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/#/town');
  await expectHeading(page, 'Lenkevik');
  await expectNoAxeViolations(page);
});
