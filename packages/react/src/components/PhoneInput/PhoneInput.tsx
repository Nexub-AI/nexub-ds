'use client';

import * as React from 'react';
import { COUNTRIES, callingCode, formatNational, parsePhone, toE164, type CountryCode } from '@nexub/core';
import { ChevronDown } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import type { Size } from '../../utils/control.js';
import type { SheetProp } from '../../utils/popper.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Flag } from '../Flag/Flag.js';
import { inputVariants, inputWrapperVariants } from '../Input/Input.js';

// Radix Select and the country list load on mount; a plain button holds the spot meanwhile.
const LazyPicker = React.lazy(() => import('./CountryPicker.js'));

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'type'> {
  /** Country to start on. Defaults to the region of the provider's locale, else `US`. */
  defaultCountry?: CountryCode;
  /** Controlled country (ISO 3166-1 alpha-2). */
  country?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
  /** Controlled E.164 value ("+919847012345"), '' when empty. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (e164: string, details: { country: CountryCode; national: string; valid: boolean }) => void;
  /** Limits the picker to these countries, in this order. One entry shows it as text. */
  countries?: CountryCode[];
  invalid?: boolean;
  /** @default 'md' */
  size?: Size;
  /** The country list as a bottom sheet: `true`, or `'auto'` for phones only. */
  sheet?: SheetProp;
}

const pickerClass = [
  'nx-hit -ms-2 my-1 h-auto w-auto shrink-0 justify-start gap-1 self-stretch px-2',
  'flex items-center rounded-shape-control border-0 bg-transparent text-[var(--color-on-surface)] shadow-none tabular-nums',
  'hover:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]',
  'focus-visible:bg-[color-mix(in_srgb,var(--color-on-surface)_12%,transparent)] focus-visible:shadow-none data-[state=open]:shadow-none',
  'aria-readonly:bg-transparent disabled:cursor-not-allowed disabled:bg-transparent disabled:text-[var(--color-text-disabled)]',
].join(' ');
const pickerText: Record<Size, string> = { sm: 'text-body-sm', md: 'text-body-md', lg: 'text-body-md' };

function localeRegion(locale: string): CountryCode {
  try {
    const region = new Intl.Locale(locale).maximize().region;
    if (region && COUNTRIES[region]) return region;
  } catch {
    // Unreadable locale: fall through.
  }
  return 'US';
}

/**
 * A phone field: country picker plus national number, grouped as you type.
 * The value is E.164. Formatting and length checks only: confirm the number on the server.
 */
export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    { defaultCountry, country: countryProp, onCountryChange, value, defaultValue, onValueChange, countries, invalid, size = 'md', sheet, name, disabled, readOnly, className, ...props },
    ref,
  ) => {
    const { locale } = useLocale();
    const messages = useNexubMessages();
    const [countryState, setCountryState] = React.useState<CountryCode>(() => {
      const start = countryProp ?? defaultCountry ?? localeRegion(locale);
      return countries?.length && !countries.includes(start) ? countries[0]! : start;
    });
    const [inner, setInner] = React.useState(defaultValue ?? '');
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const e164 = value ?? inner;
    // The value names its own country; an empty one leaves the picked country alone.
    const { country, national } = parsePhone(e164, countryProp ?? countryState);
    const cc = callingCode(country);

    const nameOf = React.useCallback(
      (code: CountryCode) => {
        try {
          return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code;
        } catch {
          return code;
        }
      },
      [locale],
    );

    const commit = (nextNational: string, nextCountry: CountryCode) => {
      const next = toE164(nextNational, nextCountry);
      setCountryState(nextCountry);
      if (nextCountry !== country) onCountryChange?.(nextCountry);
      if (next === e164) return;
      setInner(next);
      onValueChange?.(next, { country: nextCountry, national: nextNational, valid: parsePhone(next, nextCountry).valid });
    };

    // Regrouping moves the caret to the end; put it back after the same number of digits.
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, inputRef);
    // A keystroke that changes nothing (a letter) still re-renders, so the caret is restored.
    const [, rerender] = React.useReducer((n: number) => n + 1, 0);
    const caret = React.useRef<number | null>(null);
    useIsomorphicLayoutEffect(() => {
      const el = inputRef.current;
      if (caret.current === null || !el) return;
      let pos = 0;
      for (let seen = 0; seen < caret.current && pos < el.value.length; pos++) if (/\d/.test(el.value[pos]!)) seen++;
      caret.current = null;
      if (el.ownerDocument.activeElement === el) el.setSelectionRange(pos, pos);
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const international = /^\s*(\+|00)/.test(raw);
      let next = parsePhone(raw, country);
      // A pasted number from outside a restricted list stays in the current country
      // with all its digits, so it reads (and validates) as wrong instead of switching.
      if (countries?.length && !countries.includes(next.country)) next = parsePhone(raw.replace(/^[\s+0]+/, ''), country);
      const before = raw.slice(0, e.target.selectionStart ?? raw.length).replace(/\D/g, '');
      const trunk = before.startsWith('0') && !next.national.startsWith('0') ? 1 : 0;
      caret.current = international ? next.national.length : Math.max(0, before.length - trunk);
      rerender();
      commit(next.national, next.country);
    };

    const single = countries?.length === 1;
    const label = messages.countryCode(nameOf(country), cc);
    const triggerClass = cn(pickerClass, pickerText[size]);
    const picked = (
      <>
        <Flag code={country} size="sm" aria-hidden="true" />
        <span>+{cc}</span>
      </>
    );

    const pickerFallback = (
              <button type="button" aria-haspopup="listbox" aria-label={label} disabled={disabled} className={triggerClass}>
                {picked}
                <ChevronDown size="sm" className="shrink-0 text-[var(--color-on-surface-variant)]" aria-hidden="true" />
              </button>
    );
    return (
      <div className={cn(inputWrapperVariants({ size, invalid }), className)}>
        {single ? (
          <span role="img" aria-label={label} className={cn('flex shrink-0 items-center gap-1 tabular-nums text-[var(--color-on-surface-variant)]', pickerText[size])}>
            {picked}
          </span>
        ) : (
          // The picker chunk loads after mount: suspending in the first render would make the
          // server fall back to client rendering. Until then the plain trigger shows, same size.
          !mounted ? (
            pickerFallback
          ) : (
            <React.Suspense fallback={pickerFallback}>
            <LazyPicker
              country={country}
              onCountryChange={(next) => commit(national, next)}
              countries={countries}
              nameOf={nameOf}
              label={label}
              className={triggerClass}
              size={size}
              sheet={sheet}
              disabled={disabled}
              readOnly={readOnly}
            >
              {picked}
            </LazyPicker>
            </React.Suspense>
          )
        )}
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          className={inputVariants({ size })}
          aria-invalid={invalid ?? undefined}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
          ref={mergedRef}
          value={formatNational(national, country)}
          onChange={handleChange}
        />
        {name && <input type="hidden" name={name} value={e164} disabled={disabled} />}
      </div>
    );
  },
);
PhoneInput.displayName = 'PhoneInput';
