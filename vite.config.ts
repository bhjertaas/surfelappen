import { execSync } from 'node:child_process';
import preact from '@preact/preset-vite';
import type { Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';
import pkg from './package.json' with { type: 'json' };
import { nb } from './src/i18n/locales/nb.ts';

/** Browsers we support (ADR 0010). */
const BUILD_TARGET = ['safari15', 'chrome100', 'edge100', 'firefox100'];

/**
 * Restricts every request to our own origin. Only injected into production builds:
 * the Vite dev server injects inline styles that a strict policy would block.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

function cspMeta(): Plugin {
  return {
    name: 'surfelappen:csp-meta',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
        injectTo: 'head-prepend',
      },
    ],
  };
}

const THEME_COLOR = '#1f6f8b';
const BACKGROUND_COLOR = '#fdf8ec';

/** PWA (ADR 0007): precache everything, wait for the player before activating an update. */
function pwa() {
  return VitePWA({
    registerType: 'prompt',
    injectRegister: null,
    manifest: {
      id: '/',
      name: nb.app.name,
      short_name: nb.app.name,
      description: nb.app.pitch,
      lang: 'nb',
      dir: 'ltr',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: BACKGROUND_COLOR,
      theme_color: THEME_COLOR,
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        {
          src: '/icons/icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      navigateFallback: '/index.html',
      cleanupOutdatedCaches: true,
    },
  });
}

/** Fills player-facing text in index.html from the nb locale, so it lives only in locale files. */
function localeHtml(): Plugin {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return {
    name: 'surfelappen:locale-html',
    transformIndexHtml: (html) =>
      html
        .replaceAll('%APP_NAME%', escapeHtml(nb.app.name))
        .replaceAll('%APP_DESCRIPTION%', escapeHtml(nb.app.pitch))
        .replaceAll('%THEME_COLOR%', THEME_COLOR),
  };
}

function appVersion(): string {
  const sha =
    process.env.GITHUB_SHA?.slice(0, 7) ??
    (() => {
      try {
        return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      } catch {
        return 'dev';
      }
    })();
  return `${pkg.version}+${sha}`;
}

export default defineConfig({
  plugins: [preact(), localeHtml(), cspMeta(), pwa()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion()),
  },
  build: {
    target: BUILD_TARGET,
  },
  test: {
    include: ['src/**/*.test.ts', 'tests/content/**/*.test.ts'],
    environment: 'node',
  },
});
