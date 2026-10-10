# Accessibility and device pass (phase 6)

Target: practical WCAG 2.2 AA (PRD "Accessibility", ADR 0009). This file is the checklist and the record. Automated results are filled in by the developer; manual results by whoever runs them on a real device.

Test against the live site, **https://surfelappen.minhule.eu**, at the commit named in each result. Before each device run, clear the site's data (or use a private window) so you start as a new player.

Mark each line `✅` (works), `⚠️` (works but awkward; describe) or `❌` (blocks a player; describe). Anything `❌` must be fixed before phase 6 is done.

## 1. Automated (done in CI on every push)

| Check | Where | Result |
| --- | --- | --- |
| axe (WCAG 2.0/2.1/2.2 A + AA) on every screen | `accessibility.spec.ts` | ✅ |
| axe in every mission state: lupen, hints, wrong and right feedback, Les mer, habit, info, summary; typing with wrong key, Caps Lock, layout hint, positional mode | `mission1.spec.ts`, `mission2.spec.ts` | ✅ |
| axe with dialogs open: sticker celebration, reset confirmation; storage note; "needs a keyboard" note | `passport.spec.ts`, `a11y-pass.spec.ts`, `accessibility.spec.ts` | ✅ |
| No horizontal scroll at 320 px and with text at 200 %: every screen, plus a link case with all panels open and a typing step with hints | `reflow.spec.ts`, `a11y-pass.spec.ts` | ✅ |
| Touch targets ≥ 44 px on every screen and in mission states (links inside sentences exempt) | `a11y-pass.spec.ts` | ✅ after fix (see below) |
| Keyboard only: a case answered with Tab/Enter, focus to feedback, then to the next step's `<h1>` | `mission1.spec.ts` | ✅ |
| Focus moves to `<h1>` on route change; to the feedback when it appears; back after dialogs | `navigation.spec.ts`, `mission1.spec.ts`, `passport.spec.ts` | ✅ |
| Forced colours (Windows high contrast, Chromium emulation): focus outline stays; wrong answer marked by text | `a11y-pass.spec.ts` | ✅ |
| Reduced motion: nothing animates or transitions | `a11y-pass.spec.ts`, `passport.spec.ts` | ✅ |
| Offline after first visit; update bar only reloads on request | `pwa.spec.ts` | ✅ |

**Lighthouse (mobile, 2026-10-10, local production build, Lighthouse 12):**

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Start | 99 | 100 | 100 | 100* |
| Town | 100 | 100 | 100 | 100* |
| Case 1 | 99 | 100 | 100 | 100* |

\* 91 before `public/robots.txt` was added; that was the only failing audit.

**Fixed in this pass:**
- The source links on the About page and the "source code" link were 24 px tall. Links that stand alone now get a 44 px target.

## 2. Manual: keyboard only (desktop browser, no mouse)

Use Chrome, Edge or Firefox on Windows/macOS/Linux. Put the mouse away.

- [ ] Start → Tab reaches "Start", Enter goes to the town. Focus lands on the heading (nothing visibly focused is fine; the next Tab goes to the first control).
- [ ] Focus is always visible: a thick red-brown outline on every button and link.
- [ ] Town: every building is reachable in the list; closed buildings show their "kommer snart" text; the passport building opens the passport.
- [ ] Finn bedrageren: play all 11 steps. Lupen, both hints, a wrong answer, "Prøv igjen", "Les mer" all work with Tab, Enter and Space.
- [ ] After answering, focus is on the feedback, and the next Tab goes into it (Les mer), then "Neste".
- [ ] The sticker dialog: focus is inside it; Escape closes it; focus comes back to where it was.
- [ ] Ti fingre: after "Begynn", typing works at once without clicking. Shift+Tab out and Tab back in, typing still works.
- [ ] Passport → "Nullstill fremgang": focus starts on "Avbryt"; Escape cancels; "Ja, slett alt" clears it.
- [ ] Browser back from inside a mission goes to the town, not to the previous case.

## 3. Manual: screen readers

For each screen reader, run the **script** below and note anything confusing. Don't aim to check every line under every reader; the starred (★) steps matter most.

**Script**
1. ★ Start page: the page title and `<h1>` "Surfelappen" are read; the two-sentence pitch is read; "Start" is a link.
2. Town: the heading "Lenkevik" is read on arrival. The picture is described as one image ("Bilde av Lenkevik"), not a pile of shapes. The list of places reads name, one-line description and "Kommer snart"/"Trenger tastatur" where relevant.
3. Choose Torget (closed): the "ikke klart ennå" message is read without moving focus.
4. ★ Finn bedrageren, case 1: the situation, sender, message and the link text are read in that order. "Bruk lupen" reveals the real address, and you can read it.
5. ★ Choose a wrong answer: the reader moves to and reads "Ikke helt" plus the explanation, and it's clear which answer the explanation is about. "Prøv igjen" takes you back to the question.
6. ★ "Vis et hint": the hint is read out without you moving there.
7. Choose the right answer, read "Slik leser du adressen": the breakdown makes sense spoken (the site is called out as text, not just highlighted).
8. ★ "Neste": the new step's heading is read; you are at the top of the new step, not left at the bottom.
9. Finish the mission: the sticker dialog is announced as a dialog with its title; closing it returns you to the summary.
10. ★ Ti fingre (with a hardware keyboard): "Begynn" lands in the "Skriv her" field and the next key and finger are read ("Neste tast: f, med venstre pekefinger"). Type a right key, then a wrong one: the wrong-key message is read. **Watch for:** the reader intercepting letters (quick navigation), or announcing "blank"/"tom" on every key so the instructions drown.
11. Passport: each sticker is read with its name, earned/not earned, and how to earn it.
12. About: headings let you jump between sections (H key in NVDA/VoiceOver rotor).

| Reader | Device / OS / browser | Tester | Commit | Result |
| --- | --- | --- | --- | --- |
| VoiceOver | iPhone, iOS __, Safari | | | |
| VoiceOver | Mac, macOS __, Safari | | | |
| TalkBack | Android __, Chrome | | | |
| NVDA __ | Windows __, Firefox or Chrome | | | |

Notes per reader (step number + what happened):

- VoiceOver iOS:
- VoiceOver macOS:
- TalkBack:
- NVDA:

## 4. Manual: devices and settings

- [ ] **Small phone (≈ 320–375 px):** whole game playable in portrait; nothing cut off; no sideways scrolling; buttons easy to hit with a thumb.
- [ ] **Phone in landscape:** still usable (no content hidden behind the browser bar).
- [ ] **Text size at maximum** (iOS: Settings → Accessibility → Display & Text Size → Larger Text; Android: Font size; desktop: browser zoom 200 %): readable, nothing overlaps.
- [ ] **Reduce motion on** (iOS/macOS: Accessibility → Motion; Android: Remove animations; Windows: Show animations off): the sticker dialog appears without zooming.
- [ ] **Dark mode on:** the game stays light (it's designed light-only) and every text is still readable.
- [ ] **Windows high contrast / Contrast themes:** buttons, focus and the "Riktig svar / Ikke helt" headings are visible.
- [ ] **Install to home screen** (iOS Safari: Share → Add to Home Screen; Android Chrome: Install): opens full screen with the right name and icon; works in flight mode afterwards.
- [ ] **iPadOS 15** (if available): plays through Mission 1; Ti fingre with a hardware keyboard.
- [ ] **Physical Norwegian keyboard:** play Ti fingre start to finish. Æ and Ø work without any layout hint; a few deliberate mistakes are counted; Caps Lock shows its note.
- [ ] **Non-Norwegian keyboard** (e.g. US layout): the layout hint appears at the first Ø; "Fortsett med dette tastaturet" lets you finish.

## 5. Results and follow-ups

| # | Found by | Severity | Description | Status |
| --- | --- | --- | --- | --- |
| 1 | Automated (target size) | ⚠️ | Standalone links on About were 24 px tall | Fixed |
| 2 | Owner, keyboard run | ⚠️ | Ti fingre showed the next key and messages in capitals ("Neste tast: D") while the line is lower case, which suggested holding Shift | Fixed (`fe94a3b`) |
