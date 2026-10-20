'use client';

import * as React from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';

/** Every user-facing default string in @nexub/react. Explicit component props still win. */
export interface NexubMessages {
  close: string;
  dismissAlert: string;
  dismissBanner: string;
  remove: string;
  removeFilter: string;
  removeFile: (fileName: string) => string;
  uploadFiles: string;
  clickToUpload: string;
  orDragAndDrop: string;
  clearSearch: string;
  showPassword: string;
  hidePassword: string;
  increment: string;
  decrement: string;
  loading: string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  goToPage: (page: number) => string;
  breadcrumb: string;
  breadcrumbMore: string;
  moreCount: (count: number) => string;
  rating: string;
  ratingStars: (stars: number) => string;
  mainNavigation: string;
  sidebar: string;
  searchPlaceholder: string;
  noResults: string;
  pickDate: string;
  pickDateRange: string;
  commandPalette: string;
  /** Toaster region label; Radix replaces `{hotkey}`. */
  notifications: string;
  undo: string;
}

export const defaultMessages: NexubMessages = {
  close: 'Close',
  dismissAlert: 'Dismiss alert',
  dismissBanner: 'Dismiss banner',
  remove: 'Remove',
  removeFilter: 'Remove filter',
  removeFile: (fileName) => `Remove ${fileName}`,
  uploadFiles: 'Upload files',
  clickToUpload: 'Click to upload',
  orDragAndDrop: 'or drag and drop',
  clearSearch: 'Clear search',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  increment: 'Increment',
  decrement: 'Decrement',
  loading: 'Loading…',
  pagination: 'Pagination',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  goToPage: (page) => `Go to page ${page}`,
  breadcrumb: 'breadcrumb',
  breadcrumbMore: 'More',
  moreCount: (count) => `${count} more`,
  rating: 'Rating',
  ratingStars: (stars) => `${stars} star${stars !== 1 ? 's' : ''}`,
  mainNavigation: 'Main',
  sidebar: 'Sidebar',
  searchPlaceholder: 'Search…',
  noResults: 'No results found.',
  pickDate: 'Pick a date',
  pickDateRange: 'Pick a date range',
  commandPalette: 'Command palette',
  notifications: 'Notifications ({hotkey})',
  undo: 'Undo',
};

export type Direction = 'ltr' | 'rtl';

interface NexubContextValue {
  /** Undefined without a provider, so Intl components keep the user's locale. */
  locale: string | undefined;
  dir: Direction;
  messages: NexubMessages;
}

const NexubContext = React.createContext<NexubContextValue>({
  locale: undefined,
  dir: 'ltr',
  messages: defaultMessages,
});

const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur']);

/** 'rtl' for Arabic, Hebrew, Persian and Urdu locales, else 'ltr'. */
export function directionOf(locale: string): Direction {
  return RTL_LANGUAGES.has(locale.toLowerCase().split(/[-_]/)[0]!) ? 'rtl' : 'ltr';
}

export interface NexubProviderProps {
  /** BCP 47 locale for Intl formatting. @default 'en' */
  locale?: string;
  /** Text direction for Radix primitives. @default derived from `locale` */
  dir?: Direction;
  /** Overrides for the default English strings. */
  messages?: Partial<NexubMessages>;
  children?: React.ReactNode;
}

/**
 * Locale, direction and translated strings for every @nexub/react component.
 * It does not set `dir`/`lang` on <html> — the app does that (as it renders
 * <html>), so the page and CSS `rtl:` variants agree with this provider.
 */
export function NexubProvider({ locale = 'en', dir, messages, children }: NexubProviderProps) {
  const resolvedDir = dir ?? directionOf(locale);
  const value = React.useMemo(
    () => ({ locale, dir: resolvedDir, messages: { ...defaultMessages, ...messages } }),
    [locale, resolvedDir, messages],
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

/** The active locale (default 'en') and direction. */
export function useLocale(): { locale: string; dir: Direction } {
  const { locale = 'en', dir } = React.useContext(NexubContext);
  return { locale, dir };
}

/** Internal: the provider's locale, or undefined (= the user's) without one. */
export function useIntlLocale(explicit?: string): string | undefined {
  const ctx = React.useContext(NexubContext).locale;
  return explicit ?? ctx;
}
