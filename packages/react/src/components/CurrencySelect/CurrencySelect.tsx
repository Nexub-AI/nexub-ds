'use client';

import * as React from 'react';
import { currencySymbol } from '../../utils/money.js';
import { useIntlLocale } from '../NexubProvider/NexubProvider.js';
import { ComboboxField, ComboboxPicker, type ComboboxFieldProps, type ComboboxOption, type ComboboxPickerProps } from '../ComboboxField/ComboboxField.js';

// Used when the runtime has no Intl.supportedValuesOf (older Safari): the most traded currencies.
const FALLBACK = 'USD EUR JPY GBP CNY AUD CAD CHF HKD SGD SEK KRW NOK NZD INR MXN TWD ZAR BRL DKK PLN THB ILS IDR CZK AED TRY HUF CLP SAR PHP MYR COP RUB RON PEN BHD BGN ARS'.split(' ');

function allCodes(): string[] {
  try {
    const intl = Intl as typeof Intl & { supportedValuesOf?: (key: 'currency') => string[] };
    const codes = intl.supportedValuesOf?.('currency');
    if (codes?.length) return codes;
  } catch {
    // fall through
  }
  return FALLBACK;
}

export interface CurrencyOptionsConfig {
  /** Only these ISO 4217 codes, in this order. Default: every code the runtime knows. */
  currencies?: string[];
  /** Codes listed first, under a "common" group heading when `priorityLabel` is set. */
  priority?: string[];
  /** Heading for the `priority` group. Without it the priority codes simply come first. */
  priorityLabel?: string;
  /** Heading for the rest when `priorityLabel` is set. */
  restLabel?: string;
}

/**
 * 11.2: the ISO 4217 list as ComboboxField options, built from `Intl`: the label is the code and
 * the name ("USD · US Dollar"), the second line the symbol, and the option is found by code, name
 * or symbol. Port of admin-ui `CURRENCY_OPTIONS`.
 */
export function currencyOptions(locale?: string, { currencies, priority = [], priorityLabel, restLabel }: CurrencyOptionsConfig = {}): ComboboxOption[] {
  let names: Intl.DisplayNames | undefined;
  try {
    names = new Intl.DisplayNames(locale ? [locale] : undefined, { type: 'currency' });
  } catch {
    names = undefined;
  }
  const codes = (currencies ?? allCodes()).map((c) => c.toUpperCase());
  const first = priority.map((c) => c.toUpperCase()).filter((c) => codes.includes(c));
  const ordered = [...first, ...codes.filter((c) => !first.includes(c))];
  return ordered.map((code) => {
    let name = code;
    try {
      name = names?.of(code) ?? code;
    } catch {
      // unknown code: keep the code
    }
    let symbol = code;
    try {
      symbol = currencySymbol(code, locale);
    } catch {
      // unknown code: keep the code
    }
    const option: ComboboxOption = {
      value: code,
      label: name === code ? code : `${code} · ${name}`,
      keywords: [code, name, symbol],
    };
    if (symbol !== code) option.description = symbol;
    if (priorityLabel) option.group = first.includes(code) ? priorityLabel : restLabel;
    return option;
  });
}

type CurrencyListProps = CurrencyOptionsConfig & {
  /** BCP 47 locale for the names and symbols. Defaults to the user's. */
  locale?: string;
};

export interface CurrencySelectProps extends Omit<ComboboxPickerProps, 'options' | 'selectedOption' | 'onSearch' | 'loading'>, CurrencyListProps {}

function useCurrencyOptions({ locale: localeProp, currencies, priority, priorityLabel, restLabel }: CurrencyListProps) {
  const locale = useIntlLocale(localeProp);
  const key = `${locale}|${currencies?.join()}|${priority?.join()}|${priorityLabel}|${restLabel}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` covers every input
  return React.useMemo(() => currencyOptions(locale, { currencies, priority, priorityLabel, restLabel }), [key]);
}

/**
 * 11.2: a searchable currency picker (code, name and symbol), on ComboboxPicker. Value is the
 * ISO 4217 code. Put it in MoneyInput's `currencySlot` to let people change the currency.
 */
export const CurrencySelect = React.forwardRef<HTMLButtonElement, CurrencySelectProps>(function CurrencySelect(
  { locale, currencies, priority, priorityLabel, restLabel, ...props },
  ref,
) {
  const options = useCurrencyOptions({ locale, currencies, priority, priorityLabel, restLabel });
  return <ComboboxPicker ref={ref} options={options} {...props} />;
});

export interface CurrencyFieldProps extends Omit<ComboboxFieldProps, 'options' | 'selectedOption' | 'onSearch' | 'loading'>, CurrencyListProps {}

/** 11.2: CurrencySelect with a label, description and inline error. Port of admin-ui `CurrencyField`. */
export const CurrencyField = React.forwardRef<HTMLButtonElement, CurrencyFieldProps>(function CurrencyField(
  { locale, currencies, priority, priorityLabel, restLabel, ...props },
  ref,
) {
  const options = useCurrencyOptions({ locale, currencies, priority, priorityLabel, restLabel });
  return <ComboboxField ref={ref} options={options} {...props} />;
});
