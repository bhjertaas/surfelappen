import type { WebMission } from '../../types.ts';

/**
 * Hva er egentlig nettet? (Kafé Krøllalfa, docs/concept.md). The basics before Agnbua:
 * browser vs search engine vs site, the address bar, reading an address, how a request
 * travels, and a little history. Real names (NRK, the search engines) are used on purpose
 * here: the point is to recognise the real thing. The toy browser never loads anything.
 */
export const howTheNetWorks = {
  id: 'how-the-net-works',
  building: 'cafe',
  interaction: 'web',
  requires: [],
  guide: 'portrait-ivar',
  theme: 'retroweb',
  scene: 'scene-cafe',
  stickers: ['web-explorer'],
  reviewedOn: null,
  sources: [
    {
      title: 'CERN: Twenty years of a free, open web',
      url: 'https://home.cern/news/news/computing/twenty-years-free-open-web',
    },
    {
      title: 'Store norske leksikon: internett',
      url: 'https://snl.no/internett',
    },
  ],
  steps: [
    {
      kind: 'classify',
      id: 'who-is-who',
      cards: [
        { id: 'chrome', bin: 'browser' },
        { id: 'google', bin: 'search' },
        { id: 'nrk', bin: 'site' },
        { id: 'safari', bin: 'browser' },
        { id: 'ecosia', bin: 'search' },
        { id: 'yr', bin: 'site' },
        { id: 'edge', bin: 'browser' },
        { id: 'bing', bin: 'search' },
        { id: 'wikipedia', bin: 'site' },
      ],
    },
    {
      kind: 'browser',
      id: 'shortcut',
      target: 'nrk.no',
      keywords: ['nrk'],
      adHost: 'tv-tilbud.example',
      engines: [
        { id: 'google', host: 'google.com' },
        { id: 'bing', host: 'bing.com' },
        { id: 'duckduckgo', host: 'duckduckgo.com' },
        { id: 'ecosia', host: 'ecosia.org', trees: true },
      ],
    },
    {
      kind: 'address',
      id: 'read-the-address',
      addresses: [
        {
          id: 'web',
          parts: [
            { id: 'scheme', text: 'https://' },
            { id: 'www', text: 'www.' },
            { id: 'domain', text: 'nrk.no' },
            { id: 'path', text: '/sport' },
          ],
          answer: 'domain',
        },
        {
          id: 'email',
          parts: [
            { id: 'name', text: 'kari' },
            { id: 'at', text: '@' },
            { id: 'domain', text: 'epost.example' },
          ],
          answer: 'domain',
        },
        {
          id: 'search',
          parts: [
            { id: 'scheme', text: 'https://' },
            { id: 'domain', text: 'google.com' },
            { id: 'path', text: '/search' },
            { id: 'query', text: '?q=nrk' },
          ],
          answer: 'query',
        },
      ],
    },
    {
      kind: 'journey',
      id: 'packet-trip',
      nodes: [
        { id: 'you', x: 120, y: 30 },
        { id: 'home', x: 120, y: 95 },
        { id: 'provider', x: 120, y: 160 },
        { id: 'oslo', x: 55, y: 240, side: 'left' },
        { id: 'bergen', x: 185, y: 240 },
        { id: 'server', x: 120, y: 325 },
      ],
      cables: [
        ['you', 'home'],
        ['home', 'provider'],
        ['provider', 'oslo'],
        ['oslo', 'server'],
        ['provider', 'bergen'],
        ['bergen', 'server'],
        ['oslo', 'bergen'],
      ],
      from: 'you',
      to: 'server',
      cut: ['provider', 'oslo'],
      ip: '203.0.113.42',
    },
    {
      kind: 'timeline',
      id: 'time-travel',
      events: [
        { id: 'arpanet', year: 1969, image: 'history-arpanet', voice: 'voice-arpanet' },
        { id: 'email', year: 1971, image: 'history-email', voice: 'voice-email' },
        { id: 'norsar', year: 1973, image: 'history-norsar', voice: 'voice-norsar' },
        { id: 'tcpip', year: 1983, image: 'history-tcpip', voice: 'voice-tcpip' },
        { id: 'web', year: 1989, image: 'history-web', voice: 'voice-web' },
        { id: 'free-web', year: 1993, image: 'history-free-web', voice: 'voice-free-web' },
        { id: 'google', year: 1998, image: 'history-google', voice: 'voice-google' },
        { id: 'social', year: 2004, image: 'history-social', voice: 'voice-social' },
        { id: 'smartphone', year: 2007, image: 'history-smartphone', voice: 'voice-smartphone' },
        { id: 'ai', year: 2022, image: 'history-ai', voice: 'voice-ai' },
      ],
    },
  ],
} as const satisfies WebMission;
