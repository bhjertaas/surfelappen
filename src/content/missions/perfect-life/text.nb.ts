import type { FacadeText } from '../text-types.ts';
import type { perfectLife } from './structure.ts';

export const perfectLifeNb: FacadeText<typeof perfectLife> = {
  title: 'Det perfekte livet',
  character: 'Mira på Fasaden',
  intro: [
    'Hei, jeg er Mira. Jeg lager bilder for folk som lever av å se perfekte ut.',
    'Venninna mi Sara følger @livmedlina, og etter hvert synes hun at hennes eget liv er ganske kjedelig. Så i dag bytter vi plass: *du* er Lina, og du skal lage morgenbildet.',
  ],
  learn: 'Du lærer hvordan et «perfekt» bilde blir laget, og hva det gjør med dem som ser det.',
  summary: {
    takeaway:
      'Et innlegg er et utsnitt. Det fine er valgt ut, resten er utenfor rammen. Når du sammenligner deg med feeden, sammenligner du hele livet ditt med andres beste firkant.',
  },
  steps: {
    'make-the-picture': {
      brief:
        'Her er Linas leilighet klokka seks en vanlig dag. Lag et morgenbilde folk vil like. Flytt og forminsk rammen til bare det fine er med.',
      account: '@livmedlina',
      subjectName: 'Lina',
      mess: {
        kitchen: 'oppvasken (og katten)',
        tripod: 'mobilstativet på bokstabelen',
        clock: 'klokka, som viser 18.10',
        softbox: 'studiolampen',
        'ring-light': 'ringlampen',
        laundry: 'klesbunken',
        crisps: 'chipsposen',
        laptop: 'laptopen',
      },
      cropDone: 'Sånn. Ingen kommer til å se oppvasken.',
      polishIntro: 'Nå litt lys og glød. Se hva som skjer med likes-prognosen.',
      captionIntro: 'Til slutt: bildeteksten. Den betyr mer enn du tror.',
      captions: {
        nofilter: 'Rett opp av senga kl. 05.00 ☀️ Morgenen er min ✨ #nofilter',
        plain: 'God morgen 🌅',
        honest: 'Klokka er 18.10, det tok 23 forsøk, og stativet står på kokeboka mi 😅',
      },
      comments: {
        nofilter: [
          'Du er så heldig 😍',
          'Livsmål!!',
          'Hvordan får du huden så glødende???',
          'Jeg står opp kl. 5 fra i morgen 💪',
        ],
        plain: ['Så fint 😍', 'Drømmemorgen', 'Hvor er det fra?'],
        honest: [
          'Hahaha, endelig noen som er ærlige',
          'Kokeboka 😂',
          'Takk, trengte akkurat dette i dag',
        ],
      },
      saraAccount: '@sara.k',
      saraComment: {
        nofilter: 'Hvorfor ser mitt liv aldri sånn ut …',
        plain: 'Skulle ønske morgenene mine var sånn.',
        honest: 'Puh. Godt å vite at det ikke bare er meg.',
      },
      reaction: {
        nofilter:
          'Gratulerer: {likes} personer tror nå at du lever sånn hver morgen. Det tok deg et par minutter å lage. Sara ser hundrevis av slike bilder hver uke.',
        plain:
          'Teksten lyver ikke, men bildet forteller den samme historien. Sara ser bare firkanten, ikke rommet rundt.',
        honest:
          'Færre likes, men se på kommentarene. Sara fikk se bak fasaden, og hun er ikke alene om det.',
      },
      reveal: 'Dette er hele bildet. Det du la ut, er den lyse firkanten.',
    },
    'ad-hunt': {
      brief:
        'Sara spør: «Er alt dette reklame, eller?» Godt spørsmål. Sorter feeden hennes: reklame eller ikke? Bruk «Se nærmere» når du er usikker.',
      transferIntro: 'To til. Disse er litt annerledes enn de første.',
      posts: {
        shake: {
          account: '@livmedlina',
          caption: 'Elsker denne nye shaken!! 💗 Bruk koden LINA20 for 20 % rabatt #samarbeid',
          clues: [
            'En rabattkode med navnet hennes: hun tjener på det du kjøper.',
            '#samarbeid står gjemt helt til slutt.',
          ],
          right:
            'Reklame. Rabattkoden avslører det. Reklame skal være tydelig fra starten, for eksempel med «Reklame» øverst, ikke en emneknagg til slutt.',
          wrong: 'Se nærmere på teksten. Hvem tjener på at du kjøper shaken?',
        },
        yoga: {
          account: '@livmedlina',
          caption: 'Morgenrutinen min ☀️🧘‍♀️',
          clues: [
            'Ingen produkter, ingen kode, ingen lenke.',
            'Men husker du rommet rundt bildet? 😉',
          ],
          right:
            'Ikke reklame. Men du vet nå at et innlegg kan være iscenesatt uten å være reklame.',
          wrong: 'Se nærmere. Selger hun noe her?',
        },
        serum: {
          account: '@fjordglod',
          label: 'Reklame · Fjordglød',
          caption: 'Glød som varer hele dagen. ✨ Nytt serum i butikk nå.',
          clues: [
            'Merket «Reklame» står øverst.',
            'Merket «Retusjert person» betyr at kropp eller hud er endret i bildet. Det er påbudt i norsk reklame siden 2022.',
          ],
          right:
            'Reklame, og ærlig merket. «Retusjert person» betyr at huden på bildet er redigert. Ingen har porefri hud i virkeligheten.',
          wrong: 'Se på hva som står over bildet.',
        },
        cabin: {
          account: '@ida.m',
          caption: 'Hyttetur med gjengen 🏔️ Noen har spist alle vaflene',
          clues: [
            'Vanlige folk, ingen produkt i fokus.',
            'Ingen kode, ingen lenke, ingen merkevare.',
          ],
          right: 'Ikke reklame. Bare en hyttetur, med blunking og tommel i bildet.',
          wrong: 'Se nærmere. Prøver noen å selge deg noe?',
        },
        beach: {
          account: '@livmedlina',
          caption: 'Fikk prøve den nye resorten til @solreiser.example 🌴 Lenke i bio!',
          clues: [
            '«Fikk prøve»: turen var gratis.',
            'Et reiseselskap er tagget, og det er en lenke i bio.',
          ],
          right:
            'Reklame. En gratis tur er betaling. Da skal innlegget merkes som reklame, selv om ingen penger har skiftet hender.',
          wrong: 'Se nærmere. Hvem betalte for turen?',
        },
        gamer: {
          account: '@kasper.gg',
          caption: 'GG! 🏆 Takk til sponsoren min for energien ⚡ Rabatt i bio',
          clues: [
            'Boksen står perfekt plassert med etiketten mot kameraet.',
            '«Takk til sponsoren min» og «Rabatt i bio».',
          ],
          right:
            'Reklame, selv om det ser ut som en vanlig seier. Produktplassering er også reklame.',
          wrong: 'Se nærmere på bordet og teksten.',
        },
        taco: {
          account: '@pappa.tor',
          caption: 'Fredagstaco. Ingen klagde. Det er en seier.',
          clues: [
            'Vanlige pakker på bordet, ingen merkevare i fokus.',
            'Ingen kode, ingen lenke, ingen tagg.',
          ],
          right: 'Ikke reklame. Ikke alt med en matpakke i bildet er reklame.',
          wrong: 'Se nærmere. Tjener noen på dette innlegget?',
        },
      },
      done: 'Feeden er sortert. Du ser nå forskjell på en venn, en iscenesettelse og en avtale.',
    },
    'train-the-feed': {
      brief:
        'Siste triks: feeden. Den lærer av hva du stopper ved. Vi tester. Velg det innlegget du helst ville sett på, tre ganger.',
      roundPrompt: 'Runde {round} av {rounds}. Hvilket innlegg stopper du ved?',
      categories: {
        glossy: 'glansbilder',
        friends: 'venner',
        hobby: 'hobbyer',
        funny: 'morsomme ting',
      },
      posts: {
        routine: { account: '@livmedlina', caption: 'Morgenrutinen min ☀️' },
        beach: { account: '@livmedlina', caption: 'Paradis 🌴' },
        shake: { account: '@livmedlina', caption: 'Ny favoritt 💗' },
        serum: { account: '@fjordglod', caption: 'Glød hele dagen ✨' },
        cabin: { account: '@ida.m', caption: 'Hyttetur 🏔️' },
        taco: { account: '@pappa.tor', caption: 'Fredagstaco' },
        climbing: { account: '@klatreklubben', caption: 'Første topp! 🧗' },
        football: { account: '@lenkevik.old.boys', caption: '1–0 og mye gjørme' },
        cat: { account: '@tigerpus', caption: 'Passer perfekt.' },
        dog: { account: '@rufus.dino', caption: 'Rawr 🦖' },
      },
      trained: 'Du stoppet mest ved {category}. Se hva feeden din har blitt:',
      explain:
        'Tre valg, og feeden har allerede bestemt seg for hvem du er. Den viser mer av det du stopper ved, ikke det som er bra for deg. Sara stopper ved glansbilder. Hver gang.',
      saraIntro:
        'Her er Saras feed. Hjelp henne: vis færre glansbilder, og følg noe annet. Målet er at glansbildene ikke tar over.',
      suggestions: {
        'climbing-club': { account: '@klatreklubben', about: 'Folk på alle nivåer som klatrer' },
        'cat-account': { account: '@tigerpus', about: 'En katt som ikke passer i esker' },
        ida: { account: '@ida.m', about: 'Venninna fra hytteturen' },
      },
      done: 'Sånn. Feeden er ikke et speil av verden, den er et speil av hva du stopper ved. Og den kan du styre.',
    },
  },
};
