import countries from 'world-countries';
import type { Country as WorldCountry } from 'world-countries';

import type { DropdownOption } from '@/types';

export type CountryCreatePayload = {
  name: string;
  iso_code: string;
  currency: string;
};

export type CountryCreateFormOption = DropdownOption & {
  meta: CountryCreatePayload;
};

function primaryCurrencyCode(country: WorldCountry): string | null {
  const keys = Object.keys(country.currencies ?? {});
  return keys[0] ?? null;
}

function toMeta(country: WorldCountry): CountryCreatePayload | null {
  const currency = primaryCurrencyCode(country);
  const name = country.name?.common?.trim();
  const iso_code = country.cca2?.trim().toUpperCase();
  if (!currency || !name || !iso_code) return null;

  return {
    name,
    iso_code,
    currency: currency.toUpperCase(),
  };
}

/** Options for country create flow: name, ISO code, and currency from `world-countries`. */
export function getCountryCreateFormOptions(): CountryCreateFormOption[] {
  return countries
    .map((country) => {
      const meta = toMeta(country);
      if (!meta) return null;
      return {
        label: `${meta.name} (${meta.iso_code})`,
        value: meta.iso_code,
        meta,
      };
    })
    .filter((row): row is CountryCreateFormOption => row !== null)
    .sort((a, b) => a.label.localeCompare(b.label));
}
