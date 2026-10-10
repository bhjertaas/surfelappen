import { execSync } from 'node:child_process';
import preact from '@preact/preset-vite';
import type { Plugin } from 'vite';
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

/** Fills player-facing text in index.html from the nb locale, so it lives only in locale files. */
function localeHtml(): Plugin {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return {
    name: 'surfelappen:locale-html',
    transformIndexHtml: (html) =>
      html
        .replaceAll('%APP_NAME%', escapeHtml(nb.app.name))
        .replaceAll('%APP_DESCRIPTION%', escapeHtml(nb.app.pitch)),
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
  plugins: [preact(), localeHtml(), cspMeta()],
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
