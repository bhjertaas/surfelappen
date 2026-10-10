# Architecture decisions

One short note per significant decision: context, decision, alternatives, consequences. To change a decision, add a new ADR that supersedes the old one and mark the old one *Superseded by NNNN*. Don't rewrite history.

| # | Decision | Status |
| --- | --- | --- |
| [0001](0001-preact-static-spa.md) | Preact + TypeScript static SPA, no server, no SSR | Accepted |
| [0002](0002-tooling-pnpm-biome.md) | Vite, pnpm on Node, Biome | Accepted |
| [0003](0003-hash-routing.md) | Hash routing; steps replace history; feedback isn't a route | Accepted |
| [0004](0004-content-as-typescript.md) | Content as TypeScript modules; tsc + content tests as schema | Accepted |
| [0005](0005-home-made-i18n.md) | Home-made i18n with Intl and minimal inline markup | Accepted |
| [0006](0006-progress-store.md) | Versioned localStorage progress store behind a backend interface | Accepted |
| [0007](0007-pwa-vite-plugin-pwa.md) | vite-plugin-pwa, generateSW, prompt-to-update | Accepted |
| [0008](0008-hosting-github-pages.md) | GitHub Pages at surfelappen.minhule.eu, GitHub Actions | Accepted |
| [0009](0009-testing-and-ci.md) | Vitest + Playwright (Chromium, WebKit) + axe + size budget | Accepted |
| [0010](0010-browser-support.md) | Safari 15.4+ and 2022-era evergreen browsers | Accepted |
| [0011](0011-art-and-fonts.md) | Pixel-art base sizes/formats; Pixelify Sans + Atkinson Hyperlegible Next | Accepted |
| [0012](0012-licensing.md) | Public repo; MIT code; CC BY-NC-SA 4.0 content and art | Accepted |
| [0013](0013-link-inspect-flow.md) | Lupen reveals, feedback marks; transfer retry then backup | Accepted |
| [0014](0014-typing-input.md) | Typing capture, key/code matching, layout fallback, Caps Lock | Accepted |
| [0015](0015-audience-variants.md) | Audience variants (child/teen/adult): built in now, written later | Accepted |
