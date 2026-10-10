/**
 * Splits an address into the parts the feedback shows (ADR 0013), using the
 * host and real site from content (verified against the URL parser and the
 * Public Suffix List by the content tests).
 *
 *   https://  pakkeposten.example.  sporing-levering.example  /pakke/7731
 *   scheme    subdomains            site                      rest
 */
export interface AddressParts {
  readonly scheme: string;
  /** Everything in the host before the site, including the trailing dot; may be empty. */
  readonly subdomains: string;
  readonly site: string;
  /** Path, query and fragment; may be empty. */
  readonly rest: string;
}

export function splitAddress(url: string, host: string, site: string): AddressParts {
  const schemeEnd = url.indexOf('//');
  if (schemeEnd < 0) throw new Error(`No scheme in ${url}`);
  const scheme = url.slice(0, schemeEnd + 2);
  const afterScheme = url.slice(scheme.length);
  if (!afterScheme.toLowerCase().startsWith(host))
    throw new Error(`${url} does not start with ${host}`);
  if (host !== site && !host.endsWith(`.${site}`)) throw new Error(`${host} is not on ${site}`);
  return {
    scheme,
    subdomains: host.slice(0, host.length - site.length),
    site,
    rest: afterScheme.slice(host.length),
  };
}
