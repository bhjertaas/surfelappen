import { expect, test } from '@playwright/test';
import { expectHeading, expectNoAxeViolations, storedProgress } from './helpers.ts';
import { choose, next, PERFECT_RUN, QUESTION, solve, solveAll, startMission1 } from './mission1.ts';

test('a perfect run earns Lenkedetektiv and Skarpt øye', async ({ page }) => {
  await startMission1(page);
  await expect(page.getByText('Sak 1 av 6')).toBeVisible();
  await solveAll(page, PERFECT_RUN);

  await expect(page).toHaveURL(/#\/mission\/find-the-impostor\/done$/);
  await expectHeading(page, 'Oppdraget er fullført');
  await expect(page.getByText('6 av 6 saker')).toBeVisible();
  await expect(page.getByText('Du har klistremerket Lenkedetektiv.')).toBeVisible();
  await expect(page.getByText('Du har klistremerket Skarpt øye.')).toBeVisible();
  expect((await storedProgress(page))?.stickers).toEqual(['link-detective', 'sharp-eye']);

  // Both stickers are celebrated together, then focus returns to the summary.
  const celebration = page.getByRole('dialog', { name: 'Nye klistremerker' });
  await expect(celebration).toContainText('Lenkedetektiv');
  await expect(celebration).toContainText('Skarpt øye');
  await celebration.getByRole('button', { name: 'Fint' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Oppdraget er fullført' }),
  ).toBeFocused();
});

test('wrong answers explain, retries are free, and missed transfer cases get a backup', async ({
  page,
}) => {
  await startMission1(page);

  // Case 1: wrong first; feedback takes focus and explains.
  await choose(page, 'A');
  const feedback = page.locator('.feedback');
  await expect(feedback).toBeFocused();
  await expect(feedback).toContainText('Ikke helt');
  await page.getByRole('button', { name: 'Prøv igjen' }).click();
  await expect(page.getByRole('heading', { name: QUESTION })).toBeFocused();
  await choose(page, 'B');
  await expect(feedback).toContainText('Riktig svar');
  await expect(page.locator('.address')).toContainText('Nettstedet: pakkesporing.ru');

  // See what happens: the fake page looks like Pakkeposten, the address bar doesn't.
  await page.getByRole('button', { name: 'Se hva som skjer om du trykker på lenken' }).click();
  const fake = page.getByRole('figure', { name: 'Siden lenken åpner' });
  await expect(fake).toContainText('pakkeposten-no.pakkesporing.ru');
  await fake.getByRole('button', { name: 'Betal 29 kr' }).click();
  await expect(page.locator('.trap__after')).toBeFocused();
  await expect(page.locator('.trap__after')).toContainText('12 000 kr');
  await expectNoAxeViolations(page);
  await next(page);

  // Case 2: with both hint levels.
  await page.getByRole('button', { name: 'Vis et hint' }).click();
  await expect(page.getByText('Hva står helt til slutt')).toBeVisible();
  await page.getByRole('button', { name: 'Vis et hint til' }).click();
  await expect(page.getByRole('button', { name: /Vis et hint/ })).toHaveCount(0);
  await solve(page, 'case-2', 'A');

  await solveAll(page, PERFECT_RUN.slice(2, 9));

  // Transfer 1 missed: retry it, then its backup follows.
  await expect(page.getByText('Prøvesak 1 av 2')).toBeVisible();
  await choose(page, 'A');
  await page.getByRole('button', { name: 'Prøv igjen' }).click();
  await solve(page, 'transfer-1', 'B');
  await expect(page.getByText('Ekstra prøvesak')).toBeVisible();
  await solve(page, 'transfer-1-backup', 'B');
  await solve(page, 'transfer-2', 'A');

  await expectHeading(page, 'Oppdraget er fullført');
  await expect(page.getByText('4 av 6 saker')).toBeVisible();
  await expect(page.getByText('Du har klistremerket Lenkedetektiv.')).toBeVisible();
  await expect(page.getByText('Du kan også få Skarpt øye')).toBeVisible();
});

test('pointing at a link shows where it really goes; pressing it shows a preview', async ({
  page,
}) => {
  await startMission1(page);
  await solveAll(page, PERFECT_RUN.slice(0, 4));
  await expect(page).toHaveURL(/\/case-5$/);
  const link = page.getByRole('button', { name: 'lenkevikbanken.no/sikkerhet' });
  const real = 'https://sikkerhet-varsel.xyz/lenkevikbanken';
  await expect(page.locator('.statusbar')).toHaveCount(0);
  await link.hover();
  await expect(page.locator('.statusbar')).toHaveText(real);
  await expect(link).toHaveAttribute('aria-expanded', 'false');
  await link.click();
  await expect(link).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.link-preview')).toContainText(real);
  // Nothing navigates.
  await expect(page).toHaveURL(/\/case-5$/);
});

test('QR cases show a real QR code and what the camera would show', async ({ page }) => {
  await startMission1(page);
  await solveAll(page, PERFECT_RUN.slice(0, 9));
  await expect(page).toHaveURL(/\/transfer-1$/);
  await expect(page.getByRole('img', { name: 'QR-kode' })).toBeVisible();
  await page.getByRole('button', { name: 'Vis hva kameraet ser' }).click();
  await expect(page.locator('.link-preview')).toContainText(
    'https://betal.lenkevik-kommune.no.parkering-app.net/',
  );
  await expectNoAxeViolations(page);
});

test('leaving mid-mission and coming back resumes at the first unfinished step', async ({
  page,
}) => {
  await startMission1(page);
  await solveAll(page, PERFECT_RUN.slice(0, 2));
  await page.reload();
  await expect(page).toHaveURL(/\/case-3$/);
  await page.goto('/');
  await page.getByRole('link', { name: 'Fortsett der du slapp' }).click();
  await expect(page).toHaveURL(/\/case-3$/);
});

test('a missed transfer case still needs its backup after a reload', async ({ page }) => {
  await startMission1(page);
  await solveAll(page, PERFECT_RUN.slice(0, 9));
  await choose(page, 'A');
  await page.reload();
  await solve(page, 'transfer-1', 'B');
  await expect(page).toHaveURL(/\/transfer-1-backup$/);
});

test('"Spill igjen" replays the mission without losing stickers', async ({ page }) => {
  await startMission1(page);
  await solveAll(page, PERFECT_RUN);
  await page
    .getByRole('dialog', { name: 'Nye klistremerker' })
    .getByRole('button', { name: 'Fint' })
    .click();
  await page.goto('/#/mission/find-the-impostor');
  await page.getByRole('button', { name: 'Spill igjen' }).click();
  await expect(page).toHaveURL(/\/case-1$/);
  expect((await storedProgress(page))?.stickers).toEqual(['link-detective', 'sharp-eye']);
});

test('playable with the keyboard alone', async ({ page, isMobile }) => {
  test.skip(isMobile, 'A keyboard-only run is a desktop scenario');
  await startMission1(page);
  // Tab to the "B" option and press Enter.
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const text = await page.evaluate(() => document.activeElement?.textContent ?? '');
    if (text.startsWith('B ')) break;
  }
  await page.keyboard.press('Enter');
  await expect(page.locator('.feedback')).toBeFocused();
  // Through the feedback ("Les mer", the fake page and its button), on to "Neste".
  await page.keyboard.press('Tab');
  await expect(page.getByText('Les mer')).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Betal 29 kr' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.trap__after')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Neste' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/case-2$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('no axe violations in any Mission 1 state', async ({ page }) => {
  await startMission1(page);
  await page.locator('.message__link').click();
  await page.getByRole('button', { name: 'Vis et hint' }).click();
  await expectNoAxeViolations(page);
  await choose(page, 'A');
  await expectNoAxeViolations(page);
  await choose(page, 'B');
  await page.getByText('Les mer').click();
  await expectNoAxeViolations(page);
  await next(page);
  await solveAll(page, PERFECT_RUN.slice(1, 6));
  await expect(page).toHaveURL(/\/habit$/);
  await expectNoAxeViolations(page);
  await choose(page, 'A');
  await expectNoAxeViolations(page);
  await choose(page, 'B');
  await next(page);
  await expect(page).toHaveURL(/\/habit-tip$/);
  await expectNoAxeViolations(page);
  await solveAll(page, PERFECT_RUN.slice(7));
  await expectHeading(page, 'Oppdraget er fullført');
  await expectNoAxeViolations(page);
});
