import * as React from 'react';
import { View } from 'react-native';
import { COUNTRIES, callingCode, formatNational, parsePhone, toE164, type CountryCode } from '@nexub/core';
import { ChevronDown } from '@nexub/icons/native';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { ListItem, ListSection } from './containers';
import { SearchField, TextField, type TextFieldProps } from './inputs';
import { BottomSheet } from './overlays';
import { hitSlopFor } from './shared';

export interface PhoneInputProps
  extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'onChangeText' | 'leading' | 'keyboardType' | 'multiline'> {
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
  /** Marks the field invalid for screen readers. For the red outline and a message, give `error`. */
  invalid?: boolean;
}

function localeRegion(locale: string): CountryCode {
  try {
    const region = new Intl.Locale(locale).maximize().region;
    if (region && COUNTRIES[region]) return region;
  } catch {
    // No Intl.Locale on this engine, or an unreadable locale: read the tag itself.
  }
  const tagged = /[-_]([A-Za-z]{2})(?:[-_]|$)/.exec(locale)?.[1]?.toUpperCase();
  return tagged && COUNTRIES[tagged] ? tagged : 'US';
}

/** The flag emoji of a country code: its two letters as regional indicator symbols. */
const flagOf = (code: CountryCode) => String.fromCodePoint(...Array.from(code.toUpperCase(), (c) => 0x1f1a5 + c.charCodeAt(0)));

/**
 * A phone field (web PhoneInput): country picker in a sheet plus national number,
 * grouped as you type. The value is E.164. Formatting and length checks only:
 * confirm the number on the server.
 */
export function PhoneInput({
  defaultCountry,
  country: countryProp,
  onCountryChange,
  value,
  defaultValue,
  onValueChange,
  countries,
  invalid,
  disabled,
  readOnly,
  error,
  ...rest
}: PhoneInputProps) {
  const { roles, tokens, messages, locale } = useTheme();
  const [countryState, setCountryState] = React.useState<CountryCode>(() => {
    const start = countryProp ?? defaultCountry ?? localeRegion(locale);
    return countries?.length && !countries.includes(start) ? countries[0]! : start;
  });
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const e164 = value ?? inner;
  // The value names its own country; an empty one leaves the picked country alone.
  const { country, national } = parsePhone(e164, countryProp ?? countryState);
  const cc = callingCode(country);

  const nameOf = React.useCallback(
    (code: CountryCode) => {
      // ponytail: engines without Intl.DisplayNames (some Hermes builds) show the ISO code;
      // ship a names table in @nexub/core if that is not good enough.
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

  // ponytail: the caret goes to the end when a digit is typed mid-number (the text is
  // regrouped); track `selection` like the web field if that is reported.
  const changeText = (raw: string) => {
    let next = parsePhone(raw, country);
    // A pasted number from outside a restricted list stays in the current country
    // with all its digits, so it reads (and validates) as wrong instead of switching.
    if (countries?.length && !countries.includes(next.country)) next = parsePhone(raw.replace(/^[\s+0]+/, ''), country);
    commit(next.national, next.country);
  };

  const key = countries?.join();
  const options = React.useMemo(() => {
    const list = (countries ?? Object.keys(COUNTRIES))
      .filter((code) => COUNTRIES[code])
      .map((code) => ({ code, name: nameOf(code), cc: COUNTRIES[code]! }));
    return countries ? list : list.sort((a, b) => a.name.localeCompare(b.name));
    // `key` stands in for `countries`: callers pass a fresh array each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, nameOf]);
  const q = query.trim().toLowerCase().replace(/^\+/, '');
  const shown = q ? options.filter((o) => o.name.toLowerCase().includes(q) || o.code.toLowerCase() === q || o.cc.startsWith(q)) : options;

  const single = countries?.length === 1;
  const label = messages.countryCode(nameOf(country), cc);
  const picked = (
    <>
      <Text variant="body-lg">{flagOf(country)}</Text>
      <Text variant="body-lg" tabular color={single ? 'on-surface-variant' : 'on-surface'}>
        +{cc}
      </Text>
    </>
  );
  const row = { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[1] } as const;

  return (
    <>
      <TextField
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
        aria-invalid={invalid || !!error}
        {...rest}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
        leading={
          single ? (
            <View accessible accessibilityRole="text" accessibilityLabel={label} style={row}>
              {picked}
            </View>
          ) : (
            <Pressable
              accessibilityLabel={label}
              disabled={disabled || readOnly}
              onPress={() => setOpen(true)}
              pressScale={false}
              hitSlop={hitSlopFor(tokens.size.control.sm)}
              style={[row, { minHeight: tokens.size.control.sm, borderRadius: tokens.shape.field }]}
            >
              {picked}
              <ChevronDown size="sm" color={roles['on-surface-variant']} />
            </Pressable>
          )
        }
        value={formatNational(national, country)}
        onChangeText={changeText}
      />
      {!single && (
        <BottomSheet
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setQuery('');
          }}
          detents={options.length > 6 ? [0.6, 0.92] : ['content']}
          scroll={options.length > 6}
        >
          {options.length > 8 && <SearchField value={query} onChangeText={setQuery} style={{ marginBottom: tokens.spacing[3] }} />}
          {/* ponytail: every row is mounted while the sheet is open (about 240); a FlatList if it stutters. */}
          <ListSection>
            {shown.map((o) => (
              <ListItem
                key={o.code}
                variant="radio"
                leading={<Text variant="body-lg">{flagOf(o.code)}</Text>}
                title={`${o.name} +${o.cc}`}
                checked={o.code === country}
                onCheckedChange={() => {
                  commit(national, o.code);
                  setOpen(false);
                  setQuery('');
                }}
              />
            ))}
          </ListSection>
        </BottomSheet>
      )}
    </>
  );
}
