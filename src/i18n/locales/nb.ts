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
  'post-office': {
    name: 'Postkontoret',
    about: 'Hvor går lenken egentlig? Hjelp postmesteren å avsløre lure meldinger.',
  },
  'keyboard-hall': {
    name: 'Tastaturhallen',
    about: 'Lær å skrive med ti fingre, uten å se ned.',
  },
  square: {
    name: 'Torget',
    about: 'Om å dele bilder og informasjon trygt.',
    closed: 'Torget er stengt mens vi rigger til. Her kommer et oppdrag om å dele trygt.',
  },
  library: {
    name: 'Biblioteket',
    about: 'Om å sjekke om noe du leser er sant.',
    closed: 'Biblioteket åpner snart. Her skal du lære å sjekke påstander.',
  },
  'licence-office': {
    name: 'Lappekontoret',
    about: 'Her ligger passet ditt med klistremerkene du har samlet.',
  },
};

const stickerCount: PluralForms = {
  zero: 'Du har ingen klistremerker ennå.',
  one: 'Du har {count} klistremerke.',
  other: 'Du har {count} klistremerker.',
};

export const nb = {
  app: {
    name: 'Surfelappen',
    pitch:
      'Lær å se hvor en lenke egentlig fører, og skriv med ti fingre. Korte oppdrag i den lille byen Lenkevik.',
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
    intro: 'Velkommen til Lenkevik! Velg et sted du vil besøke.',
    mapLabel: 'Bilde av Lenkevik',
    listLabel: 'Steder i Lenkevik',
    stickerCount,
    toPassport: 'Se passet ditt',
    comingSoon: 'Kommer snart',
    needsKeyboard: 'Trenger tastatur',
  },
  buildings,
  mission: {
    learnHeading: 'Dette lærer du',
    begin: 'Begynn',
    continue: 'Fortsett',
    restart: 'Start på nytt',
    playAgain: 'Spill igjen',
    backToTown: 'Tilbake til byen',
    exit: 'Avslutt og gå til byen',
    progress: 'Del {current} av {total}',
    notReady: 'Denne delen av oppdraget er ikke ferdig ennå. Den kommer i en senere versjon.',
  },
  keyboard: {
    title: 'Trenger tastatur',
    body: 'For å lære touch må du ha et fysisk tastatur. Har du koblet til et tastatur? Da kan du starte likevel.',
    startAnyway: 'Start likevel',
  },
  summary: {
    title: 'Oppdraget er fullført',
    takeawayHeading: 'Husk dette',
    toPassport: 'Til passet',
    toTown: 'Til byen',
  },
  passport: {
    title: 'Passet ditt',
    notReady: 'Her kommer klistremerkene du samler. Albumet er ikke ferdig ennå.',
  },
  about: {
    title: 'Om Surfelappen',
    what: 'Surfelappen er et lite, gratis spill der du øver på trygg bruk av nett: å se hvor lenker egentlig fører, og å skrive med ti fingre.',
    privacyHeading: 'Personvern',
    privacy: [
      'Fremgangen din lagres bare i nettleseren på denne enheten. Ingenting sendes til noen server.',
      'Spillet bruker ikke informasjonskapsler (cookies), analyseverktøy eller innhold fra andre nettsteder.',
      'Som alle nettsteder ser vertstjenesten (GitHub Pages) at noen besøker siden, men spillet samler ikke inn noe om deg.',
    ],
    informalHeading: 'Ikke en offisiell prøve',
    informal: 'Klistremerkene og passet er bare for moro skyld. De er ikke et bevis på kompetanse.',
    fictionHeading: 'Alt er oppdiktet',
    fiction:
      'Fjordbanken, Pakkeposten og Lenkevik kommune finnes ikke. Alle nettadressene i spillet slutter på *.example*, som aldri kan føre til et ekte nettsted.',
  },
  error: {
    notFoundTitle: 'Her var det tomt',
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
