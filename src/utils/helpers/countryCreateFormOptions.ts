import type { CountryCode } from 'libphonenumber-js/core';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import countries from 'world-countries';
import type { Country as WorldCountry } from 'world-countries';

import type { DropdownOption } from '@/types';

export type CountryCreatePayload = {
  name: string;
  code: string;
  iso_code: string;
  currency: string;
};

export type CountryCreateFormOption = DropdownOption & {
  meta: CountryCreatePayload;
};

const phoneSupportedIso2 = new Set(getCountries() as string[]);

function primaryCurrencyCode(country: WorldCountry): string | null {
  const keys = Object.keys(country.currencies ?? {});
  return keys[0] ?? null;
}

function dialCodeDigits(country: WorldCountry): string {
  const iso2 = country.cca2;
  if (phoneSupportedIso2.has(iso2)) {
    return getCountryCallingCode(iso2 as CountryCode);
  }

  const root = (country.idd?.root ?? '').replace(/\D/g, '');
  const firstSuffix = country.idd?.suffixes?.[0]?.replace(/\D/g, '') ?? '';
  if (root && firstSuffix) return `${root}${firstSuffix}`;
  if (root) return root;
  if (firstSuffix) return firstSuffix;
  return '';
}

function toMeta(country: WorldCountry): CountryCreatePayload | null {
  const currency = primaryCurrencyCode(country);
  const code = dialCodeDigits(country);
  const name = country.name?.common?.trim();
  if (!currency || !code || !name) return null;

  return {
    name,
    code,
    iso_code: country.cca2,
    currency,
  };
}

/** Options for country create flow: metadata from `world-countries`, dial codes aligned with `react-phone-number-input` where available. */
export function getCountryCreateFormOptions(): CountryCreateFormOption[] {
  return countries
    .map((country) => {
      const meta = toMeta(country);
      if (!meta) return null;
      return {
        label: meta.name,
        value: meta.iso_code,
        meta,
      };
    })
    .filter((row): row is CountryCreateFormOption => row !== null)
    .sort((a, b) => a.label.localeCompare(b.label));
}
