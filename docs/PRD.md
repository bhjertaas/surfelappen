# Surfelappen — PRD v0.4

Oct 10, 2026 · @Benny

*v0.4: decisions from the first technical session (lupen, transfer flow, back button, typing layout and Caps Lock, Stø hånd, buildings, focus handling, resume). See `docs/architecture.md` and `docs/decisions/`.*

## Summary

**Surfelappen** (working title; English: *License to Surf*) is a small, free, browser-based game that teaches practical online safety through short missions in a cute pixel-art town. It is made for Norway, in Norwegian first, with optional English.

The MVP is one town screen, two missions (*Finn bedrageren* on links, and *Ti fingre* on touch typing), a sticker passport that remembers progress between visits, and an installable PWA that works on phones and computers. It is a static site with no backend and no tracking. If people enjoy it and learn from it, more missions follow.

The name plays on *lappen*, Norwegian slang for a driving licence: you earn your "surfing licence" one stamp at a time.

## Goals and non-goals

**Goals**

1. **Practical skill, not trivia.** After a mission, the player can handle a *new* real situation, not just repeat the answers they saw.
2. **Fun enough to finish.** Short missions, charming art, gentle humour, small rewards.
3. **Safe to fail.** Mistakes are free, explained kindly, and never cost progress.
4. **Works for people with little confidence.** Plain Norwegian, no time pressure, usable with a helper beside them.
5. **Respect the player.** No data collection, no manipulation, no pressure to come back.
6. **Cheap and easy to keep alive.** Static hosting, few dependencies, content that one person can update.

**Non-goals** (things this must not turn into, even later)

- Corporate security-compliance training, or a replacement for professional help.
- An official qualification. The certificate is informal and says so.
- A course covering everything about computers.
- A place where real users chat, share or compete.
- A phishing simulator that sends real deceptive messages, or anything that touches real websites or accounts.
- An engagement machine: no streaks, daily rewards, push notifications or leaderboards.
- A copy of other people's lessons, games or art.

## Audience and context

**Primary persona:** an adult in Norway who uses BankID, Vipps, NAV, Altinn and parcel tracking, but feels unsure when an SMS or email asks them to click and log in. Often 50+, but not necessarily. They are not beginners at everything; they just haven't learned this particular skill.

**Secondary:** teenagers and confident users who want a quick, fun challenge. They should not feel excluded, but the MVP is designed and tested for the primary persona.

**Why Norway-specific matters:** the scams people actually meet here are fake parcel notices, fake bank and BankID logins, and fake messages from NAV or Skatteetaten. Scenarios should feel familiar, using fictional lookalikes rather than real brands.

**Likely channels:** libraries, senior digital-help programmes (e.g. Seniornett), adult-education courses, and friends and family sharing a link. A mission should therefore work well with a helper sitting beside the player, and fit inside a short session.

## MVP scope

One polished mission beats five thin ones. Everything below "Later" waits until the first mission has been tried on real people.

|  | Items |
| --- | --- |
| **MVP** | Start screen · town screen with 4–5 locations (two open, the rest marked "kommer snart") · list navigation · missions *Finn bedrageren* and *Ti fingre* · sticker passport · progress saved locally, resumable mid-mission · reset progress · installable PWA, works offline · mobile-first, also desktop · Norwegian (bokmål) · i18n structure ready for English · about/privacy page |
| **Later** | Audience variants: the player may say whether they are a child, a teenager or an adult (optional, never required, stored with progress; no age asked). This changes wording and the order missions are suggested in, never hides content; children will likely need their own missions rather than reworded ones · English translation · more missions (SMS/BankID scams, passwords, sharing, checking claims, more typing lessons) · printable certificate after 3+ missions · export/import progress code to move between devices · optional user accounts, e.g. for classes (needs its own privacy review) · nynorsk |
| **Never** | Leaderboards, streaks, push notifications · chat or user content · real brands or live websites · storing or sending anything the player types |

## Experience

The player arrives in **Lenkevik**, a small pixel-art coastal town, picks a building, and plays a 3–5 minute mission. Cute and warm, gently funny, never childish or scary.

**Town screen.** One static illustration with five clickable buildings: *Postkontoret* (messages and scams), *Tastaturhallen* (touch typing), *Torget* (sharing, kommer snart), *Biblioteket* (checking claims, kommer snart) and *Lappekontoret*, which opens the passport (the passport button is a shortcut to the same place). *Nettkaféen* is a scene inside Mission 1, not a building. Every building is a real button with a text label. The same list is shown below or beside the picture, so nobody needs to hunt for hotspots. On small screens the list comes first and the picture scales down.

**Mission loop:**

1. A townsperson brings a problem ("I got this message, is it real?").
2. The player inspects it with a tool, e.g. **lupen** (the magnifying glass).
3. The player chooses what it is and what to do.
4. Short feedback explains *why*, never just right/wrong.
5. A new, unseen case checks the skill transfers.
6. A stamp lands in the passport.

**Tone rules:** mistakes are free and explained kindly; no timers; hints always available; no fear-mongering or blaming victims; jokes are about scammers, never about people who are new to this.

**Register (v0.4):** written for adults. Characters are neighbours with first names and a place ("Hanne på postkontoret", "Kai i Tastaturhallen"), not titles like "Postmester". Few exclamation marks; explain rather than cheer. The feedback heading already says *Riktig svar* / *Ikke helt*, so feedback text starts with the explanation, not "Riktig!" or "Lurt forsøk!". Scam messages inside cases may of course shout.

## Screens and states

Eight screens cover the MVP. Each has its own URL so the browser back button, refresh and shared links all work on static hosting. Feedback is a state of the Mission step screen, not a separate URL, so the back button never lands on stale feedback. Inside a mission, moving to the next step replaces the history entry: the back button leaves the mission (to its intro, then the town) instead of stepping back through answered cases.

| Screen | Purpose | Contains |
| --- | --- | --- |
| Start | First impression, explain the idea in one breath | Title, one-sentence pitch, "Start" / "Fortsett" (if progress exists), link to About |
| Town | Choose where to go | Town picture with labelled buildings + the same list in text; sticker count; passport button |
| Mission intro | Set the scene | Character, the problem in 1–3 sentences, what you'll learn, "Begynn" and "Tilbake til byen" |
| Mission step | Play | The case or drill, the tool (lupen / keyboard), the choices, hint button, progress ("Sak 3 av 6"), exit |
| Feedback | Explain | Result, why, the parsed link or typed line, "Neste" / "Prøv igjen" |
| Mission summary | Wrap up | The one takeaway, first-try result (private), sticker earned, "Til passet" / "Til byen" |
| Passport | Show progress | Sticker album with earned and empty slots (and how to earn them), "Nullstill fremgang" |
| About / privacy | Trust | What this is, that it stores nothing outside the device, sources checked, credits, version |

**States every screen must handle:**

- **First visit vs returning:** Start shows "Fortsett der du slapp" only when a mission has been started. It goes to the most recently played unfinished mission, at its first unfinished step; if every mission is finished, it goes to the town.
- **Locked / coming soon:** buildings without a mission say "Kommer snart" in text and look intentionally closed (shutters, sign), never broken. Selecting one shows a friendly line, not an error.
- **Needs keyboard:** *Tastaturhallen* on touch-only devices (see Mission 2).
- **Storage unavailable:** a small, dismissible note that progress won't be saved; everything else works.
- **Offline:** works fully once installed or cached; no error if offline.
- **Update available:** a small "Ny versjon – last inn på nytt" bar; never reloads by itself mid-mission.
- **Something went wrong:** a plain-language error page with "Tilbake til byen", never a blank screen or stack trace.
- **Mid-mission exit:** leaving asks nothing and loses nothing beyond the current unfinished case.

## Feedback and hints

Feedback teaches; it never just says right or wrong.

- **Every option has its own feedback.** A wrong answer explains why that answer was tempting and what to look at instead. Example: not "Feil!", but "Navnet *pakkeposten* står i adressen, men det er bare en del av et lengre navn. Se på slutten av adressen før første skråstrek."
- **Right answers are explained too**, briefly, so a lucky guess still teaches.
- **Two hint levels per case.** Hint 1 points at where to look ("Se på delen rett før første /"). Hint 2 nearly gives it away. Hints are always available, including in the transfer test, and never reduce the reward, except that a case answered after a hint doesn't count as "first try". *First try* means answered correctly with no hint and no earlier wrong answer.
- **Retry is free.** After wrong feedback, the player tries the same case again. They can't move on until they've chosen the right answer once, so they always see the correct reasoning.
- **Honest about grey areas.** When something is genuinely uncertain (a real bank link in an unexpected email), the feedback says so and gives the safer habit rather than pretending there's a single truth.
- **Short.** Feedback is at most 3 sentences on screen. A "Les mer" expander can hold more.
- **Consistent words.** Use the same terms everywhere: *adresse* (URL), *nettstedet* (registrable domain, "the real site"), *vertsnavn* only in "Les mer". Avoid jargon in main text.

## Mission 1: Finn bedrageren

**Goal:** the player can find which website a link really leads to, and knows the safer habit: don't log in from a link, go via the app or a bookmark instead.

**Setting:** Postkontoret. Townspeople bring messages they've received: SMS, email, a QR poster. The player uses **lupen** on each link. Lupen reveals the full address the link really goes to, as the player would see it by long-pressing or hovering in real life. It does *not* point out the real site: finding it is the skill being taught. The feedback then shows the parsed address with the hostname and the real site marked by bold, underline and a text label (not colour alone).

**Fictional real sites:** `fjordbanken.example` (bank), `pakkeposten.example` (parcels), `lenkevik-kommune.example` (municipality). All domains use the reserved `.example` TLD, so nothing can ever resolve to a real site.

**Each case asks one question:** *"Hvilken nettside ville du egentlig kommet til?"* with three options. Feedback shows the parsed address and one sentence on the trick.

| # | Context | Link (what lupen reveals) | Real site | Verdict | Teaches |
| --- | --- | --- | --- | --- | --- |
| 1 | SMS: "Pakken din venter" | `https://pakkeposten.example.sporing-levering.example/pakke/7731` | `sporing-levering.example` | Impostor | Familiar name as a subdomain; padlock/HTTPS doesn't prove honesty |
| 2 | Email from the bank | `https://nettbank.fjordbanken.example/logg-inn` | `fjordbanken.example` | Genuine | Subdomains of the real domain are fine; not everything is a scam |
| 3 | Email: "Kundeservice" | `https://fjordbanken-kundeservice.example/` | `fjordbanken-kundeservice.example` | Impostor | A brand name inside a different domain |
| 4 | Social post: "Du har vunnet!" | `https://premie-trekning.example/fjordbanken.example/vinner` | `premie-trekning.example` | Impostor | Brand name in the path |
| 5 | Email link text says `fjordbanken.example/sikkerhet` | `https://sikkerhet-varsel.example/fjordbanken` | `sikkerhet-varsel.example` | Impostor | Link text is not the destination; inspect before you tap |
| 6 | SMS from "the municipality" | `https://lenkevik-kornmune.example/faktura` | `lenkevik-kornmune.example` | Impostor | Lookalike letters (rn vs m) |

**Habit scene (after case 6):** the bank email in case 2 was genuine, but the player is asked what to do anyway. Best answer: open the bank app or type the address yourself. Also covered in one screen: if your password manager won't autofill, be suspicious; if you already entered details, call the bank using the number on your card and change your password.

**Transfer test:** two unseen cases in a new context (a QR parking sign at Nettkaféen): one impostor (`https://betal.lenkevik-kommune.example.parkering-app.example/`) and one genuine (`https://parkering.lenkevik-kommune.example/betal`). A miss shows the explanation and the player retries that case (free, like everywhere else); once it is right, one unseen backup case of the same pattern follows, also with free retries.

**Completion:** all six cases answered (retries free), the habit scene answered, and both transfer patterns answered correctly (retries free; a missed transfer case also needs its backup answered). The end screen shows privately how many of the six main cases were right on the first try. Sticker: *"Lenkedetektiv"*.

**Deliberately left out:** BankID (saved for *BankID-fella*), the `user@host` trick (modern browsers warn about or block it), homoglyph/punycode domains and full URL anatomy. Possible later bonus content.

## Mission 2: Ti fingre

**Goal:** the player places their fingers on the home row of a Norwegian keyboard and types simple words without looking at the keys.

**Setting:** Tastaturhallen, a small arcade. An on-screen keyboard shows which finger presses which key. The F and J bumps are explained as "the way home".

**Steps (about 5 minutes):**

1. Posture and finger placement on `A S D F` and `J K L Ø`, thumbs on space.
2. Single keys from the home row, one finger at a time.
3. Reaching sideways for `G`, `H` and `Æ`.
4. Short home-row words: *da, ha, sal, dag, lag, glad, hall, skall*.
5. Final line: a few of those words in a row.

**Feedback:** the next character is shown large and announced to screen readers. A wrong key is marked with a symbol and a label, not just colour, and the player simply tries again. Accuracy is shown as a percentage. Speed may be shown as information, but there is never a timer or a time limit. Until a lesson teaches capitals, Caps Lock is forgiven: letters match regardless of case and a small "Caps Lock er på" note explains why the letters look big.

**Completion:** the final line typed with at least 90% accuracy (retries free). Sticker: *"Ti fingre"*.

**Devices:** touch typing needs a physical keyboard. On a phone or tablet the building stays visible but says "Trenger tastatur" and explains why; the player can still start it if they have a keyboard connected. This doesn't block any other mission.

**Later lessons:** top row, bottom row, `Å`, capitals, punctuation, and short sentences. Each lesson gives its own sticker.

## Progress, stickers, devices, language, accessibility, privacy

**Progress.** Saved in `localStorage` after every finished case or typing step, so a player can stop at any point and pick up later ("Fortsett der du slapp"). The saved data is small, versioned JSON, so it can later be exported to a code, moved to another device, or imported into an account if accounts ever arrive. If storage is unavailable, the game still plays; progress just isn't kept. A visible "Nullstill" button clears everything.

**Stickers.** The passport is a sticker album. Every completed mission gives a sticker (*Lenkedetektiv*, *Ti fingre*). A few bonus stickers reward care and curiosity, never speed or daily return:

| Sticker | Earned by |
| --- | --- |
| Skarpt øye | Both transfer cases in *Finn bedrageren* right on the first try |
| Stø hånd | The final line in *Ti fingre* typed with no mistakes |
| Nysgjerrig | Visiting every building in town, open or not |

Bonus stickers can be earned on any playthrough, including replays. New stickers get a small, skippable celebration (respecting reduced motion). Empty slots show which stickers exist and how to earn them, so nothing is hidden. A printable *Surfelapp* certificate comes once there are 3+ missions.

**Devices.** Mobile-first: works from 320 px wide phones up to desktop browsers, with touch, mouse and keyboard. Touch targets are at least 44 px. The town picture scales; nothing needs pinch-zoom or horizontal scrolling. Installable as a PWA and playable offline once loaded.

**Language.** Norwegian bokmål is the default and the only language at launch. All player-facing text lives in locale files from day one, so English is a translation job, not a refactor. A language switch appears only when English exists. Mission content (cases, options, feedback) is localised too, not just UI labels.

**Accessibility (practical WCAG 2.2 AA):**

- Every interactive thing is a native button or link, reachable by keyboard, with visible focus.
- Feedback is announced to screen readers (live region).
- Pixel art is decoration; all information is also in text.
- Highlighting never relies on colour alone.
- Text scales to 200% and reflows on a 320 px wide screen.
- No timers, no flashing; respects reduced-motion.
- Plain Norwegian, short sentences, technical words explained once (*domene*, *adresse*).

**Privacy.** No accounts, no cookies, no analytics, no third-party scripts or fonts loaded from other servers. Keystrokes in *Ti fingre* are checked in the browser and then discarded; only the sticker and best accuracy are saved. With nothing collected, there is no consent banner and no data-protection burden beyond a short privacy note. Adding accounts later would change that, which is why they need their own review.

## Functional requirements

Each requirement is MVP unless marked. Acceptance criteria are written to be testable; use them as the basis for automated and manual tests.

### FR-01 Start

- No account, sign-up or personal question before play.
- A first-time player understands what the game is from the Start screen without reading more than \~30 words.
- "Fortsett" appears only if a mission has been started, and goes to the first unfinished step of the most recently played unfinished mission (or the town if all are finished).

### FR-02 Town and navigation

- Every building is a focusable, labelled control (a link for open destinations, a button for "kommer snart"); the text list contains exactly the same destinations in the same order.
- Open, coming-soon and needs-keyboard buildings are distinguishable by text label, not only by look.
- Every screen has a visible way back to the town; the browser back button works everywhere. Inside a mission, back leaves the mission rather than returning to an answered case.
- A deep link to a mission step other than the player's current one goes to their current step instead (or to the summary, if the mission is finished).
- Deep links to a mission work after refresh on static hosting.

### FR-03 Generic mission flow

- Flow: intro → steps → summary. Progress ("3 av 6") is visible during steps.
- The player can request hints, retry without penalty, exit at any time and restart a mission from its intro.
- No drag-and-drop, no time limits, no input that requires precise pointer movement.
- When feedback appears, focus moves to it, which makes screen readers read it once. Live regions are used only where focus does not move (typing prompts, sticker earned, update bar, storage note), so nothing is announced twice.

### FR-04 Finn bedrageren

- Six cases, habit scene and transfer test as specified in Mission 1 and Appendix A.
- "Bruk lupen" is a button. It reveals the full address and wraps long addresses instead of cutting them off. It does not mark the real site; the feedback does, with bold, underline and a text label.
- Addresses are shown in the same proportional font as the message text, as on a real phone (a monospace font would give away the *rn*/*m* trick).
- Each case offers exactly three options in a fixed order (no shuffling between retries, so a helper can say "press the second one").
- The transfer test uses cases the player has not seen. If a transfer case is missed, the player retries it after the explanation, and then gets a backup case of the same pattern.
- Completion as specified; awards *Lenkedetektiv* and, if earned, *Skarpt øye*.

### FR-05 Ti fingre

- Five steps as specified in Mission 2 and Appendix B; each drill uses only keys already taught.
- Correct keystrokes advance; a wrong key shows which key was expected and which finger, then waits. Backspace is not needed.
- Accuracy = correct keystrokes ÷ total keystrokes on the final line, shown as a whole percent.
- Works with the Norwegian keyboard layout, including Ø and Æ. If the player types characters that suggest another layout (e.g. `;` where `Ø` was expected), these keystrokes are not counted as errors; after three of them, show a hint about keyboard layout. If the player chooses to continue, the drill matches keys by physical position (`KeyboardEvent.code`) so they can still finish.
- Until capitals are taught, letters match regardless of case; when Caps Lock is on, a small note says so.
- On touch-only devices, show the "Trenger tastatur" explanation with an option to start anyway.
- Completion as specified; awards *Ti fingre* and, if earned, *Stø hånd*.

### FR-06 Progress and resume

- Progress is saved after each finished case or step, and when a sticker is earned.
- After closing the tab and reopening, the player resumes at the start of the first unfinished case or step.
- Completed missions can be replayed; replaying never removes a sticker.
- "Nullstill fremgang" asks for confirmation and then clears all saved data.
- Nothing is sent to any server.

### FR-07 Stickers and passport

- Every sticker has an ID, name, picture, and "how to earn" text.
- Earning a sticker shows a short celebration that can be skipped and respects reduced motion; it is announced to screen readers.
- The passport shows all stickers that exist in the current release, earned or not.

### FR-08 Language

- All player-facing text comes from locale files; no hard-coded strings in components.
- `nb` is the default. Adding `en` requires only new locale and content files, no component changes.
- The `lang` attribute on the page matches the active language.
- *Later:* a language switch on Start and About, remembered locally.

### FR-09 Installable and offline

- Passes the browser's installability checks (manifest, icons, service worker).
- After the first visit, the whole game including both missions works with the network off.
- A new deployment is picked up on the next visit, with the update bar; no mixed old/new assets.

### FR-10 About and privacy

- States in plain Norwegian what is stored (progress, on this device only), how to delete it, and that nothing is collected.
- Lists the sources the advice was checked against, the review date, and art credits.
- States that the certificate and stickers are informal and not a qualification.

### FR-11 Content extensibility

- Adding a third mission that reuses an existing interaction type means adding content and locale files plus registering a building, with no changes to existing missions.
- Content files are validated at build time against a schema; invalid content fails the build with a clear message.

## Content model

Each mission is split into **structure** (IDs, URLs, correct answers, sticker rules; shared by all languages) and **text** (one file per language). This keeps answers identical across translations, and a translator never touches logic. Exact file formats and types are Claude Code's call; these are the fields that must exist. IDs and URL slugs are English, like all code (e.g. mission `find-the-impostor`, step `case-1`, sticker `link-detective`); the full list is in `docs/architecture.md`.

**Mission:** `id`, `building`, `interaction` (`link-inspect` | `typing`), `requires` (e.g. `physical-keyboard`), `steps[]`, `stickers[]`, `reviewedOn` date (`null` until the advice has been checked for the first time), `sources[]`. The completion rule is defined by the interaction type (all steps solved; for typing, the final step's `minAccuracy`), not repeated per mission.

**Link-inspect steps** are of three kinds: `case` (below), `choice` (the habit scene: three options, one correct, per-option feedback) and `info` (a single text screen, e.g. the habit tip and the transfer intro).

**Link case (`link-inspect`):** `id`, `context` (`sms` | `email` | `social` | `qr` | `browser`), `linkText` (what the message shows, may differ from the URL), `url`, `expectedHost`, `expectedSite`, `verdict` (`genuine` | `impostor`), `options[3]` each with `id` and `correct`, `pattern` (e.g. `subdomain-trick`, `brand-in-path`, `lookalike-letters`), `role` (`main` | `transfer` | `transfer-backup`), `backupFor` (on a backup: the transfer case it replaces), optional `claimedSite` (the site the message pretends to come from; used by content tests and the feedback breakdown).

**Typing step (`typing`):** `id`, `keysTaught[]`, `keysAllowed[]`, `drills[]` (one or more target lines), `minAccuracy` (only on the final step).

**Sticker:** `id`, `image`, `awardedBy` (mission completion or a named condition such as `transfer-first-try`, `final-line-flawless` or `visited-all-buildings`).

**Text file (per language):** intro lines, each case's situation line ("Bjørn har fått en SMS."), sender (e.g. *Lenkevik kommune*, which a translation may change) and message body (the link is shown after it from the structure's `linkText`), option labels, per-option feedback, `hint1`, `hint2`, `lesMer`, summary takeaway, sticker names and "how to earn" text.

Example structure for case 1:

```json
{
  "id": "case-1",
  "role": "main",
  "context": "sms",
  "linkText": "https://pakkeposten.example.sporing-levering.example/pakke/7731",
  "url": "https://pakkeposten.example.sporing-levering.example/pakke/7731",
  "expectedHost": "pakkeposten.example.sporing-levering.example",
  "expectedSite": "sporing-levering.example",
  "verdict": "impostor",
  "pattern": "subdomain-trick",
  "options": [
    { "id": "a", "correct": false },
    { "id": "b", "correct": true },
    { "id": "c", "correct": false }
  ]
}
```

The content tests (see Implementation constraints) check `expectedHost` and `expectedSite` against the real parser, so a typo in a URL fails the build.

## Implementation constraints

These are constraints, not an architecture; ask Claude Code to propose one within them.

- **Static site.** Builds to plain files, hostable free (e.g. GitHub Pages, Cloudflare Pages, Netlify). No server code.
- **PWA.** Web app manifest, icons, and a service worker that precaches all assets so the game works offline. When a new version is deployed, show a gentle "Ny versjon – last inn på nytt" prompt rather than silently mixing versions.
- **Plain web UI, no game engine.** Semantic HTML components; pixel art as PNG/SVG with `image-rendering: pixelated`. Mobile-first CSS. Small dependency list.
- **Content as data.** Each mission is a typed data file (cases or steps, options, correct answers, feedback, hints, stickers) with stable IDs, separate from components. Text references locale keys or is stored per locale.
- **Two interactions** for the MVP: "inspect link → choose one of three" and "type the target text". Don't build a generic engine for interactions that don't exist yet.
- **Progress store.** One small module owns saved progress: versioned schema, migration on version change, and a clear boundary so it could later sync to an account without touching mission code.
- **Typing input.** Use `KeyboardEvent.code` for physical key position (finger hints, and matching after the player accepts the layout hint) and `KeyboardEvent.key` for the character, so the Norwegian layout and later other layouts work. Ignore modifier and IME composition events sensibly.
- **Content tests in CI.** For every link case, parse the URL with the standard `URL` API and a Public Suffix List library (e.g. `tldts`) and assert the hostname and real site stated in the content. Also assert every domain ends in `.example`, every typing drill uses only the keys its lesson has taught, and every locale has every key.
- **Accessibility checks:** automated axe checks on each screen, plus a manual keyboard and screen-reader pass (VoiceOver/NVDA/TalkBack) before release.
- **Performance:** whole app under \~1 MB on first load; works on a mid-range phone on 4G.

## Build order and notes for Claude Code

Build in thin, playable slices. Each phase ends with something that runs and can be clicked through.

1. **Skeleton.** Project setup, linting, test runner, CI, static deploy of a "hello" page. Content schema and the URL content tests, running on Appendix A's structure data.
2. **Shell.** Routing for all eight screens, locale loading (`nb`), progress store, PWA manifest and service worker, town screen with placeholder art and the text list.
3. **Mission 1.** The `link-inspect` interaction, lupen, feedback, hints, retry, transfer with backup, summary, stickers. Playable end to end with placeholder art.
4. **Mission 2.** The `typing` interaction, on-screen keyboard, layout hint, touch-only notice, accuracy, stickers.
5. **Passport and polish.** Sticker album, celebration, reset, About/privacy page, update bar, error page.
6. **Accessibility and device pass.** axe on every screen, keyboard-only run, VoiceOver (iOS/macOS), TalkBack, NVDA; 320 px, 200% zoom, reduced motion.
7. **Art swap.** Replace placeholders with final pixel art without code changes beyond asset paths.

**Conventions**

- Code, comments, commit messages and docs in English. Everything the player sees is Norwegian, and only in locale/content files.
- Placeholder art is obviously placeholder (simple shapes, labelled), sized like the final assets.
- Prefer the platform (native buttons, `<dialog>`, CSS) over libraries. Ask before adding any runtime dependency.
- No analytics, error-reporting services or external fonts/CDNs, even "just for development".
- If this PRD is unclear or contradicts itself, ask rather than guess. If an implementation choice changes behaviour described here, update this PRD in the same change.

**Docs to write alongside the code**

- `README.md`: what it is, how to run, test, build and deploy.
- `docs/adding-a-mission.md`: step by step, including content tests and translation.
- `docs/content-review.md`: how to re-check advice yearly, and where `reviewedOn` and sources live.
- `docs/decisions/`: one short note per significant architecture decision.

## Content accuracy and sources

All text, art and scenarios are original. Outside material is used only to check that the advice is right, never copied.

- **Advice reference:** check the takeaway and "what to do if you clicked" against current guidance from [Nettvett.no](https://nettvett.no) (NorSIS) and [NSM](https://nsm.no) before release.
- **Review date:** each mission file records the date its advice was last checked. Re-check yearly.
- **Brands:** fictional only (Fjordbanken, Pakkeposten, Lenkevik kommune). Recognisable *shapes* of real scams, never real logos or names.
- **Credits page:** lists the sources checked and the art credits.

The mission's URLs have already been verified with a WHATWG URL parser and `tldts`; all ten (including the transfer backups in Appendix A) resolve to the real site stated.

## Roadmap

Not built in the MVP, but listed so the architecture doesn't paint itself into a corner. Order follows what Norwegian users most often run into. Each new mission is added only after the previous ones have been tried on real people.

| Location | Mission idea | Teaches | Likely interaction type |
| --- | --- | --- | --- |
| Postkontoret | *Innboksen* | Spotting fake SMS/emails: sender, urgency, request, link; what to do after clicking | Inbox list → open message → mark as safe/suspicious + choose action |
| Postkontoret | *BankID-fella* | Never approve a BankID or Vipps request you didn't start; phone-call scams | Short branching dialogue with choices |
| Låsesmeden (new) | *Nøkkelknippet* | Long unique passwords, password managers, two-step login, passkeys | Sort / choose (no drag-and-drop) + short quiz |
| Torget | *Før du deler* | What a photo, location or screenshot reveals; privacy settings' limits | Inspect an image for clues (hotspots with list alternative) |
| Torget | *Gruppechatten* | Responding to bullying, pressure or unwanted contact; how to get help | Branching dialogue |
| Biblioteket | *Sjekk påstanden* | Claim vs evidence, who published it, finding the original, AI-made images | Compare sources, choose verdict + reason |
| Tastaturhallen | *Ti fingre 2–4* | Top row, bottom row, Å, capitals, punctuation, sentences | `typing` (exists) |
| Lappekontoret | *Sluttprøven* | Mixed review across missions; unlocks the printable *Surfelapp* | Mix of existing interaction types |

The content model should therefore allow **new interaction types** to be added as separate modules (dialogue, inbox, image inspection) without changing existing ones.

## Risks

| Risk | Mitigation |
| --- | --- |
| Pixel art takes far longer than the code | Build everything with placeholders first (phase 7 is last); one finished scene is enough for the first tests |
| Players memorise answers instead of learning | Varied patterns, a genuine case, and unseen transfer cases with backups |
| Feels childish to adults, or boring to teens | Test tone and art with both groups early, using placeholder art plus one finished scene |
| Town picture is confusing on small screens | Text list first on phones; test navigation in the first user sessions |
| Touch typing unusable for phone-only players | Clear "Trenger tastatur" notice; it never blocks other missions |
| Advice goes out of date | `reviewedOn` per mission, yearly check against Nettvett/NSM |
| Service worker serves stale versions | Versioned caches and the update bar; tested in phase 5 |
| Scope creep before anything is validated | Two missions, then test with people before adding the third |
| Certificate mistaken for an official qualification | Wording on certificate and About page says it is informal |

## Testing with people

With no analytics, learning comes from watching 5–10 people play, mostly from the primary persona, plus 2–3 teenagers. This finds design problems; it doesn't prove effectiveness.

**Each session (about 20 minutes):**

1. **Before:** show 3 links on paper or a phone (not from the game) and ask "which site would this take you to, and would you log in?"
2. **Play** *Finn bedrageren* while thinking aloud. Don't help unless they're stuck for more than a minute; note where.
3. **After:** 3 *different* links of new patterns, same questions. Ask them to explain their reasoning in their own words.
4. **Typing:** if they have a laptop, play *Ti fingre*; ask whether they'd want more lessons.
5. **Tone:** "Did anything feel childish, preachy or confusing?"

**Looking for:**

- Most can start and finish without help.
- Better answers and clearer reasoning on the after-links than the before-links.
- They name the habit ("go via the app") unprompted.
- Nobody describes it as patronising.

If minors take part, get a parent's consent and keep a parent present. Store no recordings beyond your own notes.

## Done when

- [ ] Town screen and list navigation both reach both missions
- [ ] *Finn bedrageren* plays start to finish on a phone and a laptop, by touch, mouse and keyboard
- [ ] All six cases, habit scene and transfer test work, with feedback and hints
- [ ] *Ti fingre* plays start to finish with a physical Norwegian keyboard; touch-only devices see a clear "Trenger tastatur" message
- [ ] Stickers are awarded, shown in the passport, survive reload, and can be reset
- [ ] Leaving mid-mission and coming back resumes at the last finished step
- [ ] App installs as a PWA and both missions work offline after first load
- [ ] Content tests pass in CI
- [ ] Manual screen-reader pass done; no blocking issues
- [ ] 5 people from the primary persona have played it; at least one thing changed because of what they did

## Open questions

- [ ] Final name: *Surfelappen*, or keep *License to Surf*? Check the domain is free. (The MVP is hosted at `surfelappen.minhule.eu` until this is settled.)
- [ ] Art: make the pixel art yourself, commission it, or generate and clean it up? Placeholders until phase 7; decide before phase 7. The technical base (sizes, formats) is fixed in `docs/decisions/`.
- [x] Should the habit scene mention BankID? **No**, it is saved for *BankID-fella* so Mission 1 keeps one takeaway.

## Appendix A: Finn bedrageren (draft content, nb)

*The text actually used lives in `src/content/missions/find-the-impostor/text.nb.ts`, which is the source of truth; this appendix is the starting draft, kept roughly in step.*

Draft text to start from. Polish the wording in testing; keep the structure. All URLs here are verified with a WHATWG URL parser and `tldts`.

**Fixed options for every case** (same order every time):

- **A** – the familiar site, e.g. *Pakkeposten (pakkeposten.example)*
- **B** – the other candidate, e.g. *Et annet nettsted: sporing-levering.example*
- **C** – *Det kan man ikke vite ut fra adressen*

**Shared feedback for C** (when wrong): "Det kan du faktisk se. Se på slutten av adressen, rett før første skråstrek (/). Der står det ekte nettstedet. Alt foran kan avsenderen skrive fritt."

### Intro

*Hanne på postkontoret:* "Hei! Mange her i Lenkevik får meldinger med lenker de er usikre på. Noen er ekte, andre er forsøk på svindel. Vil du se på dem sammen med meg? Lupen viser hvor lenkene egentlig fører."

*Learning line:* "Du lærer å se hvilket nettsted en lenke egentlig går til."

### Case 1 – SMS (subdomain trick) · answer B

- **From:** Bjørn. **Message (SMS from "Pakkeposten"):** "Pakken din venter! Bekreft levering innen i dag: https://pakkeposten.example.sporing-levering.example/pakke/7731"
- **Options:** A *Pakkeposten (pakkeposten.example)* · B *Et annet nettsted: sporing-levering.example*
- **Feedback A:** "*pakkeposten.example* står først, men det er bare en del av et lengre navn. Nettstedet står rett før første /, og der står *sporing-levering.example*."
- **Feedback B:** "Navnet Pakkeposten er lagt foran som pynt. Det ekte nettstedet er *sporing-levering.example*. Legg også merke til hengelåsen: den betyr bare at forbindelsen er kryptert, ikke at nettstedet er ærlig."
- **Hint 1:** "Finn den første skråstreken (/) etter https://. Se rett foran den."
- **Hint 2:** "Det som står helt til slutt før / er *sporing-levering.example*. Er det Pakkeposten?"
- **Les mer:** "Hvem som helst kan lage adresser som begynner med et kjent navn, så lenge slutten er deres eget nettsted. Det kalles et underdomene."

### Case 2 – Email from the bank (genuine) · answer A

- **From:** Fatima. **Message (email from Fjordbanken):** "Ny melding i nettbanken. Logg inn for å lese den: https://nettbank.fjordbanken.example/logg-inn"
- **Options:** A *Fjordbanken (fjordbanken.example)* · B *Et annet nettsted som heter «nettbank»*
- **Feedback A:** "Rett før første / står *fjordbanken.example*. *nettbank* foran er bare en avdeling av Fjordbankens eget nettsted. Ikke alle meldinger er svindel."
- **Feedback B:** "*nettbank* står foran, men det er bare en del av Fjordbankens eget nettsted. Det som teller er det rett før første /: *fjordbanken.example*."
- **Hint 1:** "Hva står helt til slutt, rett før første /?"
- **Hint 2:** "Slutten er *fjordbanken.example*. Alt foran det hører til samme nettsted."

### Case 3 – "Kundeservice" email (brand in another domain) · answer B

- **From:** Jonas. **Message:** "Kontoen din er låst. Kontakt kundeservice her: https://fjordbanken-kundeservice.example/"
- **Options:** A *Fjordbanken (fjordbanken.example)* · B *Et annet nettsted: fjordbanken-kundeservice.example*
- **Feedback A:** "*fjordbanken-kundeservice.example* er ett eget navn som hvem som helst kan kjøpe. Det er ikke det samme som *fjordbanken.example*."
- **Feedback B:** "Bindestreken gjør det til et helt annet nettsted. At det står *fjordbanken* i navnet, beviser ingenting."
- **Hint 1:** "Sammenlign navnet rett før / med Fjordbankens ekte nettsted, *fjordbanken.example*."
- **Hint 2:** "Er *fjordbanken-kundeservice.example* og *fjordbanken.example* nøyaktig like?"

### Case 4 – Social post (brand in path) · answer B

- **From:** Mari. **Message (post shared by a friend):** "Du har vunnet et gavekort fra Fjordbanken! Hent premien: https://premie-trekning.example/fjordbanken.example/vinner"
- **Options:** A *Fjordbanken (fjordbanken.example)* · B *Et annet nettsted: premie-trekning.example*
- **Feedback A:** "*fjordbanken.example* står etter første /, og der kan hvem som helst skrive hva som helst. Nettstedet er det som står før: *premie-trekning.example*."
- **Feedback B:** "Alt etter første / er bare innhold på det samme nettstedet, som her er *premie-trekning.example*."
- **Hint 1:** "Hvor er den første skråstreken? Står bankens navn før eller etter den?"
- **Hint 2:** "Det som står før første / er *premie-trekning.example*."

### Case 5 – Link text ≠ destination · answer B

- **From:** Ole. **Message (email):** "Viktig sikkerhetsvarsel. Klikk her: fjordbanken.example/sikkerhet" (the visible text). Lupen reveals: `https://sikkerhet-varsel.example/fjordbanken`
- **Options:** A *Fjordbanken (fjordbanken.example)* · B *Et annet nettsted: sikkerhet-varsel.example*
- **Feedback A:** "Teksten i e-posten sier *fjordbanken.example*, men det er bare tekst. Lupen viser hvor lenken faktisk går: *sikkerhet-varsel.example*."
- **Feedback B:** "Teksten du ser og adressen lenken går til kan være helt forskjellige. På PC kan du holde musepekeren over lenken; på mobil kan du holde fingeren på lenken for å se adressen."
- **Hint 1:** "Bruk lupen. Er adressen den samme som teksten?"
- **Hint 2:** "Lupen viser *sikkerhet-varsel.example* rett før første /."

### Case 6 – Municipality SMS (lookalike letters) · answer B

- **From:** Sunniva. **Message (SMS from "Lenkevik kommune"):** "Du har en ubetalt faktura. Betal her for å unngå gebyr: https://lenkevik-kornmune.example/faktura"
- **Options:** A *Lenkevik kommune (lenkevik-kommune.example)* · B *Et annet nettsted: lenkevik-kornmune.example*
- **Feedback A:** "Se nøye: det står *kornmune*, med **r** og **n** i stedet for **m**. Svindlere bruker bokstaver som ligner hverandre."
- **Feedback B:** "Godt sett. *rn* ser nesten ut som *m*, men det er et helt annet nettsted enn kommunens."
- **Hint 1:** "Les navnet bokstav for bokstav."
- **Hint 2:** "Se på bokstavene etter *ko*. Står det *m* eller *rn*?"

### Habit scene

*Hanne:* "Fatimas e-post fra banken var ekte. Men hva er lurest å gjøre neste gang du får en slik e-post?"

- **A** *Trykke på lenken, siden den var ekte forrige gang*
- **B** *Åpne bankappen eller skrive adressen selv* ✔
- **C** *Svare på e-posten og spørre om den er ekte*
- **Feedback A:** "Neste e-post kan se helt lik ut og være falsk. Det er tryggere å ikke logge inn fra lenker i det hele tatt."
- **Feedback B:** "Da kommer du alltid til det ekte stedet, uansett hva e-posten sier."
- **Feedback C:** "Hvis e-posten er falsk, svarer du svindleren. Kontakt heller banken på en måte du allerede vet er ekte."
- **Then, one screen:** "Tips: Bruker du passordbehandler og den ikke fyller inn passordet, kan det være fordi du er på feil nettsted. Har du allerede tastet inn noe? Ring banken på nummeret på kortet ditt, og bytt passord."

### Transfer test (new context: QR sign at Nettkaféen)

Intro: "Nå prøver du på egen hånd, i en ny situasjon. Ved Nettkaféen står et parkeringsskilt med QR-kode. Bruk lupen og se hvor koden fører."

| ID | URL | Answer | Pattern |
| --- | --- | --- | --- |
| T1 | `https://betal.lenkevik-kommune.example.parkering-app.example/` | B – *parkering-app.example* | subdomain trick |
| T2 | `https://parkering.lenkevik-kommune.example/betal` | A – *lenkevik-kommune.example* | genuine subdomain |
| T1-backup | `https://kunde.fjordbanken.example.trygg-sjekk.example/logg-inn` | B – *trygg-sjekk.example* | subdomain trick |
| T2-backup | `https://minside.pakkeposten.example/sporing` | A – *pakkeposten.example* | genuine subdomain |

Feedback on transfer cases follows the same pattern as the main cases. Draft texts for the transfer cases and backups (situation, sender, message, options, feedback, hints) are in `src/content/missions/find-the-impostor/text.nb.ts`; review them with the rest of the wording in testing.

### Summary

*Takeaway:* "Nettstedet står rett før første skråstrek. Men det tryggeste er å ikke logge inn fra lenker i det hele tatt: åpne appen eller skriv adressen selv."

*Sticker:* **Lenkedetektiv** – "Fullfør Finn bedrageren." · **Skarpt øye** – "Svar riktig på begge prøvesakene på første forsøk."

## Appendix B: Ti fingre (draft content, nb)

*The text actually used lives in `src/content/missions/ten-fingers/text.nb.ts` and `src/i18n/locales/nb.ts`; this appendix is the starting draft.*

**Finger map (Norwegian layout, home row):**

| Finger | Left hand | Right hand |
| --- | --- | --- |
| Little finger | A | Ø, Æ |
| Ring finger | S | L |
| Middle finger | D | K |
| Index finger | F, G | J, H |
| Thumbs | Space | Space |

### Intro

*Kai i Tastaturhallen:* "Med alle ti fingrene på tastaturet skriver du roligere, og du slipper å se ned hele tiden. Det går sakte i starten, og det er helt normalt. Nøyaktighet først – farten kommer av seg selv."

### Steps

| Step | Instruction (shown) | Keys taught | Drill |
| --- | --- | --- | --- |
| 1 | "Kjenn etter de små hakkene på F og J. Legg pekefingrene der, og de andre fingrene ved siden av. Tomlene hviler på mellomromstasten." | F J D K S L A Ø, space | `f j f j d k d k s l s l a ø a ø` |
| 2 | "Én finger om gangen. Se på skjermen, ikke på tastaturet." | (same) | `fff jjj ddd kkk sss lll aaa øøø` · `fjdk slaø fjdk slaø` |
| 3 | "Pekefingrene strekker seg innover til G og H. Lillefingeren til høyre strekker seg ut til Æ." | G H Æ | `fgf jhj fgf jhj øæø øæø` · `gh hg gh hg æ æ` |
| 4 | "Nå blir bokstavene til ord!" | (none new) | `da ha sal dag lag` · `glad hall skall` |
| 5 | "Siste linje! Ta den tiden du trenger." | (none new) | `glad dag da hall skall lag sal` |

Step 5 needs at least 90% accuracy. Every drill contains only keys taught in earlier or the same step; the content tests check this.

### Messages

- **Wrong key:** "Det var *\[key\]*. Prøv *\[expected\]* med *\[finger\]*." (e.g. "Prøv K med høyre langfinger.")
- **Layout hint** (after 3 layout-looking keystrokes, which are not counted as errors): "Det ser ut som tastaturet ditt er satt til et annet språk. Bytt til norsk tastatur, eller fortsett hvis du vil." *Fortsett* switches the drill to matching by key position.
- **Caps Lock note:** "Caps Lock er på. Det går fint, men bokstavene blir store."
- **Touch-only notice:** "Trenger tastatur. For å lære touch må du ha et fysisk tastatur. Har du koblet til et tastatur? Da kan du starte likevel." Buttons: *Start likevel* · *Tilbake til byen*
- **Step done:** "Godt jobbet. *\[accuracy\]* % riktig."
- **Final line below 90 %:** "*\[accuracy\]* % riktig. Prøv linjen én gang til, rolig og nøyaktig."

### Summary

*Takeaway:* "Fingrene har hver sin plass. Finn hakkene på F og J, så finner fingrene veien hjem. Øv litt hver gang, så sitter det."

*Sticker:* **Ti fingre** – "Fullfør første tastaturleksjon." · **Stø hånd** – "Skriv siste linje uten feil."

*Nysgjerrig* sticker text (town-wide): "Besøk alle husene i Lenkevik."
