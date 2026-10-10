import { expect, test } from '@playwright/test';
import { expectHeading } from './helpers.ts';

/** WCAG 1.4.10 Reflow and 1.4.4 Resize text: no horizontal scrolling. */
const SCREENS = [
  ['', 'Surfelappen'],
  ['#/town', 'Lenkevik'],
  ['#/mission/find-the-impostor', 'Finn bedrageren'],
  ['#/mission/ten-fingers', 'Ti fingre'],
  ['#/passport', 'Passet ditt'],
  ['#/about', 'Om Surfelappen'],
] as const;

async function horizontalOverflow(page: import('@playwright/test').Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

test.describe('at 320 px wide', () => {
  test.use({ viewport: { width: 320, height: 640 } });
  for (const [path, heading] of SCREENS) {
    test(`${path || 'start'} has no horizontal scroll`, async ({ page }) => {
      await page.goto(`/${path}`);
      await expectHeading(page, heading);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    });
  }
});

test.describe('with text at 200 %', () => {
  test.use({ viewport: { width: 640, height: 800 } });
  for (const [path, heading] of SCREENS) {
    test(`${path || 'start'} has no horizontal scroll`, async ({ page }) => {
      await page.addInitScript(() => {
        document.addEventListener('DOMContentLoaded', () => {
          document.documentElement.style.fontSize = '200%';
        });
      });
      await page.goto(`/${path}`);
      await expectHeading(page, heading);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    });
  }
});
