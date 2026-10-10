import type { PluralForms } from '../format.ts';

/**
 * Norwegian bokmål UI strings. The type of this object is the contract every
 * other locale must satisfy (ADR 0005). Inline markup: *em* and **strong** only.
 */

interface BuildingText {
  readonly name: string;
  /** One line shown in the list under the name. */
  readonly about: string;
  /** Shown when a closed building is selected. */
  readonly closed?: string;
}

const buildings: Record<string, BuildingText> = {
  'gone-phishing': {
    name: 'Gone Phishing',
    about: 'Se hvor lenker i SMS og e-post egentlig fører.',
  },
  arcade: {
    name: 'Arkaden',
    about: 'Lær å skrive med ti fingre, uten å se ned.',
  },
  facade: {
    name: 'Fasaden',
    about: 'Om influensere, filtre og det perfekte livet.',
    closed: 'Her kommer et oppdrag om livet bak de perfekte bildene. Det er ikke klart ennå.',
  },
  'rumour-exchange': {
    name: 'Ryktebørsen',
    about: 'Om å sjekke om noe du leser er sant.',
    closed: 'Her kommer et oppdrag om rykter og falske nyheter. Det er ikke klart ennå.',
  },
  'licence-bureau': {
    name: 'Lisenskontoret',
    about: 'Her ligger passet ditt med klistremerkene du har samlet.',
  },
};

interface StickerText {
  readonly name: string;
  /** How to earn it, shown in the passport and the summary. */
  readonly howTo: string;
}

const stickers: Record<string, StickerText> = {
  'link-detective': { name: 'Lenkedetektiv', howTo: 'Fullfør Finn bedrageren.' },
  'sharp-eye': {
    name: 'Skarpt øye',
    howTo: 'Svar riktig på begge prøvesakene i Finn bedrageren på første forsøk.',
  },
  'ten-fingers': { name: 'Ti fingre', howTo: 'Fullfør første tastaturleksjon.' },
  'steady-hand': { name: 'Stø hånd', howTo: 'Skriv siste linje i Ti fingre uten feil.' },
  curious: { name: 'Nysgjerrig', howTo: 'Besøk alle husene i Lenkevik.' },
};

const stickerCount: PluralForms = {
  zero: 'Du har ingen klistremerker ennå.',
  one: 'Du har {count} klistremerke.',
  other: 'Du har {count} klistremerker.',
};

export const nb = {
  app: {
    name: 'Surfelappen',
    tagline:
      '«Å surfe på nettet» sier man gjerne om det å bruke Internett. Her tar du lappen på det.',
    pitch:
      'Korte oppdrag i den litt rare byen Lenkevik: avslør svindellenker, lær touch på tastaturet, og mer etter hvert.',
    version: 'Versjon',
  },
  nav: {
    label: 'Hovedmeny',
    home: 'Surfelappen',
    town: 'Byen',
    passport: 'Passet',
    about: 'Om spillet',
  },
  start: {
    start: 'Start',
    continue: 'Fortsett der du slapp',
    about: 'Om spillet og personvern',
    free: 'Gratis, uten innlogging. Ingenting om deg blir samlet inn.',
  },
  town: {
    title: 'Lenkevik',
    intro: 'Velkommen til Lenkevik. Trykk på et sted, så går du dit.',
    mapLabel: 'Kart over Lenkevik',
    listLabel: 'Steder i Lenkevik',
    stickerCount,
    toPassport: 'Se passet ditt',
    comingSoon: 'Kommer snart',
    needsKeyboard: 'Trenger tastatur',
  },
  buildings,
  stickers,
  mission: {
    learnHeading: 'Dette lærer du',
    begin: 'Begynn',
    continue: 'Fortsett',
    restart: 'Start på nytt',
    playAgain: 'Spill igjen',
    backToTown: 'Tilbake til byen',
    exit: 'Avslutt og gå til byen',
    progress: 'Del {current} av {total}',
  },
  linkInspect: {
    caseProgress: 'Sak {current} av {total}',
    transferProgress: 'Prøvesak {current} av {total}',
    backupProgress: 'Ekstra prøvesak',
    contexts: {
      sms: 'SMS',
      email: 'E-post',
      social: 'Innlegg på sosiale medier',
      qr: 'QR-kode',
      browser: 'Nettleser',
    },
    messageLabel: 'Meldingen',
    from: 'Fra:',
    useLupen: 'Bruk lupen',
    lupenResult: 'Lupen viser hvor lenken egentlig går:',
    question: 'Hvilken nettside ville du egentlig kommet til?',
    optionLetters: ['A', 'B', 'C'],
    hint: 'Vis et hint',
    hintMore: 'Vis et hint til',
    hintHeading: 'Hint',
    correctHeading: 'Riktig svar',
    wrongHeading: 'Ikke helt',
    addressHeading: 'Slik leser du adressen',
    siteLabel: 'Nettstedet',
    siteExplain:
      'Nettstedet står rett før første skråstrek (/). Alt foran kan avsenderen velge fritt.',
    lesMer: 'Les mer',
    next: 'Neste',
    tryAgain: 'Prøv igjen',
    firstTry: 'Du svarte riktig på første forsøk på {correct} av {total} saker.',
    firstTryNote: 'Det er bare du som ser dette.',
  },
  typing: {
    lineProgress: 'Linje {current} av {total}',
    inputLabel: 'Skriv her',
    inputHelp: 'Trykk i feltet hvis tastene ikke virker. Det du skriver lagres ikke.',
    nextKey: 'Neste tast: {key}, med {finger}.',
    wrongKey: 'Det var {typed}. Prøv {expected} med {finger}.',
    layoutHint:
      'Det ser ut som tastaturet ditt er satt til et annet språk. Bytt til norsk tastatur, eller fortsett hvis du vil.',
    continueAnyway: 'Fortsett med dette tastaturet',
    capsLock: 'Caps Lock er på. Det går fint, men bokstavene blir store.',
    stepDone: 'Godt jobbet. {accuracy} riktig.',
    finalTooLow:
      '{accuracy} riktig. Du trenger minst {min} for å fullføre. Prøv linjen én gang til, rolig og nøyaktig.',
    tryAgain: 'Prøv linjen igjen',
    next: 'Neste',
    finalScore: 'Siste linje: {accuracy} riktig.',
    space: 'mellomrom',
    fingers: {
      'left-pinky': 'venstre lillefinger',
      'left-ring': 'venstre ringfinger',
      'left-middle': 'venstre langfinger',
      'left-index': 'venstre pekefinger',
      'right-index': 'høyre pekefinger',
      'right-middle': 'høyre langfinger',
      'right-ring': 'høyre ringfinger',
      'right-pinky': 'høyre lillefinger',
      thumb: 'tommelen',
    },
  },
  keyboard: {
    title: 'Trenger tastatur',
    body: 'For å lære touch må du ha et fysisk tastatur. Har du koblet til et tastatur? Da kan du starte likevel.',
    startAnyway: 'Start likevel',
  },
  summary: {
    title: 'Oppdraget er fullført',
    stickersHeading: 'Klistremerker',
    stickerEarned: 'Du har klistremerket {name}.',
    stickerMissing: 'Du kan også få {name}: {howTo}',
    takeawayHeading: 'Husk dette',
    toPassport: 'Til passet',
    toTown: 'Til byen',
  },
  passport: {
    title: 'Passet ditt',
    intro:
      'Her samler du klistremerker. De grå viser hvilke som finnes, og hva du gjør for å få dem.',
    albumLabel: 'Klistremerker',
    earned: 'Tjent',
    notEarned: 'Ikke tjent ennå',
    visited: 'Du har besøkt {visited} av {total} hus.',
    resetHeading: 'Begynne helt på nytt?',
    resetIntro: 'Du kan slette all fremgang og alle klistremerker på denne enheten.',
    reset: 'Nullstill fremgang',
    resetConfirmTitle: 'Slette all fremgang?',
    resetConfirmBody:
      'Alle klistremerker og alt du har gjort i oppdragene blir slettet fra denne enheten. Dette kan ikke angres.',
    resetConfirm: 'Ja, slett alt',
    resetCancel: 'Avbryt',
    resetDone: 'Fremgangen er slettet.',
  },
  celebration: {
    title: 'Nytt klistremerke',
    titleMany: 'Nye klistremerker',
    close: 'Fint',
  },
  about: {
    title: 'Om Surfelappen',
    what: 'Surfelappen er et lite, gratis spill der du øver på trygg bruk av nett: å se hvor lenker egentlig fører, og å skrive med ti fingre. Det passer fint å spille sammen med noen.',
    privacyHeading: 'Personvern',
    privacy: [
      'Spillet husker hvilke oppdrag du har gjort, hvor langt du har kommet og hvilke klistremerker du har. Det lagres bare i nettleseren på denne enheten. Ingenting sendes til noen server.',
      'Det lagres ikke navn, tidspunkter eller noe du skriver. Tastene du trykker i Ti fingre blir sjekket og glemt med en gang.',
      'Spillet bruker ikke informasjonskapsler (cookies), analyseverktøy eller innhold fra andre nettsteder.',
      'Som alle nettsteder ser vertstjenesten (GitHub Pages) at noen besøker siden, men spillet samler ikke inn noe om deg.',
    ],
    deleteHeading: 'Slik sletter du det som er lagret',
    delete:
      'Gå til passet og trykk «Nullstill fremgang». Du kan også slette nettstedsdata for Surfelappen i innstillingene i nettleseren.',
    sourcesHeading: 'Kilder',
    sourcesIntro:
      'Rådene i spillet er sjekket mot disse kildene. Vi kopierer ikke innhold fra dem.',
    reviewedOn: 'Sist kontrollert: {date}.',
    notReviewed: 'Ikke kontrollert mot kildene ennå.',
    noSources: 'Dette oppdraget gir ikke sikkerhetsråd, så det har ingen kilder.',
    informalHeading: 'Ikke en offisiell prøve',
    informal: 'Klistremerkene og passet er bare for moro skyld. De er ikke et bevis på kompetanse.',
    fictionHeading: 'Alt er oppdiktet',
    fiction:
      'Fjordbanken, Pakkeposten og Lenkevik kommune finnes ikke. Alle nettadressene i spillet slutter på *.example*, som aldri kan føre til et ekte nettsted.',
    creditsHeading: 'Laget av',
    credits: [
      'Laget av Benny Hjertaas.',
      'Skrifttyper: Pixelify Sans av Stefie Justprince og Atkinson Hyperlegible Next av Braille Institute, begge med SIL Open Font License.',
      'Grafikken er laget med hjelp av en bildemodell (OpenAI) og tilpasset til pikselkunst.',
    ],
    licenceHeading: 'Lisens',
    licence:
      'Koden er fri programvare med MIT-lisens. Tekst og grafikk kan brukes og deles videre etter CC BY-NC-SA 4.0. Kildekoden ligger på GitHub.',
    sourceCode: 'Se kildekoden på GitHub',
  },
  error: {
    notFoundTitle: 'Fant ikke siden',
    notFoundBody: 'Vi fant ikke siden du lette etter.',
    errorTitle: 'Noe gikk galt',
    errorBody: 'Beklager, her skjedde det en feil. Det du har gjort så langt, er lagret.',
    backToTown: 'Tilbake til byen',
  },
  update: {
    message: 'Ny versjon av spillet er klar.',
    reload: 'Last inn på nytt',
  },
  storage: {
    unavailable:
      'Fremgangen din blir ikke lagret på denne enheten. Du kan likevel spille, men må begynne på nytt neste gang.',
    newerVersion:
      'En nyere versjon av spillet er åpen i en annen fane. Fremgangen herfra blir ikke lagret. Lukk denne fanen, eller last den inn på nytt.',
    dismiss: 'Lukk',
  },
};

export type Messages = typeof nb;
