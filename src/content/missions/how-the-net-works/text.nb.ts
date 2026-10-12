import type { WebText } from '../text-types.ts';
import type { howTheNetWorks } from './structure.ts';

export const howTheNetWorksNb: WebText<typeof howTheNetWorks> = {
  title: 'Hva er egentlig nettet?',
  character: 'Ivar på Kafé Alfakrøll',
  intro: [
    'Hei, jeg er Ivar. Her på kafeen har folk surfet siden modemet pep og knitret.',
    'Mange bruker nettet hver dag uten å vite hva som er hva. Er Google internett? Hva er alfakrøllen godt for? Ta en kopp, så finner vi ut av det.',
  ],
  learn:
    'Du lærer forskjellen på nettleser, søkemotor og nettsted, hvordan du leser en adresse, og hvordan nettet henger sammen.',
  summary: {
    takeaway:
      'Nettleseren er programmet, søkemotoren er én nettside av mange, og **domenet** i adressen forteller hvem du er hos.',
  },
  steps: {
    'who-is-who': {
      brief:
        'Først en oppvarming. Her er noen navn du sikkert har sett. Er det en nettleser, en søkemotor eller et nettsted?',
      cards: {
        chrome: {
          name: 'Chrome',
          right:
            'Chrome er en nettleser, på engelsk *browser*: programmet du ser nettsider i. Den er laget av Google, men er ikke det samme som Google-søket.',
          wrong: 'Hint: Chrome er et program du åpner for å komme ut på nettet.',
        },
        google: {
          name: 'Google',
          right:
            'Google er en søkemotor: en nettside som finner andre nettsider. Du kan bruke den i hvilken som helst nettleser.',
          wrong:
            'Hint: Google er ikke programmet, men en side du besøker for å lete etter andre sider.',
        },
        nrk: {
          name: 'nrk.no',
          right: 'nrk.no er et nettsted. Det har en adresse du kan skrive rett inn.',
          wrong: 'Hint: Se på .no på slutten. Det er en adresse.',
        },
        safari: {
          name: 'Safari',
          right: 'Safari er nettleseren på iPhone, iPad og Mac.',
          wrong: 'Hint: Det blå kompasset på iPhone. Det er programmet du surfer med.',
        },
        ecosia: {
          name: 'Ecosia',
          right: 'Ecosia er en søkemotor som bruker overskuddet sitt til å plante trær.',
          wrong: 'Hint: Ecosia finner ting for deg, akkurat som Google.',
        },
        yr: {
          name: 'yr.no',
          right: 'yr.no er et nettsted, med værmeldingen fra NRK og Meteorologisk institutt.',
          wrong: 'Hint: Den har en adresse som slutter på .no.',
        },
        edge: {
          name: 'Edge',
          right: 'Edge er nettleseren som følger med Windows.',
          wrong: 'Hint: Den følger med Windows, og du åpner den for å komme ut på nettet.',
        },
        bing: {
          name: 'Bing',
          right: 'Bing er Microsofts søkemotor. Det finnes mange flere enn Google.',
          wrong: 'Hint: Bing svarer når du lurer på noe, som Google.',
        },
        wikipedia: {
          name: 'wikipedia.org',
          right: 'wikipedia.org er et nettsted: et leksikon som frivillige skriver sammen.',
          wrong: 'Hint: Det har en adresse, og du leser ting der.',
        },
      },
      done: 'Nettleseren er programmet. Søkemotoren og nettstedene er sider du besøker i den. Google er altså ikke internett, bare en veldig populær side på det.',
    },
    shortcut: {
      brief: 'Første oppgave: gå til NRK. Gjør det akkurat slik du pleier.',
      engines: {
        google: 'Google',
        bing: 'Bing',
        duckduckgo: 'DuckDuckGo',
        ecosia: 'Ecosia',
      },
      adTitle: 'Se NRK på storskjerm! 75 tommer til halv pris',
      adSnippet: 'Bare i dag. Fri frakt.',
      targetTitle: 'NRK – nyheter, TV og radio',
      targetSnippet: 'Siste nytt fra Norge og verden.',
      targetName: 'NRK',
      targetPage: 'Siste nytt: Lenkeviking fant fram helt uten å søke.',
      afterSearch:
        'Du kom fram, på {clicks} trykk. Men du visste jo adressen! Prøv igjen, og skriv **nrk.no** rett i adresselinja øverst.',
      afterAddress:
        'Rett dit. Adresselinja tar deg direkte til nettstedet, uten omvei om søkemotoren og annonsene der.',
      becameSearch:
        'Uten punktum vet ikke nettleseren at «{query}» er en adresse, så den søkte i stedet. Ta med .no.',
      noResults: 'Ingen treff på «{query}» i denne lille nettleseren. Prøv «nrk».',
      elsewhere: '{host} finnes kanskje, men i denne øvelsen skal du til nrk.no.',
      clickedAd:
        'Oops, det var en annonse. Den står øverst fordi noen har betalt for plassen, ikke fordi det er det du lette etter. Gå tilbake og velg et annet treff.',
      trees: 'Ecosia bruker overskuddet til å plante trær. Samme søk, annen søkemotor.',
      done: 'Søkemotoren er bare én nettside av mange, og du kan bytte den. Når du vet adressen, kan du hoppe rett dit.',
    },
    'read-the-address': {
      brief:
        'En adresse ser ut som et virvar, men den leses som en postadresse. Trykk på delene for å se hva de betyr.',
      addresses: {
        web: {
          intro: 'En nettadresse.',
          question: 'Hvilken del avgjør hvem du er hos?',
          parts: {
            scheme:
              '**https://** forteller hvordan nettleseren snakker med siden. S-en står for sikker: ingen underveis kan lese med.',
            www: '**www.** står for World Wide Web. Det er en gammel vane, og de fleste sider virker fint uten.',
            domain:
              '**nrk.no** er domenet: hvem du er hos. .no betyr Norge, og NRK eier navnet foran. Det er denne delen som avgjør hvem du snakker med.',
            path: '**/sport** er hvilken side hos NRK du vil se. Den kan være lang og kronglete, men den bytter aldri hvem du er hos.',
          },
          right: 'Ja. Domenet, nrk.no, sier hvem siden tilhører.',
          wrong: 'Ikke den. Se etter navnet med .no på slutten.',
        },
        email: {
          intro: 'En e-postadresse.',
          question: 'Hvilken del forteller hvor e-posten havner?',
          parts: {
            name: '**kari** er navnet på postkassa.',
            at: '**@** har mange navn på norsk: alfakrøll, krøllalfa, eller bare «at», som på engelsk. «At» betyr «hos». Ray Tomlinson valgte tegnet til den første e-posten i 1971, nettopp fordi det betyr «hos» og ikke fantes i navn.',
            domain: '**lenkevik-post.no** er domenet: hvem som har postkassa.',
          },
          right:
            'Riktig. Alt etter alfakrøllen er stedet, akkurat som domenet i en nettadresse. Kari *hos* lenkevik-post.no.',
          wrong: 'Ikke helt. Navnet sier hvem, men hvor står etter alfakrøllen.',
        },
        search: {
          intro: 'Til slutt adressen du får når du søker på Google.',
          question: 'Hvor står det du søkte på?',
          parts: {
            scheme: '**https://** igjen: forbindelsen er sikret.',
            domain:
              '**google.com** er domenet. Du søkte etter NRK, men du er fortsatt hos Google. Søkemotoren er bare en side som peker videre.',
            path: '**/search** er søkesiden hos Google.',
            query:
              '**?q=nrk** er søket ditt. Alt etter spørsmålstegnet er beskjeder til siden, her «q» for *query*, som betyr spørsmål.',
          },
          right:
            'Ja. Søket ditt står rett i adressen. Deler du lenken, ser mottakeren hva du søkte på.',
          wrong: 'Ikke den. Se etter spørsmålstegnet.',
        },
      },
      done: 'Nå kan du lese en adresse. I Agnbua får du bruk for det: der lærer du å avsløre adresser som later som de er noe de ikke er.',
    },
    'packet-trip': {
      brief:
        'Hva skjer egentlig når du skriver nrk.no og trykker Gå? Følg forespørselen din gjennom nettet.',
      nodes: {
        you: 'Mobilen din',
        home: 'Ruteren hjemme',
        provider: 'Nettleverandøren',
        oslo: 'Oslo',
        bergen: 'Bergen',
        server: 'NRKs server',
      },
      lookedUp:
        'Først slår mobilen opp nrk.no i nettets telefonkatalog, DNS. Svaret er en IP-adresse, for eksempel **{ip}**. Det er serverens egentlige adresse. Navnet finnes bare så vi mennesker skal huske den.',
      arrived:
        'Fram! Forespørselen ble delt i små pakker som hoppet fra maskin til maskin. Serveren sendte siden tilbake på samme måte. Hele turen tok en brøkdel av et sekund.',
      cutIntro:
        'Men hva om noe går i stykker? Uff, en gravemaskin har gravd over kabelen til Oslo.',
      rerouted:
        'Pakkene fant en annen vei, via Bergen. Det er hele poenget med internett: et nett av nett, med mange veier mellom dem. Ingen enkelt kabel eller maskin bestemmer over alt.',
      done: 'Navn blir til IP-adresse, pakker finner veien selv, og siden kommer tilbake. Hver gang du trykker på en lenke.',
    },
    'time-travel': {
      brief:
        'Til slutt en liten tidsreise. Trykk «Spill av med lyd», så forteller jeg, eller bla i ditt eget tempo. Det er ingen spørsmål.',
      events: {
        arpanet: {
          title: 'Den første meldingen',
          body: 'En datamaskin i Los Angeles sendte den første meldingen over ARPANET, forløperen til internett, til en maskin i Stanford. Planen var å skrive LOGIN. Systemet krasjet etter «LO».',
        },
        email: {
          title: 'Den første e-posten',
          body: 'Ray Tomlinson sendte e-post mellom to maskiner og valgte @ for å skille navnet fra maskinen: navn *hos* sted.',
        },
        norsar: {
          title: 'Norge på nett',
          body: 'NORSAR på Kjeller, som målte jordskjelv og atomprøver, ble koblet til ARPANET. Norge var blant de aller første landene utenfor USA på nettet.',
        },
        tcpip: {
          title: 'Et felles språk',
          body: '1. januar gikk nettet over til TCP/IP, et felles språk som lot ulike nett snakke sammen. Mange kaller det internettets bursdag.',
        },
        web: {
          title: 'Weben blir født',
          body: 'Tim Berners-Lee ved forskningssenteret CERN i Sveits foreslo sider som lenker til hverandre: World Wide Web. Det er derfra «www» kommer.',
        },
        'free-web': {
          title: 'Gratis for alle',
          body: 'CERN ga bort programvaren for weben, fri for alle å bruke. Da kunne hvem som helst lage nettsider og nettlesere, og weben tok av.',
        },
        google: {
          title: 'Google',
          body: 'To studenter startet Google. Søkemotoren ble så stor at mange i dag tror Google *er* internett.',
        },
        social: {
          title: 'Sosiale medier',
          body: 'Facebook startet, først for studenter. Snart kunne alle publisere, og reklamen fulgte etter. Mer om det på Fasaden.',
        },
        smartphone: {
          title: 'Nettet i lomma',
          body: 'iPhone kom, og smarttelefonen flyttet nettet fra skrivebordet til lomma.',
        },
        ai: {
          title: 'AI for alle',
          body: 'ChatGPT ble lansert. Det er en språkmodell: AI, eller KI på norsk, kunstig intelligens trent på enorme mengder tekst, som gjetter hvilke ord som passer best. Den kan være til stor hjelp, men den kan ta feil og høres like sikker ut uansett.',
        },
      },
      done: 'Fra «LO» til AI på et drøyt halvt århundre. Nå vet du hvordan nettet henger sammen.',
    },
  },
};
