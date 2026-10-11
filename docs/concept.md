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
| **Kafé Krøllalfa** (the café on the corner; *krøllalfa* is Norwegian for @) | The basics: browser vs search engine vs site, the address bar, reading an address, how a request travels (DNS, IP, packets), a little history and AI | Late-90s desktop: teal, grey bevelled windows, CRT glow | *Hva er egentlig nettet?* (built). Comes first: Agnbua opens after it |
| **Agnbua** (a bait-and-tackle shop on the pier; the sign on the door says *Gone Phishing*. Every scam is bait, so the name covers more than phishing) | Suspicious links and messages, scams | Bold 90s point-and-click (painted, thick outlines, bright) | Finn bedrageren (exists); later a message/scam mission |
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
3. **Tren feeden** (built): pick what you stop at for three rounds, watch the feed fill with perfect lives, then adjust Sara's feed (mute, follow varied accounts) and see it change.

After the mission, **«Vil du vite mer?»** (`#/mission/perfect-life/more`) gives real examples with links to the press: the ad business model (Forbrukerrådet), Instagram and body image (Haugen), TikTok's feed (Amnesty), Myanmar (BBC), Cambridge Analytica (Guardian, incl. that the Brexit link wasn't borne out) and the mixed research on polarisation (Nature). Tone: plain facts, say where research disagrees. Other missions can get the same page.

Open items: the mission's sources are listed on the About page but `reviewedOn` is still null.

## Hva er egentlig nettet? (Kafé Krøllalfa)

Guide: Ivar, who has run the café since the modem squealed. Five short, hands-on steps:

1. **Hvem er hvem?** Sort Chrome, Google, nrk.no, Safari, Ecosia, yr.no, Edge, Bing and wikipedia.org into nettleser / søkemotor / nettsted. Point: Google is not the internet.
2. **Snarveien:** a toy browser. Get to NRK however you usually do; if you search, you get there in a few taps past an ad, then do it again by typing nrk.no in the address bar. Typing "nrk" without .no becomes a search, as in real browsers. Pick another search engine (Ecosia plants trees).
3. **Les adressen:** tap each part of `https://www.nrk.no/sport`, `kari@epost.example` and a trick address (`nrk.no.nyheter-gratis.example`), then tap the part that decides where you are. Leads straight into Agnbua.
4. **Pakken på reise:** look up nrk.no (DNS gives an IP address), send, a digger cuts the Oslo cable, send again and the packets go via Bergen.
5. **Tidsreisen:** ten cards from "LO" (1969) to ChatGPT (2022), incl. NORSAR at Kjeller (1973). Not quizzed. Later: a short narrated video version, if we find a way that fits the size budget.

## Room for more places

The town picture has more houses than places: the yellow house on the left, the blue and yellow houses on the right, the red houses behind the arcade. New missions can move into those (a hotspot and a door point in `content/town.ts`), and the town can be redrawn wider when it gets crowded.
