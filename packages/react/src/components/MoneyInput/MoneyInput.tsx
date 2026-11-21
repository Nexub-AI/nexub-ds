'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useIntlLocale } from '../NexubProvider/NexubProvider.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { currencySymbol, formatForDisplay, formatForEditing, parseMoney } from '../../utils/money.js';
import { Input, type InputProps } from '../Input/Input.js';

export interface MoneyInputProps
  extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'type' | 'inputMode' | 'leadingIcon' | 'leadingAddon'> {
  /** The amount, or null when empty. */
  value?: number | null;
  defaultValue?: number | null;
  /** Called with the parsed amount (rounded to the currency's minor unit) as the person types. */
  onValueChange?: (value: number | null) => void;
  /** ISO 4217 code, e.g. 'USD'. */
  currency: string;
  /** BCP 47 locale for separators. Defaults to the user's. */
  locale?: string;
  /**
   * 11.2: shown before the amount, e.g. `<CurrencySelect aria-label="Currency" value={currency}
   * onValueChange={setCurrency} />`, so people can change the currency next to the amount.
   */
  currencySlot?: React.ReactNode;
}

/**
 * An amount field: the currency symbol leads, digits are tabular, the locale's
 * separators parse correctly, and the value is grouped on blur
 * (e.g. 1234.5 → "1,234.50"). Raw while editing so the caret never jumps.
 */
export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value: valueProp, defaultValue = null, onValueChange, currency, locale: localeProp, currencySlot, onFocus, onBlur, className, ...props }, ref) => {
    const locale = useIntlLocale(localeProp);
    const [value, setValue] = useControllableState<number | null>({
      value: valueProp,
      defaultValue,
      onChange: onValueChange,
    });
    const [draft, setDraft] = React.useState<string | null>(null); // non-null while focused
    const shown =
      draft ?? (value == null ? '' : formatForDisplay(value, currency, locale));

    const input = (
      <Input
        ref={ref}
        inputMode="decimal"
        autoComplete="off"
        leadingIcon={<span aria-hidden="true" className="text-body-md">{currencySymbol(currency, locale)}</span>}
        className={cn('tabular-nums', className)}
        value={shown}
        onFocus={(e) => {
          // Read-only keeps the grouped display: there is nothing to edit.
          if (!props.readOnly) setDraft(value == null ? '' : formatForEditing(value, currency, locale));
          onFocus?.(e);
        }}
        onChange={(e) => {
          setDraft(e.target.value);
          const next = parseMoney(e.target.value, currency, locale);
          if (next !== value) setValue(next);
        }}
        onBlur={(e) => {
          setDraft(null);
          onBlur?.(e);
        }}
        {...props}
      />
    );
    if (!currencySlot) return input;
    return (
      <div className="flex w-full gap-2">
        <div className="w-32 shrink-0">{currencySlot}</div>
        <div className="min-w-0 flex-1">{input}</div>
      </div>
    );
  },
);
MoneyInput.displayName = 'MoneyInput';
