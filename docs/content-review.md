# Reviewing the advice

The game gives safety advice, and advice goes out of date. Every mission with advice is re-checked **once a year**, and before any release that changes its text. Outside material is used only to check the advice, never copied.

## Where things live

| What | Where |
| --- | --- |
| Sources a mission was checked against | `sources` in `src/content/missions/<id>/structure.ts` |
| Date of the last check | `reviewedOn` in the same file (`null` = never checked) |
| The advice itself | `src/content/missions/<id>/text.nb.ts` (intro, feedback, habit scene, takeaway) |
| What players see about it | About page → "Kilder", generated from the two fields above |

## Checklist

For each mission with sources:

1. Read the current guidance from each source (at least [Nettvett.no](https://nettvett.no) from NorSIS and [NSM](https://nsm.no)). Look for the specific topic: links in SMS/e-mail, logging in, what to do after clicking, password managers, contacting the bank.
2. Read the mission's text with that guidance beside you:
   - Does every claim still hold? (E.g. "the padlock only means the connection is encrypted", "go via the app or type the address yourself", "call the bank on the number on your card".)
   - Is anything important now missing, or has the usual advice changed?
   - Are the fictional scenarios still the shapes of scams people actually meet in Norway?
3. Fix the text if needed (follow the tone rules in the PRD), and update the PRD appendix if the change is significant.
4. Set `reviewedOn` to today's date (`'YYYY-MM-DD'`), and update `sources` if you used others.
5. `pnpm check && pnpm test`, then commit with a message like `Review advice in find-the-impostor (2027-10)`.

Missions without advice (e.g. *Ti fingre*) have no sources; the About page says so.

## Before the first release

Both `reviewedOn` fields are still `null`, and the About page says "Ikke kontrollert mot kildene ennå." The first review is part of the release checklist in the PRD's *Done when*.
