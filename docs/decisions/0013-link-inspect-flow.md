# 0013 — Lupen reveals, feedback marks; transfer retry then backup

**Status:** Accepted · 2026-10-10 · PRD updated to v0.4

## Context
PRD v0.3 had three tensions in Mission 1:
1. The lupen "marks the real site with a text label", which answers each case's question and contradicts the hints ("Lupen viser *sikkerhet-varsel.example* rett før første /"). Real life has no lupen, only long-press or hover.
2. Transfer: "a miss shows the explanation, then one backup item" vs "retry is free; you can't move on until you've chosen the right answer once".
3. "First try" and the summary score weren't defined for hints, transfer or replays.

## Decision
- **Lupen** reveals the full, wrapped address in the body font. It does **not** mark anything.
- **Feedback** on a correct answer shows the address breakdown: subdomain, **real site** (bold + underline + label "Nettstedet") and path. Wrong-answer feedback shows the per-option explanation and "Prøv igjen".
- **Transfer miss:** explanation → retry the same case until right → then its unseen backup (same pattern), also with free retries. Completion needs both transfer patterns solved.
- **Hints** are available everywhere, including transfer.
- **First try** = correct with no hint and no earlier wrong answer. The summary score counts the 6 main cases. *Skarpt øye* = both original transfer cases first try.
- **Bonus stickers** can be earned on any playthrough.
- **Habit scene** is a `choice` step; the tip and transfer intro are `info` steps. No BankID in Mission 1.

## Alternatives
- Scaffolding: marking in early cases, fading out later. More config per case; can be added later if testing shows players are lost.
- Straight to backup after a transfer miss, without a retry.

## Consequences
- The transfer test measures the actual skill, with no tool support beyond what real phones offer.
- `link-inspect/flow.ts` computes the step sequence dynamically (backups inserted when needed) and is unit-tested exhaustively.
