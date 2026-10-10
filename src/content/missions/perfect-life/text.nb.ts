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
  },
};
