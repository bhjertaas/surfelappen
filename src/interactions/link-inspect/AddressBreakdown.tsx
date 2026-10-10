import { useI18n } from '../../i18n/i18n.ts';
import { splitAddress } from './address.ts';

interface Props {
  url: string;
  host: string;
  site: string;
}

/** The address with the real site marked by bold, underline and a text label (never colour alone). */
export function AddressBreakdown({ url, host, site }: Props) {
  const { m } = useI18n();
  const parts = splitAddress(url, host, site);
  return (
    <div class="address">
      <h3>{m.linkInspect.addressHeading}</h3>
      <p class="address__url">
        <span>{parts.scheme}</span>
        <span>{parts.subdomains}</span>
        <strong class="address__site">{parts.site}</strong>
        <span>{parts.rest}</span>
      </p>
      <p>
        {m.linkInspect.siteLabel}: <strong class="address__site">{parts.site}</strong>
      </p>
      <p class="address__explain">{m.linkInspect.siteExplain}</p>
    </div>
  );
}
