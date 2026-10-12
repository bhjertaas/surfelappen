/**
 * Every made-up site in the game, as registrable domains (ADR 0018). The content tests
 * only allow domains from this list in missions (plus a few real teaching domains such
 * as nrk.no). Each was checked to have no DNS address when it was added (2026-10-12), so
 * none points at a real business. Check again before adding one: `getent hosts <domain>`.
 */
export const FICTIONAL_DOMAINS = [
  // The genuine brands of Lenkevik.
  'lenkevikbanken.no',
  'pakkeposten.no',
  'lenkevik-kommune.no',
  'lenkevik-bom.no',
  'lenkevik-bibliotek.no',
  'lenkevik-post.no',
  // Scam sites, ad sites and lookalikes.
  'pakkesporing.ru',
  'lenkevikbanken-kundeservice.com',
  'premie-trekning.top',
  'sikkerhet-varsel.xyz',
  'lenkevik-kornmune.no',
  'parkering-app.net',
  'trygg-sjekk.ru',
  'betal-raskt.com',
  'tv-tilbud.com',
] as const;
