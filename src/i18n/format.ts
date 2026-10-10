/** Locale-aware formatting helpers (ADR 0005). Pure, no Preact. */

export type Locale = 'nb';

/** Replaces `{name}` placeholders. Unknown placeholders are left as they are, so they're visible. */
export function format(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

export interface PluralForms {
  readonly one: string;
  readonly other: string;
  readonly zero?: string;
}

/** Picks the plural form for `count` and fills `{count}` in it. `zero` is optional and used for 0. */
export function plural(locale: Locale, count: number, forms: PluralForms): string {
  const form =
    count === 0 && forms.zero !== undefined
      ? forms.zero
      : new Intl.PluralRules(locale).select(count) === 'one'
        ? forms.one
        : forms.other;
  return format(form, { count: formatNumber(locale, count) });
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** Formats a ratio (0–1) as a whole percent, e.g. `93 %` in Norwegian. */
export function percent(locale: Locale, ratio: number): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(
    ratio,
  );
}
