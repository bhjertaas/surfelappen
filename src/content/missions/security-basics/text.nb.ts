import type { LinkInspectText } from '../text-types.ts';
import type { securityBasics } from './structure.ts';

export const securityBasicsNb: LinkInspectText<typeof securityBasics> = {
  title: 'Sikkerhet',
  character: 'Gandalf i Lenkevikbanken',
  intro: [
    'Gandalf. Ja, det er det alle kaller meg. Jeg passer på at ingen bryter seg inn i banken via nettet.',
    'De fleste innbrudd skjer ikke med avansert hacking. De skjer med dårlige passord, telefoner som aldri er oppdatert, og folk som vil være hjelpsomme når noen ringer. Åtte spørsmål, så er du bedre sikret enn de fleste.',
  ],
  learn:
    'Du lærer om sterke passord og passordbehandler, totrinnsbekreftelse, koder på telefonen, oppdateringer, app-tillatelser, sikkerhetskopi og trådløse nett.',
  summary: {
    takeaway:
      'Lange passord, ett per nettsted, i en passordbehandler. Slå på totrinnsbekreftelse. Gi aldri bort en kode til noen som ringer. Oppdater. Si nei til apper som vil ha mer enn de trenger. Ta sikkerhetskopi.',
  },
  further: {
    intro:
      'Vil du gjøre noe med det i dag? Her er tre steder å begynne. Lenkene går til nettsteder utenfor Surfelappen.',
    items: {
      pwned: {
        title: 'Har e-posten din vært med i en lekkasje?',
        body: 'Skriv inn e-postadressen din, så ser du om den har vært med i kjente datalekkasjer. Har den det, bytt passordet på de stedene, og på alle andre steder der du brukte det samme.',
        link: 'Have I Been Pwned (engelsk)',
      },
      dns4eu: {
        title: 'Et filter på hjemmenettet',
        body: 'DNS4EU er en gratis europeisk tjeneste som stopper kjente svindel- og virussider før de åpnes, for alle enheter på nettet ditt. Det finnes også en versjon som stopper sider som ikke passer for barn. Du setter den opp i innstillingene til ruteren.',
        link: 'DNS4EU for privatpersoner (engelsk)',
      },
      passphrase: {
        title: 'Sikre passord er de letteste å huske',
        body: 'Hvorfor noen ord på rad slår et kort passord med krumspring, og hvordan du lager et du faktisk husker.',
        link: 'Tek.no',
      },
    },
  },
  steps: {
    'strong-password': {
      prompt: 'Hvilket passord er sterkest?',
      options: {
        a: 'P@ssw0rd2024!',
        b: 'Sommer2024',
        c: 'blå-kaffekopp-hopper-langsomt',
      },
      feedback: {
        a: 'Ser vanskelig ut, men knekkeprogrammer prøver nettopp sånne bytter (a til @, o til 0) først. Og det er kort.',
        b: 'Årstider, navn og årstall er noe av det første som blir prøvd. Det er knekket på sekunder.',
        c: 'Riktig. Noen tilfeldige ord på rad gir et langt passord som er lett å huske. Lengde slår krumspring.',
      },
    },
    reuse: {
      prompt:
        'Du bruker samme passord på en nettbutikk, på e-posten og på Facebook. Nettbutikken blir hacket. Hva skjer?',
      options: {
        a: 'Bare kontoen i nettbutikken er i fare',
        b: 'Svindlerne prøver passordet på e-posten og Facebook også',
        c: 'Ingenting, passordet er jo sterkt',
      },
      feedback: {
        a: 'Dessverre ikke. Lekkede passord blir prøvd automatisk på tusenvis av andre nettsteder.',
        b: 'Akkurat. Og med e-posten din kan de nullstille passordet på nesten alt annet. Ett passord per nettsted stopper det.',
        c: 'Et sterkt passord hjelper ikke når det allerede er lekket. Da er det bare å prøve det andre steder.',
      },
    },
    'password-manager': {
      heading: 'Passordbehandler',
      body: [
        'Ingen klarer å huske et eget passord til hvert nettsted. Det trenger du heller ikke: la en **passordbehandler** (på engelsk *password manager*) gjøre det. Den lager sterke passord og fyller dem inn for deg.',
        'Den finnes innebygd i Chrome og på Android, og i Passord-appen på iPhone, iPad og Mac. Du kan også bruke en egen app, som Bitwarden, 1Password eller Proton Pass.',
        'Da trenger du bare å huske ett godt passord: det til passordbehandleren. Og en bonus: den fyller bare inn passordet på det ekte nettstedet, aldri på en falsk side.',
      ],
    },
    'two-step': {
      prompt:
        'En svindler har fått tak i passordet til e-posten din. Men du har slått på totrinnsbekreftelse (ofte kalt *2FA* eller *MFA*). Hva skjer når de prøver å logge inn?',
      options: {
        a: 'De kommer rett inn',
        b: 'De står fast: de mangler koden som kommer til mobilen din',
        c: 'E-posten blir slettet',
      },
      feedback: {
        a: 'Ikke med totrinnsbekreftelse. Da trengs både passordet og noe bare du har, som mobilen din.',
        b: 'Riktig. Det er som en ekstra lås på døra: noe du vet (passordet) og noe du har (mobilen). På engelsk heter det *two-factor* eller *multi-factor authentication*, derfor 2FA og MFA. BankID virker på samme måte. Slå det på for e-post og sosiale medier, under Sikkerhet i innstillingene.',
        c: 'Nei, de kommer bare ikke inn. Koden går til mobilen din, ikke til dem.',
      },
    },
    'code-call': {
      prompt:
        'Du får en SMS med en kode du ikke har bedt om. Rett etter ringer en hyggelig person fra «banken» og ber deg lese den opp, for å stoppe en svindel. Hva gjør du?',
      options: {
        a: 'Leser opp koden, de er jo fra banken',
        b: 'Legger på, og ringer banken på nummeret som står på kortet',
        c: 'Leser opp bare de første sifrene',
      },
      feedback: {
        a: 'Se hva som skjer: koden var den siste låsen inn til kontoen din, og nå har svindleren den. Banken ber aldri om koder eller passord på telefon.',
        b: 'Riktig. Svindleren hadde passordet ditt og trengte bare koden. Banken spør aldri om koder på telefon, og en ekte bankansatt blir ikke sur om du legger på og ringer tilbake.',
        c: 'Ikke en gang det. Banken spør aldri om koder, hverken hele eller deler.',
      },
    },
    update: {
      prompt: 'Telefonen sier «Programvareoppdatering tilgjengelig». Hva gjør du?',
      options: {
        a: 'Oppdaterer i kveld, mens den lader',
        b: 'Venter et halvt år, den virker jo fint',
        c: 'Aldri, oppdateringer gjør bare telefonen treg',
      },
      feedback: {
        a: 'Riktig. Mange oppdateringer tetter hull som svindlere allerede bruker. Slå gjerne på automatiske oppdateringer. Og får telefonen ikke oppdateringer lenger, er det på tide med en ny.',
        b: 'Se hva som skjer: oppdateringen tettet et hull som allerede blir brukt. Fram til du oppdaterer, står døra på gløtt.',
        c: 'Det kan føles sånn, men uten oppdateringer forblir kjente hull åpne. Det er dem svindlerne leter etter.',
      },
    },
    permissions: {
      prompt:
        'Du laster ned en lommelykt-app. Den vil ha tilgang til kontaktene dine, mikrofonen og hvor du er. Hva gjør du?',
      options: {
        a: 'Sier ja til alt, ellers virker den kanskje ikke',
        b: 'Sier nei, og sletter appen',
        c: 'Sier ja, men bare til kontaktene',
      },
      feedback: {
        a: 'En lommelykt trenger bare lyset. En app som vil ha mer, selger ofte det den samler inn. Lommelykten er dessuten innebygd i telefonen.',
        b: 'Riktig. Last ned apper fra App Store eller Google Play, og se over tillatelsene under Innstillinger av og til. Det en app ikke trenger, skal den ikke ha.',
        c: 'Kontaktene dine er også andres opplysninger. En lommelykt har ingen grunn til å se dem.',
      },
    },
    backup: {
      prompt:
        'Telefonen glipper ut av lomma og faller i sjøen fra brygga. Hva skjer med bildene dine?',
      options: {
        a: 'De er borte for alltid',
        b: 'De er trygge, hvis sikkerhetskopi var slått på',
        c: 'De kommer tilbake når telefonen tørker',
      },
      feedback: {
        a: 'Bare hvis de kun lå på telefonen. Med sikkerhetskopi ligger de også et annet sted.',
        b: 'Riktig. Med sikkerhetskopi (på engelsk *backup*) til iCloud eller Google ligger bildene også i skyen. Ny telefon, logg inn, og alt er der. Sjekk at det er slått på, gjerne i dag.',
        c: 'Telefoner tåler sjelden en tur i sjøen. Det er sikkerhetskopien som redder bildene.',
      },
    },
    wifi: {
      prompt:
        'På Kafé Alfakrøll ser du to trådløse nett: «Kafe_Alfakroll» og «Kafe_Alfakroll_GRATIS». Hva gjør du?',
      options: {
        a: 'Velger GRATIS, det høres best ut',
        b: 'Spør i kassa hva kafeens nett heter',
        c: 'Kobler til begge, for sikkerhets skyld',
      },
      feedback: {
        a: 'Se hva som skjer: «GRATIS» var satt opp av en mann ved vindusbordet. Nettet ber deg «logge inn med Google» på en falsk side. Skriv aldri passord på en side som dukker opp når du kobler til et nett.',
        b: 'Riktig. Navnet på et nett kan hvem som helst finne på. De fleste nettsider er krypterte (https), så du trenger ikke betale for VPN for å lese nyheter på kafé. Skal du i nettbanken, er mobildata et trygt valg.',
        c: 'Telefonen bruker bare ett nett om gangen, og du vet fortsatt ikke hvilket som er ekte. Spør heller.',
      },
    },
    extra: {
      heading: 'For den som vil gjøre litt mer',
      body: [
        'Hjemme kan du gi ruteren et filter som stopper kjente svindel- og virussider før de åpnes, for alle telefoner og PC-er i huset. DNS4EU er et gratis europeisk alternativ, også med en versjon som stopper sider som ikke passer for barn. Lenken finner du under «Vil du vite mer?» til slutt.',
        'Og sjekk om e-postadressen din har vært med i en datalekkasje. Det tar ett minutt.',
      ],
    },
  },
};
