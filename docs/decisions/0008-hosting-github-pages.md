# 0008 — GitHub Pages at surfelappen.minhule.eu, GitHub Actions

**Status:** Accepted · 2026-10-10

## Context
Static files only, free, simple. The maintainer already runs `minhule.eu` on GitHub Pages and the repo lives on GitHub. The final product name and domain are still open.

## Decision
- Host on **GitHub Pages** from this repo, at the custom subdomain **`surfelappen.minhule.eu`** (DNS at domene.shop: `CNAME surfelappen → bhjertaas.github.io.`). With Actions-based deploys a `CNAME` file in the build is ignored, so the custom domain is set in the repo's Pages settings (via `gh api`), with *Enforce HTTPS* on. The app lives at the root, so Vite `base: '/'`.
- **Deploy** with GitHub Actions (`actions/deploy-pages`) from `main` only, after all CI checks pass.
- The repo becomes **public** (required for free Pages; see [0012](0012-licensing.md)).

## Alternatives
- **Subpath `minhule.eu/surfelappen/`:** no DNS work, but a later domain move changes the base path and service-worker scope.
- **Scaleway Object Storage:** EU-hosted (a small privacy plus), but custom domain + HTTPS needs paid Edge Services.
- **Cloudflare Pages / Netlify:** fine, but another account and dashboard for no current benefit.

## Consequences
- GitHub (US) serves the files and keeps standard access logs (IP addresses). The About/privacy page says so plainly: the game collects nothing, but the host sees requests like any website.
- No custom headers on Pages: CSP goes in a `<meta>` tag; service-worker update checks bypass the HTTP cache by default, so Pages' `max-age=600` is fine.
- Moving to a new domain later: change the Pages custom domain and DNS, keep the old subdomain redirecting if possible. Note that progress in `localStorage` is per origin and won't follow a domain move unless an export/import exists by then.
