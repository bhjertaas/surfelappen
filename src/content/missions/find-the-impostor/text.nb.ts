import type { LinkInspectText } from '../text-types.ts';
import type { findTheImpostor } from './structure.ts';

/**
 * Finn bedrageren, bokmål. From PRD Appendix A; the transfer cases and backups
 * are drafts in the same pattern (Appendix A only gives their URLs).
 */

/** Option C is the same on every case. */
const CANT_TELL = 'Det kan man ikke vite ut fra adressen';
const CANT_TELL_FEEDBACK =
  'Det kan du faktisk se. Se på slutten av adressen, rett før første skråstrek (/). Der står det ekte nettstedet. Alt foran kan avsenderen skrive fritt.';

const FJORDBANKEN = 'Fjordbanken (fjordbanken.example)';
const KOMMUNEN = 'Lenkevik kommune (lenkevik-kommune.example)';
const PAKKEPOSTEN = 'Pakkeposten (pakkeposten.example)';

const FIND_FIRST_SLASH = 'Finn den første skråstreken (/) etter https://. Se rett foran den.';
const WHAT_IS_LAST = 'Hva står helt til slutt, rett før første /?';

export const findTheImpostorNb: LinkInspectText<typeof findTheImpostor> = {
  title: 'Finn bedrageren',
  character: 'Hanne på Gone Phishing',
  intro: [
    'Hei! Mange her i Lenkevik får meldinger med lenker de er usikre på. Noen er ekte, andre er forsøk på svindel. Vil du se på dem sammen med meg? Lupen viser hvor lenkene egentlig fører.',
  ],
  learn: 'Du lærer å se hvilket nettsted en lenke egentlig går til.',
  summary: {
    takeaway:
      'Nettstedet står rett før første skråstrek. Men det tryggeste er å ikke logge inn fra lenker i det hele tatt: åpne appen eller skriv adressen selv.',
  },
  steps: {
    'case-1': {
      situation: 'Bjørn har fått en SMS.',
      sender: 'Pakkeposten',
      message: 'Pakken din venter! Bekreft levering innen i dag:',
      options: { a: PAKKEPOSTEN, b: 'Et annet nettsted: sporing-levering.example', c: CANT_TELL },
      feedback: {
        a: '*pakkeposten.example* står først, men det er bare en del av et lengre navn. Nettstedet står rett før første /, og der står *sporing-levering.example*.',
        b: 'Navnet Pakkeposten er lagt foran som pynt. Det ekte nettstedet er *sporing-levering.example*. Legg også merke til hengelåsen: den betyr bare at forbindelsen er kryptert, ikke at nettstedet er ærlig.',
        c: CANT_TELL_FEEDBACK,
      },
      hint1: FIND_FIRST_SLASH,
      hint2: 'Det som står helt til slutt før / er *sporing-levering.example*. Er det Pakkeposten?',
      lesMer:
        'Hvem som helst kan lage adresser som begynner med et kjent navn, så lenge slutten er deres eget nettsted. Det kalles et underdomene.',
    },
    'case-2': {
      situation: 'Fatima har fått en e-post fra banken.',
      sender: 'Fjordbanken',
      message: 'Ny melding i nettbanken. Logg inn for å lese den:',
      options: { a: FJORDBANKEN, b: 'Et annet nettsted som heter «nettbank»', c: CANT_TELL },
      feedback: {
        a: 'Rett før første / står *fjordbanken.example*. *nettbank* foran er bare en avdeling av Fjordbankens eget nettsted. Ikke alle meldinger er svindel.',
        b: '*nettbank* står foran, men det er bare en del av Fjordbankens eget nettsted. Det som teller er det rett før første /: *fjordbanken.example*.',
        c: CANT_TELL_FEEDBACK,
      },
      hint1: WHAT_IS_LAST,
      hint2: 'Slutten er *fjordbanken.example*. Alt foran det hører til samme nettsted.',
    },
    'case-3': {
      situation: 'Jonas har fått en e-post.',
      sender: 'Kundeservice',
      message: 'Kontoen din er låst. Kontakt kundeservice her:',
      options: {
        a: FJORDBANKEN,
        b: 'Et annet nettsted: fjordbanken-kundeservice.example',
        c: CANT_TELL,
      },
      feedback: {
        a: '*fjordbanken-kundeservice.example* er ett eget navn som hvem som helst kan kjøpe. Det er ikke det samme som *fjordbanken.example*.',
        b: 'Bindestreken gjør det til et helt annet nettsted. At det står *fjordbanken* i navnet, beviser ingenting.',
        c: CANT_TELL_FEEDBACK,
      },
      hint1: 'Sammenlign navnet rett før / med Fjordbankens ekte nettsted, *fjordbanken.example*.',
      hint2: 'Er *fjordbanken-kundeservice.example* og *fjordbanken.example* nøyaktig like?',
    },
    'case-4': {
      situation: 'Mari ser et innlegg som en venn har delt.',
      sender: 'Delt av en venn',
      message: 'Du har vunnet et gavekort fra Fjordbanken! Hent premien:',
      options: { a: FJORDBANKEN, b: 'Et annet nettsted: premie-trekning.example', c: CANT_TELL },
      feedback: {
        a: '*fjordbanken.example* står etter første /, og der kan hvem som helst skrive hva som helst. Nettstedet er det som står før: *premie-trekning.example*.',
        b: 'Alt etter første / er bare innhold på det samme nettstedet, som her er *premie-trekning.example*.',
        c: CANT_TELL_FEEDBACK,
      },
      hint1: 'Hvor er den første skråstreken? Står bankens navn før eller etter den?',
      hint2: 'Det som står før første / er *premie-trekning.example*.',
    },
    'case-5': {
      situation: 'Ole har fått en e-post.',
      sender: 'Fjordbanken Sikkerhet',
      message: 'Viktig sikkerhetsvarsel. Klikk her:',
      options: { a: FJORDBANKEN, b: 'Et annet nettsted: sikkerhet-varsel.example', c: CANT_TELL },
      feedback: {
        a: 'Teksten i e-posten sier *fjordbanken.example*, men det er bare tekst. Lupen viser hvor lenken faktisk går: *sikkerhet-varsel.example*.',
        b: 'Teksten du ser og adressen lenken går til kan være helt forskjellige. På PC kan du holde musepekeren over lenken; på mobil kan du holde fingeren på lenken for å se adressen.',
        c: CANT_TELL_FEEDBACK,
      },
      hint1: 'Bruk lupen. Er adressen den samme som teksten?',
      hint2: 'Lupen viser *sikkerhet-varsel.example* rett før første /.',
    },
    'case-6': {
      situation: 'Sunniva har fått en SMS.',
      sender: 'Lenkevik kommune',
      message: 'Du har en ubetalt faktura. Betal her for å unngå gebyr:',
      options: { a: KOMMUNEN, b: 'Et annet nettsted: lenkevik-kornmune.example', c: CANT_TELL },
      feedback: {
        a: 'Se nøye: det står *kornmune*, med **r** og **n** i stedet for **m**. Svindlere bruker bokstaver som ligner hverandre.',
        b: 'Godt sett. *rn* ser nesten ut som *m*, men det er et helt annet nettsted enn kommunens.',
        c: CANT_TELL_FEEDBACK,
      },
      hint1: 'Les navnet bokstav for bokstav.',
      hint2: 'Se på bokstavene etter *ko*. Står det *m* eller *rn*?',
    },
    habit: {
      prompt:
        'Fatimas e-post fra banken var ekte. Men hva er lurest å gjøre neste gang du får en slik e-post?',
      options: {
        a: 'Trykke på lenken, siden den var ekte forrige gang',
        b: 'Åpne bankappen eller skrive adressen selv',
        c: 'Svare på e-posten og spørre om den er ekte',
      },
      feedback: {
        a: 'Neste e-post kan se helt lik ut og være falsk. Det er tryggere å ikke logge inn fra lenker i det hele tatt.',
        b: 'Da kommer du alltid til det ekte stedet, uansett hva e-posten sier.',
        c: 'Hvis e-posten er falsk, svarer du svindleren. Kontakt heller banken på en måte du allerede vet er ekte.',
      },
    },
    'habit-tip': {
      heading: 'To gode vaner',
      body: [
        'Bruker du passordbehandler, og den ikke fyller inn passordet? Det kan være fordi du er på feil nettsted.',
        'Har du allerede tastet inn noe? Ring banken på nummeret på kortet ditt, og bytt passord.',
      ],
    },
    'transfer-intro': {
      heading: 'Prøv selv',
      body: [
        'Nå prøver du på egen hånd, i en ny situasjon. Ved Nettkaféen står et parkeringsskilt med QR-kode. Bruk lupen og se hvor koden fører.',
      ],
    },
    'transfer-1': {
      situation: 'Ved Nettkaféen henger et parkeringsskilt med en QR-kode.',
      sender: 'Parkering Lenkevik',
      message: 'Betal parkeringen enkelt! Skann koden:',
      options: { a: KOMMUNEN, b: 'Et annet nettsted: parkering-app.example', c: CANT_TELL },
      feedback: {
        a: '*lenkevik-kommune.example* står først, men det er bare en del av et lengre navn. Rett før første / står *parkering-app.example*.',
        b: 'Kommunens navn er lagt foran som pynt. Det ekte nettstedet er *parkering-app.example*.',
        c: CANT_TELL_FEEDBACK,
      },
      hint1: FIND_FIRST_SLASH,
      hint2: 'Rett før / står *parkering-app.example*. Er det kommunen?',
    },
    'transfer-2': {
      situation: 'På andre siden av gata står et annet parkeringsskilt.',
      sender: 'Lenkevik kommune',
      message: 'Betal for parkering her. Skann koden:',
      options: { a: KOMMUNEN, b: 'Et annet nettsted som heter «parkering»', c: CANT_TELL },
      feedback: {
        a: 'Rett før første / står *lenkevik-kommune.example*. *parkering* foran er bare en avdeling av kommunens eget nettsted.',
        b: '*parkering* står foran, men det er bare en del av kommunens eget nettsted. Det som teller er det rett før første /: *lenkevik-kommune.example*.',
        c: CANT_TELL_FEEDBACK,
      },
      hint1: WHAT_IS_LAST,
      hint2: 'Slutten er *lenkevik-kommune.example*. Alt foran det hører til samme nettsted.',
    },
    'transfer-1-backup': {
      situation: 'Inne på Nettkaféen henger en plakat på oppslagstavla.',
      sender: 'Plakat',
      message: 'Fjordbanken: Sjekk kontoen din gratis! Skann koden og logg inn:',
      options: { a: FJORDBANKEN, b: 'Et annet nettsted: trygg-sjekk.example', c: CANT_TELL },
      feedback: {
        a: '*fjordbanken.example* står først, men det er bare en del av et lengre navn. Rett før første / står *trygg-sjekk.example*.',
        b: 'Bankens navn er lagt foran som pynt. Det ekte nettstedet er *trygg-sjekk.example*, og der skal du ikke logge inn i banken.',
        c: CANT_TELL_FEEDBACK,
      },
      hint1: FIND_FIRST_SLASH,
      hint2: 'Rett før / står *trygg-sjekk.example*. Er det Fjordbanken?',
    },
    'transfer-2-backup': {
      situation: 'I vinduet på Nettkaféen henger en lapp.',
      sender: 'Pakkeposten',
      message: 'Nå kan du hente pakker her! Spor pakken din:',
      options: { a: PAKKEPOSTEN, b: 'Et annet nettsted som heter «minside»', c: CANT_TELL },
      feedback: {
        a: 'Rett før første / står *pakkeposten.example*. *minside* foran er bare en del av Pakkepostens eget nettsted.',
        b: '*minside* står foran, men det er bare en del av Pakkepostens eget nettsted. Det som teller er det rett før første /: *pakkeposten.example*.',
        c: CANT_TELL_FEEDBACK,
      },
      hint1: WHAT_IS_LAST,
      hint2: 'Slutten er *pakkeposten.example*. Alt foran det hører til samme nettsted.',
    },
  },
};
