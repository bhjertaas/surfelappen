import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

/** Phone profile from ADR 0009: 360×740 with touch. */
const phone = { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true };

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    locale: 'nb-NO',
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-phone', use: { ...devices['Desktop Chrome'], ...phone } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
    { name: 'webkit-phone', use: { ...devices['Desktop Safari'], ...phone } },
  ],
  webServer: {
    // In CI the build has already run (and passed the size budget) in an earlier step.
    command: process.env.CI
      ? `pnpm exec vite preview --port ${PORT} --strictPort`
      : `pnpm exec vite build && pnpm exec vite preview --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
