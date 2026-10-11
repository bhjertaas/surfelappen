import type { RumourMission } from '../../types.ts';

/**
 * Haien i Lenkevik (Ryktebørsen, docs/concept.md). A rumour in the family chat: react,
 * follow it back to a joke account, check the two pictures (an old photo from far away,
 * and an AI picture), then tell your aunt kindly. Encounter → decide → see what happens.
 */
export const theSharkRumour = {
  id: 'the-shark-rumour',
  building: 'rumour-exchange',
  interaction: 'rumour',
  requires: [],
  guide: 'portrait-tora',
  theme: 'noir',
  scene: 'scene-rumour',
  stickers: ['fact-checker'],
  reviewedOn: null,
  sources: [
    {
      title: 'Faktisk.no: Tenk, verktøy for kildebevissthet og kritisk mediebruk',
      url: 'https://www.tenk.faktisk.no/',
    },
    {
      title: 'Medietilsynet: Falske nyheter – kritisk medieforståelse',
      url: 'https://www.medietilsynet.no/globalassets/publikasjoner/undervisningsopplegg/falske_nyheter_kildekritikk_revidert_juni_2022.pdf',
    },
  ],
  further: [
    {
      id: 'highway-shark',
      url: 'https://www.yahoo.com/news/behind-fake-shark-photo-keeps-showing-hurricanes-164242883.html',
    },
    {
      id: 'pope',
      url: 'https://www.nbcnews.com/tech/pope-francis-ai-generated-images-fool-internet-rcna76838',
    },
    {
      id: 'survey',
      url: 'https://www.regjeringen.no/no/aktuelt/undersokelse-viser-stor-usikkerhet-om-falske-nyheter/id2547876/',
    },
    {
      id: 'image-search',
      url: 'https://www.tek.no/nyheter/guide/i/QoEpo8/avsloer-falsk-bildebruk',
    },
    { id: 'tenk', url: 'https://www.tenk.faktisk.no/' },
  ],
  steps: [
    {
      kind: 'chat',
      id: 'the-message',
      image: 'photo-shark-old',
      options: [
        { id: 'share', correct: false, spread: [1, 9, 70, 600, 4800] },
        { id: 'scold', correct: false },
        { id: 'check', correct: true },
      ],
    },
    {
      kind: 'trace',
      id: 'follow-the-trail',
      hops: [
        { id: 'randi', image: 'photo-shark-old' },
        { id: 'bente', image: 'photo-shark-old' },
        { id: 'trond', image: 'photo-shark-ai' },
        { id: 'joke-account', image: 'photo-shark-ai' },
      ],
      options: [
        { id: 'saw', correct: false },
        { id: 'council', correct: false },
        { id: 'joke', correct: true },
      ],
    },
    {
      kind: 'inspect',
      id: 'the-pictures',
      pictures: [
        {
          id: 'beach',
          image: 'photo-shark-old',
          found: true,
          answer: 'old',
          spots: [
            { id: 'palms', x: 2, y: 2, w: 44, h: 25, clue: true },
            { id: 'mountain', x: 30, y: 33, w: 30, h: 12, clue: true },
            { id: 'tower', x: 0, y: 29, w: 26, h: 34, clue: false },
            { id: 'fin', x: 59, y: 49, w: 14, h: 13, clue: false },
            { id: 'people', x: 27, y: 61, w: 30, h: 20, clue: false },
          ],
        },
        {
          id: 'selfie',
          image: 'photo-shark-ai',
          found: false,
          answer: 'ai',
          spots: [
            { id: 'fins', x: 47, y: 12, w: 16, h: 18, clue: true },
            { id: 'phone', x: 6, y: 22, w: 13, h: 19, clue: true },
            { id: 'sign', x: 62, y: 64, w: 37, h: 31, clue: true },
            { id: 'houses', x: 20, y: 30, w: 26, h: 15, clue: false },
            { id: 'mayor', x: 33, y: 45, w: 17, h: 20, clue: false },
          ],
        },
      ],
    },
    {
      kind: 'chat',
      id: 'tell-aunt-randi',
      image: 'photo-shark-old',
      options: [
        { id: 'ignore', correct: false, spread: [40, 300, 2200] },
        { id: 'scold', correct: false },
        { id: 'kind', correct: true },
      ],
    },
  ],
} as const satisfies RumourMission;
