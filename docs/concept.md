# Concept (v0.5)

This page **overrides the PRD** on world, names, tone and art. The PRD still holds for mechanics, privacy, progress and the mission content that already exists. Background: the original brief and GPT's PRD draft are in `docs/openAI/`; the first PRD lost some of their spirit (a quirky digital city, witty tone, places with character).

## Feel

A lively, slightly quirky little city you explore, in the spirit of late-80s/90s adventure games: witty, curious, a bit mischievous. Not a quiet village, not a municipal brochure. Made for adults and teens, playable with friends and family.

- **The town** is seen from above at an angle (isometric, painted/illustrated look). You tap a place and your character walks there along the streets. Pins with names mark the places; a plain list is always there too.
- **Fun details** fill the town even though you can't interact with them: a boat that has hooked an email, someone walking into a lamp post while staring at a phone, a cat asleep on a router, a pizza drone, a bank billboard with a typo in its web address.
- **Each place has its own art theme**, so a mission feels like stepping into a different world. The town ties them together.

## Names and metaphors

- Mostly **Norwegian**; **English** where it works better (a pun, a sign, a phrase people know).
- **Surfelappen** stays as the name. Don't build on it: no cars, traffic or driving tests, and no heavy surfing or "www" imagery (younger players don't know them). A tagline under the logo explains it once, e.g. *«Å surfe på nettet» sier man gjerne om det å bruke Internett. Her tar du lappen på det.*
- City: **Lenkevik** (working name).

## Places

| Place | Topic | Art theme | Missions |
| --- | --- | --- | --- |
| **Gone Phishing** (a bait-and-tackle shop on the pier, with the sign on the door) | Suspicious links and messages, scams | Bold 90s point-and-click (painted, thick outlines, bright) | Finn bedrageren (exists); later a message/scam mission |
| **Arkaden** (the arcade) | Typing and keyboard confidence | Pixel art, arcade cabinets and neon | Ti fingre (exists; may be renamed, e.g. *Tasteninja*) |
| **Fasaden** (the polished shopfront, and the front people show online) | Influencers, filters, sponsored content, algorithms, sharing | Comic book (flat colour, bold ink, halftone) | *Det perfekte livet* (next new mission) |
| **Ryktebørsen** (working name) | Rumours, fact-checking, AI images | Noir detective | Later |
| **Lisenskontoret** / *The Licence Bureau* | Passport, and the final practical test that combines skills | Town style | Passport now; final test later |

## Mission loop (from the brief)

Encounter → investigate → decide → **see what happens** → understand → try a new example. The "see what happens" step is new: after a choice, show the likely consequence (e.g. the fake login page that opens), then explain.

## Not changing

Code structure, progress store, privacy rules, the impostor cases and the typing engine. They get new places, names and art.

## Det perfekte livet (Fasaden)

Hands-on, not a quiz: the player *does* the tricks. Guide: Mira, who makes these pictures for a living. Sara follows @livmedlina and feels her life is boring.

1. **Lag glansbildet** (built): you are Lina. Crop the messy flat down to the one nice spot (a live list names the mess still in the frame), polish with light/glow/warmth sliders while a likes forecast climbs, pick a caption (#nofilter gets the most likes, the honest one the warmest comments), post, watch the likes and Sara's comment, then «Se bak fasaden» shows the tiny square inside the whole room.
2. **Reklamejakt** (built): sort a feed into reklame / ikke reklame / vet ikke, tapping posts for clues (discount codes, "annonse", retouch marks, unlabelled deals). New posts at the end are the transfer test.
3. **Tren feeden** (after): pick what you stop at for three rounds, watch the feed fill with perfect lives, then adjust Sara's feed (mute, follow varied accounts) and see it change.
