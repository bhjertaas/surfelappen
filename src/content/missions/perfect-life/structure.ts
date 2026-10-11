import type { FacadeMission } from '../../types.ts';

/** Det perfekte livet (docs/concept.md, Fasaden). Rects are in room-reality's 1536×1024 space. */
export const perfectLife = {
  id: 'perfect-life',
  building: 'facade',
  interaction: 'facade',
  requires: [],
  guide: 'portrait-mira',
  theme: 'comic',
  scene: 'scene-facade',
  stickers: ['behind-the-facade', 'ad-hunter'],
  reviewedOn: null,
  sources: [
    {
      title: 'Forbrukertilsynet: markedsføring og reklame i sosiale medier',
      url: 'https://www.forbrukertilsynet.no/',
    },
    {
      title: 'Prop. 134 L (2020–2021): merking av retusjert reklame',
      url: 'https://www.regjeringen.no/no/dokumenter/prop.-134-l-20202021/id2842301/',
    },
  ],
  further: [
    { id: 'free', url: 'https://www.forbrukerradet.no/out-of-control/' },
    {
      id: 'instagram',
      url: 'https://www.npr.org/2021/10/05/1043194385/whistleblowers-testimony-facebook-instagram',
    },
    {
      id: 'tiktok',
      url: 'https://www.amnesty.org/en/latest/news/2023/11/tiktok-risks-pushing-children-towards-harmful-content/',
    },
    { id: 'myanmar', url: 'https://www.bbc.com/news/world-asia-46105934' },
    {
      id: 'cambridge-analytica',
      url: 'https://www.theguardian.com/news/2018/mar/17/cambridge-analytica-facebook-influence-us-election',
    },
    { id: 'polarisation', url: 'https://www.nature.com/articles/d41586-023-02420-z' },
  ],
  steps: [
    {
      kind: 'compose',
      id: 'make-the-picture',
      image: 'room-reality',
      width: 1536,
      height: 1024,
      subject: { x: 640, y: 270, w: 200, h: 300 },
      mess: [
        { id: 'kitchen', rect: { x: 0, y: 150, w: 330, h: 874 } },
        { id: 'tripod', rect: { x: 330, y: 440, w: 280, h: 584 } },
        { id: 'clock', rect: { x: 1140, y: 40, w: 130, h: 130 } },
        { id: 'softbox', rect: { x: 1290, y: 0, w: 246, h: 230 } },
        { id: 'ring-light', rect: { x: 1150, y: 200, w: 100, h: 520 } },
        { id: 'laundry', rect: { x: 1020, y: 280, w: 516, h: 500 } },
        { id: 'crisps', rect: { x: 820, y: 780, w: 300, h: 244 } },
        { id: 'laptop', rect: { x: 1120, y: 690, w: 340, h: 300 } },
      ],
      frameSizes: [1024, 720, 560, 400],
      captions: [
        { id: 'nofilter', likes: 4800 },
        { id: 'plain', likes: 2100 },
        { id: 'honest', likes: 900 },
      ],
    },
    {
      kind: 'sort',
      id: 'ad-hunt',
      posts: [
        { id: 'shake', image: 'post-sponsored', verdict: 'ad', role: 'main' },
        { id: 'yoga', image: 'post-routine', verdict: 'not-ad', role: 'main' },
        {
          id: 'serum',
          image: 'post-serum',
          verdict: 'ad',
          label: 'reklame',
          retouchMark: true,
          role: 'main',
        },
        { id: 'cabin', image: 'post-cabin', verdict: 'not-ad', role: 'main' },
        { id: 'beach', image: 'post-beach', verdict: 'ad', role: 'main' },
        { id: 'gamer', image: 'post-gamer', verdict: 'ad', role: 'transfer' },
        { id: 'taco', image: 'post-taco', verdict: 'not-ad', role: 'transfer' },
      ],
    },
    {
      kind: 'feed',
      id: 'train-the-feed',
      posts: [
        { id: 'routine', category: 'glossy', image: 'post-routine' },
        { id: 'beach', category: 'glossy', image: 'post-beach' },
        { id: 'shake', category: 'glossy', image: 'post-sponsored' },
        { id: 'serum', category: 'glossy', image: 'post-serum' },
        { id: 'cabin', category: 'friends', image: 'post-cabin' },
        { id: 'taco', category: 'friends', image: 'post-taco' },
        { id: 'climbing', category: 'hobby', image: 'post-climbing' },
        { id: 'football', category: 'hobby', image: 'post-football' },
        { id: 'cat', category: 'funny', image: 'post-cat' },
        { id: 'dog', category: 'funny', image: 'post-dog' },
      ],
      rounds: 3,
      feedSize: 6,
      sara: { glossy: 9, friends: 1, hobby: 0, funny: 0 },
      suggestions: [
        { id: 'climbing-club', category: 'hobby' },
        { id: 'cat-account', category: 'funny' },
        { id: 'ida', category: 'friends' },
      ],
      goal: 2,
    },
  ],
} as const satisfies FacadeMission;
