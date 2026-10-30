'use client';

import * as React from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';
import type { Locale } from 'date-fns';
import { defaultMessages, directionOf, type Direction, type NexubMessages } from '@nexub/core';

// Moved to @nexub/core (shared with @nexub/react-native); re-exported so the public API is unchanged.
export { defaultMessages, directionOf, type Direction, type NexubMessages };

interface NexubContextValue {
  /** Undefined without a provider, so Intl components keep the user's locale. */
  locale: string | undefined;
  dir: Direction;
  dateLocale: Locale | undefined;
  messages: NexubMessages;
}

const NexubContext = React.createContext<NexubContextValue>({
  locale: undefined,
  dir: 'ltr',
  dateLocale: undefined,
  messages: defaultMessages,
});

export interface NexubProviderProps {
  /** BCP 47 locale for Intl formatting. @default 'en' */
  locale?: string;
  /** Text direction for Radix primitives. @default derived from `locale` */
  dir?: Direction;
  /**
   * date-fns Locale for calendars (month/weekday names, week start, trigger text).
   * Import only the one you need, e.g. `import { fr } from 'date-fns/locale/fr'`.
   */
  dateLocale?: Locale;
  /** Overrides for the default English strings. */
  messages?: Partial<NexubMessages>;
  children?: React.ReactNode;
}

/**
 * Locale, direction and translated strings for every @nexub/react component.
 * It does not set `dir`/`lang` on <html> — the app does that (as it renders
 * <html>), so the page and CSS `rtl:` variants agree with this provider.
 */
export function NexubProvider({ locale = 'en', dir, dateLocale, messages, children }: NexubProviderProps) {
  const resolvedDir = dir ?? directionOf(locale);
  const value = React.useMemo(
    () => ({ locale, dir: resolvedDir, dateLocale, messages: { ...defaultMessages, ...messages } }),
    [locale, resolvedDir, dateLocale, messages],
  );
  return (
    <NexubContext.Provider value={value}>
      <DirectionProvider dir={resolvedDir}>{children}</DirectionProvider>
    </NexubContext.Provider>
  );
}

/** The active strings: defaults merged with the nearest NexubProvider's overrides. */
export function useNexubMessages(): NexubMessages {
  return React.useContext(NexubContext).messages;
}

/** The active locale (default 'en'), direction and optional date-fns Locale. */
export function useLocale(): { locale: string; dir: Direction; dateLocale?: Locale } {
  const { locale = 'en', dir, dateLocale } = React.useContext(NexubContext);
  return { locale, dir, dateLocale };
}

/** Internal: the provider's locale, or undefined (= the user's) without one. */
export function useIntlLocale(explicit?: string): string | undefined {
  const ctx = React.useContext(NexubContext).locale;
  return explicit ?? ctx;
}
