import { describe, expect, it } from 'vitest';
import { findTheImpostor } from '../../content/missions/find-the-impostor/structure.ts';
import { splitAddress } from './address.ts';

describe('splitAddress', () => {
  it('splits a subdomain trick', () => {
    expect(
      splitAddress(
        'https://pakkeposten.example.sporing-levering.example/pakke/7731',
        'pakkeposten.example.sporing-levering.example',
        'sporing-levering.example',
      ),
    ).toEqual({
      scheme: 'https://',
      subdomains: 'pakkeposten.example.',
      site: 'sporing-levering.example',
      rest: '/pakke/7731',
    });
  });

  it('handles a bare site with only a slash', () => {
    expect(
      splitAddress(
        'https://fjordbanken-kundeservice.example/',
        'fjordbanken-kundeservice.example',
        'fjordbanken-kundeservice.example',
      ),
    ).toEqual({
      scheme: 'https://',
      subdomains: '',
      site: 'fjordbanken-kundeservice.example',
      rest: '/',
    });
  });

  it('rejects a site that is not part of the host', () => {
    expect(() => splitAddress('https://a.example/', 'a.example', 'b.example')).toThrow();
  });

  for (const step of findTheImpostor.steps) {
    if (step.kind !== 'case') continue;
    it(`reassembles ${step.id}`, () => {
      const parts = splitAddress(step.url, step.expectedHost, step.expectedSite);
      expect(parts.scheme + parts.subdomains + parts.site + parts.rest).toBe(step.url);
      expect(parts.site).toBe(step.expectedSite);
    });
  }
});
