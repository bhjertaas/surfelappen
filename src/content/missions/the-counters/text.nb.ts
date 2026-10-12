import type { LinkInspectText } from '../text-types.ts';
import type { theCounters } from './structure.ts';

export const theCountersNb: LinkInspectText<typeof theCounters> = {
  title: 'Skrankene',
  character: 'Saksbehandler Stempelsen på Lisenskontoret',
  intro: [
    'God dag. Stempelsen, saksbehandler. Du har kommet for å få stemplet surfelappen, ser jeg.',
    'Det er fire skranker. Én for hvert hus i byen. Svarer du riktig ved alle fire, får du stempelet. Svarer du feil, forklarer jeg, og så prøver du igjen. Vi har god tid. Vi har alltid god tid her.',
  ],
  learn:
    'Du viser at du kan det du har lært i byen, i nye situasjoner: på nettet, mot svindel, bak fasaden og i rykteflommen.',
  summary: {
    takeaway:
      'Skriv adressen selv. Se rett før første skråstrek. Husk at gratis apper tjener på deg. Spør hvem som sa det først, og si fra vennlig. Surfelappen er stemplet!',
  },
  steps: {
    'counter-1': {
      heading: 'Luke 1: Nettet',
      body: [
        'Stempelsen bretter opp ermene. «Luke 1. Grunnleggende nettkunnskap. Tre spørsmål. Ingen hint. Det står i reglementet.»',
      ],
    },
    shortcut: {
      prompt: 'Du vil sjekke været på yr.no. Hva er den korteste veien dit?',
      options: {
        a: 'Søke etter «yr» og trykke på det øverste treffet',
        b: 'Skrive yr.no rett i adresselinja',
        c: 'Spørre en KI-chatbot om å lenke til yr',
      },
      feedback: {
        a: 'Det øverste treffet kan være en annonse. Og du vet jo adressen!',
        b: 'Rett dit, uten omvei og uten annonser.',
        c: 'Det virker, men det er en lang omvei. Og en chatbot kan finne på adresser som ikke finnes.',
      },
    },
    browser: {
      prompt: 'Barnebarnet sier «Åpne Safari». Hva er Safari?',
      options: {
        a: 'En søkemotor, som Google',
        b: 'Et nettsted for reiser',
        c: 'En nettleser, programmet du ser nettsider i',
      },
      feedback: {
        a: 'Nesten. Safari er programmet. Google er en side du kan besøke i det.',
        b: 'Det høres sånn ut, men Safari er nettleseren på iPhone, iPad og Mac.',
        c: 'Riktig. Safari er en nettleser, akkurat som Chrome og Edge.',
      },
    },
    domain: {
      prompt: 'Hvem er du hos i adressen *https://www.lenkevik-bibliotek.no/lån/bøker*?',
      options: {
        a: 'www',
        b: 'lenkevik-bibliotek.no',
        c: 'bøker',
      },
      feedback: {
        a: 'www er bare en gammel vane. Se etter navnet med .no på slutten.',
        b: 'Ja. Domenet forteller hvem du er hos. Resten er hvilken side hos dem.',
        c: 'Det er bare hvilken side hos dem. Domenet står foran den første skråstreken.',
      },
    },
    'counter-2': {
      heading: 'Luke 2: Svindel',
      body: [
        '«Luke 2», mumler Stempelsen og tar fram lupen. «Her kommer de fleste til kort. Ikke deg, håper jeg.»',
      ],
    },
    toll: {
      prompt:
        'SMS: «Du har en ubetalt bompengefaktura. Betal her: *https://lenkevik-bom-no.betal-raskt.com/faktura*». Hvilket nettsted ville du kommet til?',
      options: {
        a: 'Lenkevik Bom (lenkevik-bom.no)',
        b: 'Et annet nettsted: betal-raskt.com',
        c: 'Det kan man ikke vite ut fra adressen',
      },
      feedback: {
        a: 'Lenkevik Bom står først, men det er bare pynt. Rett før skråstreken (eller helt på slutten) står betal-raskt.com.',
        b: 'Riktig. Navnet foran er pynt. Nettstedet står helt til slutt.',
        c: 'Det kan du faktisk se: helt til slutt står betal-raskt.com.',
      },
    },
    padlock: {
      prompt: 'Det er en hengelås ved adressen. Hva betyr den?',
      options: {
        a: 'At ingen underveis kan lese med, ikke at siden er ærlig',
        b: 'At siden er sjekket og trygg',
        c: 'At banken din har godkjent siden',
      },
      feedback: {
        a: 'Riktig. Svindelsider har også hengelås.',
        b: 'Dessverre ikke. Svindelsider har også hengelås. Den betyr bare at forbindelsen er kryptert.',
        c: 'Nei. Hengelåsen sier ingenting om hvem som står bak siden.',
      },
    },
    oops: {
      prompt:
        'Du skrev inn passordet til nettbanken på en side som viste seg å være falsk. Hva gjør du?',
      options: {
        a: 'Venter og ser om noe skjer',
        b: 'Svarer på meldingen og ber dem slette passordet',
        c: 'Ringer banken på nummeret på kortet, og bytter passord',
      },
      feedback: {
        a: 'Svindlere venter ikke. Jo raskere banken får vite det, jo bedre.',
        b: 'Da snakker du med svindlerne. Ta kontakt med banken på en måte du vet er ekte.',
        c: 'Riktig. Ring banken på et nummer du vet er ekte, og bytt passord. Det er ingen skam å bli lurt.',
      },
    },
    'counter-3': {
      heading: 'Luke 3: Fasaden',
      body: [
        '«Luke 3.» Stempelsen ser på deg over brillekanten. «Har du sett hvor fint folk har det på nett? Hm. Vi får se om du ser bak det.»',
      ],
    },
    'free-apps': {
      prompt: 'Hvordan tjener gratis-apper som Instagram og TikTok penger?',
      options: {
        a: 'På reklame som er tilpasset det de vet om deg',
        b: 'Staten betaler dem',
        c: 'De tjener ingenting, de er drevet av ildsjeler',
      },
      feedback: {
        a: 'Riktig. Jo lenger du blir, og jo mer de vet, jo mer kan de ta betalt for reklamen.',
        b: 'Nei, de tjener penger på reklame. Og jo mer de vet om deg, jo mer er reklameplassen verdt.',
        c: 'Dessverre ikke. Det er noen av verdens mest lønnsomme selskaper, og pengene kommer fra reklame.',
      },
    },
    cream: {
      prompt:
        'En influencer viser en ansiktskrem: «Elsker denne! Bruk koden LINA20.» Det står ikke «reklame». Hva tenker du?',
      options: {
        a: 'Hun liker kremen, ellers ville hun ikke vist den',
        b: 'En rabattkode er et tegn på at det kan være reklame',
        c: 'Det er ulovlig med reklame på sosiale medier',
      },
      feedback: {
        a: 'Kanskje, men rabattkoden tyder på at hun tjener penger på det du kjøper.',
        b: 'Riktig. En egen rabattkode betyr ofte at hun får betalt. Reklame skal merkes, men det glemmes.',
        c: 'Reklame er lov, men den skal merkes tydelig. Rabattkoden er et hint om at dette kan være reklame.',
      },
    },
    feed: {
      prompt: 'Feeden er full av perfekte liv, og du føler deg litt verdiløs. Hva hjelper?',
      options: {
        a: 'Å scrolle videre til det blir bedre',
        b: 'Å legge ut et enda finere bilde selv',
        c: 'Å slutte å følge noen, trykke «ikke interessert» og følge mer variert',
      },
      feedback: {
        a: 'Feeden gir deg mer av det du blir værende ved. Scroller du videre, får du mer av det samme.',
        b: 'Da blir du en del av fasaden selv. Det hjelper sjelden.',
        c: 'Riktig. Feeden lærer av det du gjør, så du kan lære den noe annet.',
      },
    },
    'counter-4': {
      heading: 'Luke 4: Rykter',
      body: [
        '«Siste luke.» Stempelsen senker stemmen. «Jeg hørte at det er hai ved badestranda. Neida. Bare tuller. Tre spørsmål til.»',
      ],
    },
    'first-check': {
      prompt: 'En sjokkerende video deles i alle chatter. Hva sjekker du først?',
      options: {
        a: 'Hvor mange som har delt den',
        b: 'Hvem som la den ut først',
        c: 'Om den har god bildekvalitet',
      },
      feedback: {
        a: 'Mange delinger gjør ikke noe sannere, bare større.',
        b: 'Riktig. Finn kilden. Er den til å stole på, eller er det en spøk, en reklame eller noen som vil lure deg?',
        c: 'Både ekte og falske videoer kan ha god kvalitet, særlig nå som KI blir bedre.',
      },
    },
    'old-picture': {
      prompt:
        'Et bildesøk finner det samme «flombildet» i en nettavis fra 2016, fra et helt annet land. Hva betyr det?',
      options: {
        a: 'Gammelt bilde, ny historie',
        b: 'Bildet er laget med KI',
        c: 'Det er ekte og nytt',
      },
      feedback: {
        a: 'Riktig. Et ekte bilde kan likevel lyve, hvis det fortelles om noe annet.',
        b: 'Et KI-bilde ville sjelden ligget i en avis fra 2016. Dette er et gammelt bilde i en ny historie.',
        c: 'Det er ekte, men ikke nytt, og ikke herfra.',
      },
    },
    uncle: {
      prompt: 'Onkelen din deler en artikkel du vet ikke stemmer. Hva gjør du?',
      options: {
        a: 'Skriver «FAKE NEWS» under innlegget hans',
        b: 'Lar det være, det er ikke ditt problem',
        c: 'Sier fra vennlig og viser hvor du sjekket',
      },
      feedback: {
        a: 'Da blir han nok sur og forsvarer seg. Det er lettere å ta imot når man ikke blir gjort til latter.',
        b: 'Da lever ryktet videre. Du er kanskje den eneste som vet bedre.',
        c: 'Riktig. Vennlig, kort og med en kilde. Da kan han ombestemme seg uten å tape ansikt.',
      },
    },
    stamped: {
      heading: 'Stemplet!',
      body: [
        'Stempelsen dypper stempelet i blekket, holder det høyt i luften, og: *KLONK*.',
        '«Godkjent. Surfelappen er din. Ikke fortell noen at jeg smilte.»',
      ],
    },
  },
};
