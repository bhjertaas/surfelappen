import type { RumourText } from '../text-types.ts';
import type { theSharkRumour } from './structure.ts';

const RANDI = 'Tante Randi';
const PER = 'Onkel Per';
const RANDI_MESSAGE =
  'VIKTIG!!! Hai ved Lenkevik badestrand 🦈 Kommunen stenger stranda. IKKE la barna bade! Del med alle du kjenner ❤️';

export const theSharkRumourNb: RumourText<typeof theSharkRumour> = {
  title: 'Haien i Lenkevik',
  character: 'Tora Tvil på Ryktebørsen',
  intro: [
    'Tora Tvil, privatdetektiv. Jeg etterforsker det alle andre bare deler videre.',
    'I dag har halve Lenkevik fått samme melding: Det er hai ved badestranda, og kommunen skal stenge. Er det sant? Det finner vi ut. Ta med deg lupen.',
  ],
  learn:
    'Du lærer å spore et rykte tilbake til kilden, sjekke om et bilde er gammelt eller laget med AI, og si fra uten å krangle.',
  summary: {
    takeaway:
      'Før du deler: Hvem sa det først? Et bilde kan være gammelt eller laget med AI, så sjekk kilden, ikke bare bildet. Og når noen du er glad i deler tull, si fra vennlig og vis hvor du sjekket.',
  },
  further: {
    intro:
      'Haien i Lenkevik er oppdiktet, men historien er ikke ny. Her er noen ekte eksempler, og steder der du kan lære mer. Lenkene går til nettsteder utenfor Surfelappen.',
    items: {
      'highway-shark': {
        title: 'Haien på motorveien',
        body: 'Hver gang en orkan oversvømmer en by i USA, dukker det samme bildet opp: en hai som svømmer på en motorvei. Haien er ekte, men den er klippet inn fra et bilde tatt utenfor Sør-Afrika i 2005. Bildet har vært «sett» under minst seks orkaner siden 2011.',
        link: 'Yahoo News, 2017 (engelsk)',
      },
      pope: {
        title: 'Paven i boblejakke',
        body: 'I 2023 gikk bilder av pave Frans i en hvit boblejakke verden rundt. De var laget med AI-programmet Midjourney, og mange trodde de var ekte. Hendene og korset hans så litt rare ut, men de fleste så ikke etter.',
        link: 'NBC News, 2023 (engelsk)',
      },
      survey: {
        title: 'Har du delt noe som ikke stemte?',
        body: 'I en undersøkelse fra Medietilsynet sa nesten én av fire nordmenn at de hadde delt en nyhet som senere viste seg å være feil. 37 prosent gjorde ingenting når de mistenkte at en nyhet var falsk.',
        link: 'Regjeringen.no, 2017',
      },
      'image-search': {
        title: 'Slik søker du etter et bilde',
        body: 'Omvendt bildesøk, som du prøvde i Ryktebørsen, finnes på ekte. Med Google bildesøk eller TinEye kan du se hvor et bilde har vært før. Denne guiden viser hvordan.',
        link: 'Tek.no: Avslør falsk bildebruk',
      },
      tenk: {
        title: 'Tenk, fra Faktisk.no',
        body: 'Faktisk.no er de norske faktasjekkerne. På Tenk forklarer de hvordan du sjekker kilder, kjenner igjen falske nyheter og forstår AI.',
        link: 'Tenk.faktisk.no',
      },
    },
  },
  steps: {
    'the-message': {
      heading: 'Meldingen',
      brief:
        'Saken begynner der de fleste rykter begynner: i familiechatten. Tante Randi har sendt noe.',
      thread: 'Familiechatten',
      messages: [{ from: RANDI, body: RANDI_MESSAGE }],
      prompt: 'Hva gjør du?',
      options: {
        share: {
          label: 'Deler det med naboene. Bedre føre var!',
          outcome: [],
          spread: [
            'Du deler i nabolagsgruppa.',
            'Naboene deler med sine. «Bedre føre var!»',
            'Lokalavisa får 30 tips. Telefonen på rådhuset ringer og ringer.',
            'Badestranda er tom. Iskiosken selger ingenting en hel solskinnsdag.',
            'Folk i tre andre byer tror haien er hos dem også.',
          ],
          explain:
            'Slik sprer et rykte seg: alle mente det godt, og ingen sjekket. Å dele «for sikkerhets skyld» føles snilt, men gjør ryktet større. Spol tilbake og prøv noe annet.',
        },
        scold: {
          label: 'Svarer: «Dette er sikkert tull.»',
          says: 'Dette er sikkert tull.',
          outcome: [
            { from: RANDI, body: 'Jaså? Så du vet bedre enn kommunen nå? 🙄' },
            { from: PER, body: 'Bedre føre var, sier nå jeg.' },
          ],
          explain:
            'Kanskje har du rett, men du vet det ikke ennå, og nå står det påstand mot påstand. Sjekk først, så har du noe å vise til.',
        },
        check: {
          label: 'Venter litt. Hvor kommer dette fra?',
          outcome: [],
          explain:
            'God detektivrefleks. Et rykte blir ikke sannere av å bli delt, bare større. Du deler ingenting før du vet hvor det kommer fra.',
        },
      },
      done: 'Da følger vi sporet. Hvem har tante Randi det fra?',
    },
    'follow-the-trail': {
      heading: 'Følg sporet',
      brief:
        'Et rykte har alltid en kilde. Gå bakover, ledd for ledd, til du finner hvor det startet. Se hva som endrer seg på veien.',
      hops: {
        randi: {
          who: RANDI,
          where: 'i familiechatten, i dag kl. 14.10',
          body: RANDI_MESSAGE,
          note: 'Randi har lagt til «IKKE la barna bade!» og «Del med alle». Bildet har hun fra Bente.',
        },
        bente: {
          who: 'Bente Bakke',
          where: 'i Facebook-gruppa «Lenkevik før og nå», i dag kl. 12.45',
          body: 'Svogeren min sier kommunen stenger stranda!! Her er bildet 😱',
          note: '«Kommunen stenger stranda» står ingen steder før dette. Det kommer fra en svoger. Og bildet er et helt annet enn i leddet før.',
        },
        trond: {
          who: 'Trond T.',
          where: 'i samme gruppe, i dag kl. 11.02',
          body: 'Er dette sant?? Skjermbilde fra en kompis:',
          note: 'Et skjermbilde. Det er klippet så du ikke ser hvem som la det ut, eller hva mer som sto der.',
        },
        'joke-account': {
          who: 'Lenkevik Løgnpost',
          where:
            'på Instagram, i går kl. 21.30. Om kontoen: «Lenkeviks minst pålitelige nyheter. Ingenting her er sant.»',
          body: 'NYHETSVARSEL: Hai i Lenkevik! Haien skal ha klaget på prisen på softis. Ordføreren tok selfie. Kommunen vurderer å gi den sesongkort. 🦈🍦',
          note: 'Les om kontoen. Dette er en humorkonto. Ingen her prøvde å lure noen.',
        },
      },
      question: 'Hvordan startet ryktet?',
      options: {
        saw: {
          label: 'Noen så en hai ved stranda',
          feedback: 'Ingen i sporet så noen hai. Det første leddet er en spøk på en humorkonto.',
        },
        council: {
          label: 'Kommunen sendte ut en advarsel',
          feedback:
            'Kommunen dukker først opp hos Bente, via en svoger. Ingen av leddene har det fra kommunen selv.',
        },
        joke: {
          label: 'En spøk som ble tatt på alvor',
          feedback:
            'Nettopp. En humorkonto laget en spøk. Skjermbildet tok bort avsenderen, og hvert ledd la til litt mer alvor.',
        },
      },
      done: 'Nesten oppklart. Men bildene? Randi har ett, og Løgnposten et annet. Dem tar vi en nærmere titt på.',
    },
    'the-pictures': {
      heading: 'Bildene',
      brief:
        'Et bilde overbeviser mer enn ord. Men et ekte bilde kan likevel lyve: det kan være gammelt, fra et helt annet sted. Eller det kan være laget med AI. Søk etter bildet, og se nøye etter.',
      pictures: {
        beach: {
          intro: 'Bildet fra Bente og tante Randi.',
          found:
            'Treff! Det samme bildet ligger i en nettavis fra Hawaii, fra 2015: «Shark sighting closes Waikiki beach». Bildet er ti år gammelt og tatt på den andre siden av jorda.',
          spots: {
            palms: {
              label: 'Palmene',
              text: 'Palmer? I Lenkevik? Ikke en eneste en.',
            },
            mountain: {
              label: 'Fjellet',
              text: 'Det er Diamond Head, et kjent fjell på Hawaii. Det står ikke ved Lenkevik badestrand.',
            },
            tower: {
              label: 'Livvakttårnet',
              text: 'Et livvakttårn. Det kunne stått mange steder.',
            },
            fin: {
              label: 'Finnen',
              text: 'Det kan godt være en ekte hai. Spørsmålet er hvor og når.',
            },
            people: {
              label: 'Folkene',
              text: 'Folk som peker. Ingenting rart her.',
            },
          },
          right:
            'Riktig. Bildet er ekte, men gammelt og fra et annet sted. Det er det vanligste trikset av alle: et ekte bilde med en ny historie.',
          wrong: 'Ikke helt. Bildesøket fant det samme bildet fra 2015, på Hawaii.',
        },
        selfie: {
          intro: 'Bildet fra Løgnposten: ordføreren tar selfie med haien.',
          found:
            'Ingen treff. Bildet finnes ingen steder fra før i går. Det kan bety at det er nytt, eller at det er laget med AI.',
          spots: {
            fins: {
              label: 'Haien',
              text: 'To ryggfinner etter hverandre. En hai har én stor. Og hvithaier lever ikke i norske fjorder.',
            },
            phone: {
              label: 'Telefonen',
              text: 'Han tar selfie, men vi ser telefonen han tar bildet med. Hvem tok da dette bildet?',
            },
            sign: {
              label: 'Skiltet',
              text: 'Bokstavene ser ut som ord, men betyr ingenting. AI har ofte trøbbel med tekst i bilder.',
            },
            houses: {
              label: 'Husene',
              text: 'Ser ut som Lenkevik. Ingenting rart her.',
            },
            mayor: {
              label: 'Ordføreren',
              text: 'Et stort smil. Det beviser ingenting.',
            },
          },
          right:
            'Riktig, laget med AI. Men AI blir bedre hvert år, og snart finner du ingen feil å peke på. Da er det kilden som avslører bildet, slik som her: en humorkonto.',
          wrong:
            'Ikke helt. Bildesøket fant ingenting eldre, og bildet har feil som et ekte foto ikke har.',
        },
      },
      done: 'Saken er oppklart: en spøk, et skjermbilde og et gammelt bilde fra Hawaii. Nå gjenstår det vanskeligste: å si det til tante Randi.',
    },
    'tell-aunt-randi': {
      heading: 'Si fra',
      brief: 'Tante Randi mente det godt. Hvordan sier du fra, uten at hun føler seg dum?',
      thread: 'Familiechatten',
      messages: [
        { from: RANDI, body: RANDI_MESSAGE },
        { from: PER, body: 'Takk for at du sier fra, Randi! Delt.' },
      ],
      prompt: 'Hva svarer du?',
      options: {
        ignore: {
          label: 'Ingenting. Det er ikke mitt problem.',
          outcome: [],
          spread: [
            'Onkel Per deler videre.',
            'Ryktet når tre nye grupper.',
            'En uke senere tror halve Lenkevik fortsatt på haien.',
          ],
          explain:
            'Det er lett å la være, men stillhet lar ryktet leve videre. Du er den eneste i chatten som vet hva som er sant.',
        },
        scold: {
          label: '«Slutt å spre falske nyheter! Det der er AI og et bilde fra Hawaii.»',
          says: 'Slutt å spre falske nyheter! Det der er AI og et bilde fra Hawaii.',
          outcome: [
            { from: RANDI, body: 'Unnskyld at jeg prøvde å passe på dere da 😢' },
            { from: PER, body: 'Det var ikke så farlig, Randi.' },
          ],
          explain:
            'Du har rett i saken, men Randi føler seg dum foran hele familien, og da hører hun ikke etter. Folk tar lettere imot når de ikke blir gjort til latter.',
        },
        kind: {
          label:
            '«Takk for at du passer på oss! Jeg sjekket, og det startet som en spøk på Lenkevik Løgnpost. Bildet er fra Hawaii i 2015. Kommunen skriver at stranda er åpen: lenkevik-kommune.no»',
          says: 'Takk for at du passer på oss! Jeg sjekket, og det startet som en spøk på Lenkevik Løgnpost. Bildet er fra Hawaii i 2015. Kommunen skriver at stranda er åpen: lenkevik-kommune.no',
          outcome: [
            { from: RANDI, body: 'Å nei, så flaut! Takk, jeg sletter den med en gang 🙈' },
            { from: PER, body: 'Jeg også. Is på stranda i morgen?' },
          ],
          explain:
            'Slik gjør du det. Du takker for at hun mente det godt, sier hva du fant, og viser til kilden. Ingen taper ansikt, og ryktet stopper her.',
        },
      },
      done: 'Saken er lukket. Ryktet stoppet hos deg, og det er mer enn de fleste får til.',
    },
  },
};
