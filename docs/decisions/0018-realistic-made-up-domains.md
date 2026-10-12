# 0018 · Realistic made-up domains instead of `.example`

Date: 2026-10-12 · Status: accepted (replaces the `.example` rule in the PRD and CLAUDE.md)

## Context

Every address in the game ended in `.example`, a reserved name that can never reach a real site. Players found it hard to read: `pakkeposten.example.sporing-levering.example` looks like nothing they meet in real life, so the lesson ("the site is right before the first slash") got lost in the strangeness. The owner asked for addresses that look real, e.g. `pakkeposten-no.pakkesporing.ru`.

## Decision

- Content uses realistic made-up domains on real top-level domains: the town's brands on `.no` (`lenkevikbanken.no`, `pakkeposten.no`, `lenkevik-kommune.no`), scam sites on `.ru`, `.com`, `.top`, `.xyz`, `.net`.
- Every one is listed in `src/content/domains.ts` (`FICTIONAL_DOMAINS`). The content tests only allow those, plus a mission's few real teaching domains (`nrk.no`, the search engines, `yr.no`).
- Each domain had no DNS address when added (`getent hosts`). Names that turned out to belong to someone were changed: the bank Fjordbanken became **Lenkevikbanken** (`fjordbanken.no` points at a real bank), the toll company Bomringen became **Lenkevik Bom**, `sporing.ru` became `pakkesporing.ru`.
- Links are never live. In a message, the link is a button: pointing at it shows the address in a status bar (as browsers do), pressing it shows a preview (as a long press does on a phone). QR cases show real QR codes (`scripts/make-qr.ts`) for the made-up addresses, so scanning shows the address and opening it leads nowhere.

## Consequences

- More realistic, and players practise the real moves (point, long-press, read the camera's preview).
- Someone could register one of these domains later. Nothing in the game links to them, and the About page says the addresses are made up. Re-check with `getent hosts` when adding a domain.
