import React from 'react';
import {
  PhoneInput,
  type PhoneInputRefType,
  defaultCountries,
  parseCountry,
  type CountryData,
} from 'react-international-phone';
import 'react-international-phone/style.css';

import { cn } from '@/libs';
import { ErrorText } from '../Text';

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  label?: React.ReactNode;
  options?: unknown[];
  selectedVal?: string;
  handleChange?: (value: string) => void;
  id?: string;
  isRequired?: boolean;
  name?: string;
  /** Compatible with react-hook-form FieldError, ErrorText, etc. */
  error?: any;
  maxLength?: number;
  placeholder?: string;
  hint?: React.ReactNode;
}

/**
 * Normalize "+233-559617908" or "+233559617908" to E.164 "+233559617908"
 * for react-international-phone value prop.
 */
function toE164(val: string): string {
  if (!val) return '';
  return val.replace(/-/, '');
}

/**
 * Return phone number in E.164 format without hyphens (e.g., "+233559617908")
 */
function toLegacyFormat(phone: string): string {
  if (!phone) return '';
  // Return phone number directly in E.164 format (already formatted by react-international-phone)
  return phone;
}

/** Ghana has no mask in the default dataset, so the library allows 12 digit slots — real mobiles are 9 digits. */
const GHANA_NATIONAL_MASK = '... ... ...';

const countriesWithGhanaMask: CountryData[] = defaultCountries.map(
  (country) => {
    const parsed = parseCountry(country);
    if (parsed.iso2 === 'gh') {
      return ['Ghana', 'gh', '233', GHANA_NATIONAL_MASK];
    }
    return country;
  }
);

export const BasePhoneInput = React.forwardRef<PhoneInputRefType, InputProps>(
  (
    {
      options,
      id,
      error,
      selectedVal,
      handleChange,
      label,
      isRequired,
      name,
      maxLength,
      disabled,
      placeholder = 'Enter number',
      hint,
      onBlur,
    },
    ref
  ) => {
    const value = toE164(selectedVal ?? '');
    void options;

    return (
      <div className={cn('grid w-full gap-2')}>
        {label ? (
          <label
            className="flex gap-1 items-center text-[#151819] text-sm"
            htmlFor={id}
          >
            {label}
            {isRequired && <span className="text-error"> *</span>}
          </label>
        ) : null}
        <div
          className={cn(
            'flex h-12 w-full min-w-0 items-center rounded-lg border border-[#d0d5dd] px-3 transition-colors overflow-hidden',
            'focus-within:border-primary-400 focus-within:outline-none focus-within:ring-1 focus-within:ring-primary-400',
            error && 'border-red-500',
            disabled && 'cursor-not-allowed bg-gray-50 opacity-50'
          )}
        >
          <PhoneInput
            ref={ref}
            defaultCountry="gh"
            countries={countriesWithGhanaMask}
            value={value}
            onChange={(phone: string) => {
              if (!handleChange) return;
              if (!phone) {
                handleChange('');
                return;
              }
              const formatted = toLegacyFormat(phone);
              handleChange(formatted);
            }}
            preferredCountries={['gh']}
            disabled={disabled}
            placeholder={placeholder}
            name={name}
            inputProps={
              {
                maxLength,
                'data-testid': 'phoneNumber',
                onBlur,
              } as React.InputHTMLAttributes<HTMLInputElement>
            }
            className="flex-1 min-w-0 [&_.react-international-phone-input-container]:border-0! [&_.react-international-phone-input-container]:rounded-none! [&_.react-international-phone-input-container]:bg-transparent! [&_.react-international-phone-country-selector-button]:border-0! [&_.react-international-phone-country-selector-button]:bg-transparent! [&_.react-international-phone-input]:border-0! [&_.react-international-phone-input]:outline-none! [&_.react-international-phone-input]:shadow-none!"
            inputClassName={cn(
              '!border-0 min-w-0 flex-1 bg-transparent text-sm font-light outline-none placeholder:text-gray-400'
            )}
            inputStyle={{ border: 'none' }}
            countrySelectorStyleProps={{
              buttonStyle: {
                border: 'none',
                borderRight: '1px solid #e5e7eb',
                paddingRight: '12px',
                marginRight: '12px',
                borderRadius: 0,
              },
              buttonClassName:
                '!border-0 flex h-full shrink-0 items-center gap-2 bg-transparent cursor-pointer outline-none',
            }}
            dialCodePreviewStyleProps={{
              style: { border: 'none', marginRight: 0 },
              className: '!border-0 text-sm text-gray-800',
            }}
            style={
              {
                '--react-international-phone-height': '48px',
                '--react-international-phone-border-color': 'transparent',
                '--react-international-phone-country-selector-border-color':
                  'transparent',
                '--react-international-phone-dial-code-preview-border-color':
                  'transparent',
                '--react-international-phone-country-selector-arrow-color':
                  '#6b7280',
              } as React.CSSProperties
            }
          />
        </div>
        {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
        {error ? <ErrorText error={error} /> : null}
      </div>
    );
  }
);

BasePhoneInput.displayName = 'BasePhoneInput';
