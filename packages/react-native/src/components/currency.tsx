import * as React from 'react';
import { currencySymbol } from '@nexub/core';
import { useTheme } from '../theme/ThemeProvider';
import { Select, type SelectOption, type SelectProps } from './overlays';

/**
 * The most traded currencies: the native default, since the native Select is a plain list in a
 * sheet (no search). Pass `currencies` for another list.
 */
const COMMON =
  'USD EUR JPY GBP CNY AUD CAD CHF HKD SGD SEK KRW NOK NZD INR MXN TWD ZAR BRL DKK PLN THB ILS IDR CZK AED TRY HUF CLP SAR PHP MYR COP RUB RON PEN BHD BGN ARS'.split(
    ' ',
  );

/**
 * The currency list as Select options: the label is the code and the name ("USD · US Dollar"),
 * the second line the symbol. Same labels as web `currencyOptions`.
 */
export function currencySelectOptions(
  locale: string | undefined,
  currencies: readonly string[] = COMMON,
  priority: readonly string[] = [],
): SelectOption<string>[] {
  let names: Intl.DisplayNames | undefined;
  try {
    names = new Intl.DisplayNames(locale ? [locale] : undefined, { type: 'currency' });
  } catch {
    names = undefined; // no Intl.DisplayNames (older Hermes): codes only
  }
  const codes = currencies.map((c) => c.toUpperCase());
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
    const option: SelectOption<string> = { value: code, label: name === code ? code : `${code} · ${name}` };
    if (symbol !== code) option.description = symbol;
    return option;
  });
}

export interface CurrencySelectProps extends Omit<SelectProps<string>, 'options'> {
  /**
   * Only these ISO 4217 codes, in this order. Default: the 40 most traded currencies (web lists
   * every code; the native sheet has no search).
   */
  currencies?: string[];
  /** Codes listed first. */
  priority?: string[];
  /** BCP 47 locale for the names and symbols. Defaults to the provider's locale. */
  locale?: string;
}

/**
 * A currency picker: a field that opens a sheet of currencies (code, name and symbol). The value
 * is the ISO 4217 code. Put it in MoneyInput's `currencySlot` to let people change the currency.
 */
export function CurrencySelect({ currencies, priority, locale, ...rest }: CurrencySelectProps) {
  const theme = useTheme();
  const loc = locale ?? theme.locale;
  const key = `${loc}|${currencies?.join()}|${priority?.join()}`;
  const options = React.useMemo(
    () => currencySelectOptions(loc, currencies, priority),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` covers every input
    [key],
  );
  return <Select options={options} {...rest} />;
}
