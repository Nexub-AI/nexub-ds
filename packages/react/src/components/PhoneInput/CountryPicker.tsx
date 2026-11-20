'use client';

// The country list of PhoneInput: its own chunk, so the closed field does not carry Radix Select.
import * as React from 'react';
import { COUNTRIES, type CountryCode } from '@nexub/core';
import type { Size } from '../../utils/control.js';
import type { SheetProp } from '../../utils/popper.js';
import { Flag } from '../Flag/Flag.js';
import { Select } from '../Select/Select.js';

export interface CountryPickerProps {
  country: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  /** Restricted list, in this order. Without it: every country, sorted by name. */
  countries?: CountryCode[];
  nameOf: (country: CountryCode) => string;
  label: string;
  className?: string;
  size?: Size;
  sheet?: SheetProp;
  disabled?: boolean;
  readOnly?: boolean;
  children: React.ReactNode;
}

export default function CountryPicker({ country, onCountryChange, countries, nameOf, label, className, size, sheet, disabled, readOnly, children }: CountryPickerProps) {
  const key = countries?.join();
  const options = React.useMemo(() => {
    const list = (countries ?? Object.keys(COUNTRIES))
      .filter((code) => COUNTRIES[code])
      .map((code) => ({ code, name: nameOf(code), cc: COUNTRIES[code]! }));
    return countries ? list : list.sort((a, b) => a.name.localeCompare(b.name));
    // `key` stands in for `countries`: callers pass a fresh array each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, nameOf]);
  // Radix Select renders its items into a hidden fragment even while closed. The trigger shows
  // its own flag and code, so a closed picker keeps only the selected item: about 240 fewer
  // items (each with a Flag) per PhoneInput on the page.
  const [open, setOpen] = React.useState(false);
  const shown = open ? options : options.filter((o) => o.code === country);
  return (
    <Select.Root value={country} onValueChange={onCountryChange} onOpenChange={setOpen} disabled={disabled}>
      <Select.Trigger aria-label={label} size={size} readOnly={readOnly} className={className}>
        {children}
      </Select.Trigger>
      <Select.Content searchable={options.length > 8} sheet={sheet} align="start" className="w-72 max-w-[calc(100vw-1rem)]">
        {shown.map((o) => (
          <Select.Item key={o.code} value={o.code} textValue={`${o.name} +${o.cc}`}>
            <span className="flex items-center gap-2">
              <Flag code={o.code} size="sm" aria-hidden="true" />
              {o.name}
              <span className="tabular-nums text-[var(--color-on-surface-muted)]">+{o.cc}</span>
            </span>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
