import type { LinkInspectMission, ThreeOptions } from '../../types.ts';

const A: ThreeOptions = [
  { id: 'a', correct: true },
  { id: 'b', correct: false },
  { id: 'c', correct: false },
];
const B: ThreeOptions = [
  { id: 'a', correct: false },
  { id: 'b', correct: true },
  { id: 'c', correct: false },
];
const C: ThreeOptions = [
  { id: 'a', correct: false },
  { id: 'b', correct: false },
  { id: 'c', correct: true },
];

/**
 * Sikkerhet (Lenkevikbanken): everyday security, plainly told. Passwords and a password
 * manager, two-step login, codes on the phone, updates, app permissions, backups and
 * public Wi-Fi. Each question shows what happens; wrong answers are tried again. Built
 * from link-inspect choice and info steps, like Skrankene. Not needed for the licence.
 */
export const securityBasics = {
  id: 'security-basics',
  building: 'bank',
  interaction: 'link-inspect',
  requires: [],
  guide: 'portrait-gandalf',
  theme: 'terminal',
  scene: 'scene-security',
  stickers: ['secure'],
  reviewedOn: null,
  sources: [
    {
      title: 'Helsedirektoratet (Normen): eksempel på gode passord',
      url: 'https://www.helsedirektoratet.no/normen/passord-og-passordhandtering-faktaark-31/eksempel-pa-gode-passord',
    },
    { title: 'Store norske leksikon: passord', url: 'https://snl.no/passord_-_IT' },
  ],
  further: [
    { id: 'pwned', url: 'https://haveibeenpwned.com/' },
    { id: 'dns4eu', url: 'https://joindns4.eu/for-public' },
    {
      id: 'passphrase',
      url: 'https://www.tek.no/nyheter/guide/i/LAe0kR/sikre-passord-er-de-letteste-aa-huske',
    },
  ],
  steps: [
    { kind: 'choice', id: 'strong-password', options: C },
    { kind: 'choice', id: 'reuse', options: B },
    { kind: 'info', id: 'password-manager' },
    { kind: 'choice', id: 'two-step', options: B },
    { kind: 'choice', id: 'code-call', options: B },
    { kind: 'choice', id: 'update', options: A },
    { kind: 'choice', id: 'permissions', options: B },
    { kind: 'choice', id: 'backup', options: B },
    { kind: 'choice', id: 'wifi', options: B },
    { kind: 'info', id: 'extra' },
  ],
} as const satisfies LinkInspectMission;
