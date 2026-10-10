import { expect, type Page } from '@playwright/test';

/** Helpers for playing Finn bedrageren in tests. */

export const QUESTION = 'Hvilken nettside ville du egentlig kommet til?';

type Action = 'A' | 'B' | 'C' | 'next';

/** The correct answer for every step of a perfect run, in order. */
export const PERFECT_RUN: readonly (readonly [string, Action])[] = [
  ['case-1', 'B'],
  ['case-2', 'A'],
  ['case-3', 'B'],
  ['case-4', 'B'],
  ['case-5', 'B'],
  ['case-6', 'B'],
  ['habit', 'B'],
  ['habit-tip', 'next'],
  ['transfer-intro', 'next'],
  ['transfer-1', 'B'],
  ['transfer-2', 'A'],
];

export async function startMission1(page: Page): Promise<void> {
  await page.goto('/#/mission/find-the-impostor');
  await page.getByRole('button', { name: 'Begynn' }).click();
  await expect(page).toHaveURL(/\/case-1$/);
}

export async function choose(page: Page, letter: 'A' | 'B' | 'C'): Promise<void> {
  await page
    .getByRole('main')
    .getByRole('button', { name: new RegExp(`^${letter} `) })
    .click();
}

export async function next(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Neste' }).click();
}

/** Answers the current step correctly and moves on. */
export async function solve(page: Page, stepId: string, action: Action): Promise<void> {
  await expect(page).toHaveURL(new RegExp(`/${stepId}$`));
  if (action !== 'next') await choose(page, action);
  await next(page);
}

export async function solveAll(
  page: Page,
  steps: readonly (readonly [string, Action])[],
): Promise<void> {
  for (const [step, action] of steps) await solve(page, step, action);
}
