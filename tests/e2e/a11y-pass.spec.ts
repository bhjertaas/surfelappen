import { expect, type Page, test } from '@playwright/test';
import { expectHeading, expectNoAxeViolations } from './helpers.ts';
import { choose, startMission1 } from './mission1.ts';
import { nb, send, startMission2, us } from './mission2.ts';

/**
 * Phase 6 sweep: the states the per-feature specs don't cover, plus checks
 * axe doesn't make (target size, reflow inside missions, forced colours).
 * Results are recorded in docs/accessibility-pass.md.
 */

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

/** Puts a mission step in its busiest state: lupen, both hints, wrong answer, Les mer. */
async function busyCase(page: Page): Promise<void> {
  await startMission1(page);
  await page.getByRole('button', { name: 'Bruk lupen' }).click();
  await page.getByRole('button', { name: 'Vis et hint' }).click();
  await page.getByRole('button', { name: 'Vis et hint til' }).click();
  await choose(page, 'A');
}

/** A typing step showing the layout hint and a wrong-key message. */
async function busyTyping(page: Page): Promise<void> {
  await startMission2(page);
  await send(page, nb('k'));
  await send(page, nb('f j f j d k d k s l s l a '));
  await send(page, us('øøø'));
  await expect(page.getByRole('button', { name: 'Fortsett med dette tastaturet' })).toBeVisible();
}

const BUSY_STATES: readonly (readonly [string, (page: Page) => Promise<void>])[] = [
  ['a link case with every panel open', busyCase],
  ['a typing step with hints showing', busyTyping],
];

test.describe('reflow inside missions at 320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } });
  for (const [name, setUp] of BUSY_STATES) {
    test(`${name} has no horizontal scroll`, async ({ page }) => {
      await setUp(page);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    });
  }
});

test.describe('reflow inside missions with text at 200 %', () => {
  test.use({ viewport: { width: 640, height: 800 } });
  for (const [name, setUp] of BUSY_STATES) {
    test(`${name} has no horizontal scroll`, async ({ page }) => {
      await page.addInitScript(() => {
        document.addEventListener('DOMContentLoaded', () => {
          document.documentElement.style.fontSize = '200%';
        });
      });
      await setUp(page);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    });
  }
});

/**
 * WCAG 2.5.8 asks for 24 px; the project aims for 44 px (PRD "Devices").
 * Links inside running text are exempt (2.5.8 "inline" exception).
 */
async function smallTargets(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const controls = document.querySelectorAll<HTMLElement>(
      'button, a[href], summary, input:not([type="hidden"])',
    );
    const small: string[] = [];
    for (const el of controls) {
      if (el.closest('p, li > p, dd') && el.tagName === 'A') continue;
      if (el.classList.contains('capture__input')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.width < 43.5 || r.height < 43.5) {
        small.push(
          `${el.tagName.toLowerCase()} "${el.textContent?.trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`,
        );
      }
    }
    return small;
  });
}

test.describe('touch targets are at least 44 px', () => {
  for (const [path, heading] of [
    ['', 'Surfelappen'],
    ['#/town', 'Lenkevik'],
    ['#/mission/find-the-impostor', 'Finn bedrageren'],
    ['#/passport', 'Passet ditt'],
    ['#/about', 'Om Surfelappen'],
  ] as const) {
    test(`on ${path || 'start'}`, async ({ page }) => {
      await page.goto(`/${path}`);
      await expectHeading(page, heading);
      expect(await smallTargets(page)).toEqual([]);
    });
  }

  test('in a link case with every panel open', async ({ page }) => {
    await busyCase(page);
    await choose(page, 'B');
    await page.getByText('Les mer').click();
    expect(await smallTargets(page)).toEqual([]);
  });

  test('in a typing step', async ({ page }) => {
    await busyTyping(page);
    expect(await smallTargets(page)).toEqual([]);
  });
});

test('no axe violations with the reset dialog open', async ({ page }) => {
  await page.goto('/#/passport');
  await page.getByRole('button', { name: 'Nullstill fremgang' }).click();
  const dialog = page.getByRole('dialog', { name: 'Slette all fremgang?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Avbryt' })).toBeFocused();
  await expectNoAxeViolations(page);
});

test('no axe violations on the "needs a keyboard" note', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The note shows on touch-only devices');
  await page.goto('/#/mission/ten-fingers');
  await expect(page.getByRole('button', { name: 'Start likevel' })).toBeVisible();
  await expectNoAxeViolations(page);
});

test.describe('in forced colours (Windows high contrast)', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Only Chromium emulates forced colours',
  );

  test('focus stays visible on buttons and links', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto('/#/town');
    await expectHeading(page, 'Lenkevik');
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab');
      const outline = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const s = getComputedStyle(el);
        return { style: s.outlineStyle, width: Number.parseFloat(s.outlineWidth) };
      });
      expect(outline.style).not.toBe('none');
      expect(outline.width).toBeGreaterThanOrEqual(2);
    }
  });

  test('chosen answers are marked by more than colour', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await busyCase(page);
    // The wrong answer is marked with text, not only a coloured border.
    await expect(page.getByRole('heading', { name: 'Ikke helt' })).toBeVisible();
    await expectNoAxeViolations(page);
  });
});

test('nothing moves with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await busyCase(page);
  const moving = await page.evaluate(() =>
    [...document.querySelectorAll('*')]
      .filter((el) => {
        const s = getComputedStyle(el);
        return (
          Number.parseFloat(s.animationDuration) > 0.01 ||
          Number.parseFloat(s.transitionDuration) > 0.01
        );
      })
      .map((el) => el.className || el.tagName),
  );
  expect(moving).toEqual([]);
});
