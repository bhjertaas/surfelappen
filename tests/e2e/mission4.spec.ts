import { expect, test } from '@playwright/test';
import { expectHeading, expectNoAxeViolations } from './helpers.ts';

test('Hva er egentlig nettet? plays through and opens Agnbua', async ({ page }) => {
  await page.goto('/#/mission/how-the-net-works');
  await expectHeading(page, 'Hva er egentlig nettet?');
  await page.getByRole('button', { name: 'Begynn' }).click();

  // Hvem er hvem? One wrong answer, then the rest right.
  const bins = ['Nettleser', 'Søkemotor', 'Nettsted'];
  await page.getByRole('button', { name: 'Søkemotor', exact: true }).click();
  await expect(page.locator('.feedback')).toBeFocused();
  await expect(page.locator('.feedback')).toContainText('Ikke helt');
  await page.getByRole('button', { name: 'Prøv igjen' }).click();
  for (let i = 0; i < 9; i++) {
    await page.getByRole('button', { name: bins[i % 3] as string, exact: true }).click();
    await expect(page.locator('.feedback')).toContainText('Riktig');
    await page.getByRole('button', { name: 'Neste' }).click();
  }
  await expect(page.getByText('Google er altså ikke internett')).toBeVisible();
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Neste' }).click();

  // Snarveien: search first, then the address bar.
  await page.getByRole('searchbox', { name: 'Søk med Google' }).fill('nrk');
  await page.getByRole('button', { name: 'Søk', exact: true }).click();
  await page.getByRole('button', { name: /NRK – nyheter/ }).click();
  await expect(page.getByText('Du kom fram, på 2 trykk')).toBeVisible();
  await page.getByRole('button', { name: 'Prøv igjen' }).click();
  const bar = page.getByRole('textbox', { name: 'Adresselinje' });
  await bar.fill('nrk');
  await bar.press('Enter');
  await expect(page.getByText('Uten punktum')).toBeVisible();
  await bar.fill('nrk.no');
  await bar.press('Enter');
  await expect(page.getByText('Rett dit. Adresselinja')).toBeVisible();
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Neste' }).click();

  // Les adressen: tap every part, then the answer; three addresses.
  for (const parts of [
    ['https://', 'www.', 'nrk.no', '/sport'],
    ['kari', '@', 'epost.example'],
    ['https://', 'nrk.no.', 'nyheter-gratis.example', '/sport'],
  ]) {
    for (const part of parts) await page.getByRole('button', { name: part, exact: true }).click();
    const answer = parts.find((p) => p.endsWith('.example') || p === 'nrk.no') as string;
    await page.getByRole('button', { name: answer, exact: true }).click();
    await expect(page.locator('.feedback')).toContainText('Riktig');
    await page.getByRole('button', { name: 'Neste' }).click();
  }
  await page.getByRole('button', { name: 'Neste' }).click();

  // Pakken på reise.
  await page.getByRole('button', { name: 'Slå opp nrk.no' }).click();
  await expect(page.getByText('203.0.113.42').first()).toBeVisible();
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.getByRole('button', { name: 'Send igjen' }).click();
  await expect(page.getByText('Pakkene fant en annen vei')).toBeVisible();
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Neste' }).click();

  // Tidsreisen: the film plays on request and pauses; then jump to the end.
  const play = page.getByRole('button', { name: 'Spill av med lyd' });
  await play.click();
  const pause = page.getByRole('button', { name: 'Pause' });
  await expect(pause).toHaveAttribute('aria-pressed', 'true');
  await pause.click();
  await expect(play).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: '2022' }).click();
  await expect(page.getByRole('heading', { name: 'KI for alle' })).toBeVisible();
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: 'Ferdig' }).click();

  const dialog = page.getByRole('dialog', { name: 'Nytt klistremerke' });
  await expect(dialog).toContainText('Nettkjenner');
  await dialog.getByRole('button', { name: 'Fint' }).click();

  await page.goto('/#/town');
  await expect(
    page
      .getByRole('navigation', { name: 'Steder i Lenkevik' })
      .getByRole('link', { name: /Agnbua/ }),
  ).toBeVisible();
});
