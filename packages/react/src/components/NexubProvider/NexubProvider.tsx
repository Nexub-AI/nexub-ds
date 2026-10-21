'use client';

import * as React from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';
import type { Locale } from 'date-fns';

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
  /** Calendar nav and day labels (DatePicker, DateRangePicker). */
  previousMonth: string;
  nextMonth: string;
  calendarNavigation: string;
  /** Wraps a day's formatted date when it is today. */
  todayDate: (date: string) => string;
  /** Wraps a day's (possibly today-wrapped) label when it is selected. */
  selectedDate: (label: string) => string;
  commandPalette: string;
  /** Toaster region label; Radix replaces `{hotkey}`. */
  notifications: string;
  undo: string;
  // AI surfaces
  promptLabel: string;
  sendMessage: string;
  stopGenerating: string;
  promptHint: string;
  thinking: string;
  youSaid: string;
  assistantSaid: string;
  failedToSend: string;
  retry: string;
  copy: string;
  copied: string;
  goodResponse: string;
  badResponse: string;
  regenerate: string;
  sources: string;
  source: (index: number) => string;
  jumpToLatest: string;
  conversation: string;
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
  previousMonth: 'Go to previous month',
  nextMonth: 'Go to next month',
  calendarNavigation: 'Calendar navigation',
  todayDate: (date) => `Today, ${date}`,
  selectedDate: (label) => `${label}, selected`,
  commandPalette: 'Command palette',
  notifications: 'Notifications ({hotkey})',
  undo: 'Undo',
  promptLabel: 'Message',
  sendMessage: 'Send message',
  stopGenerating: 'Stop generating',
  promptHint: 'Press Enter to send, Shift+Enter for a new line',
  thinking: 'Thinking',
  youSaid: 'You said',
  assistantSaid: 'Assistant said',
  failedToSend: 'Failed to send',
  retry: 'Retry',
  copy: 'Copy',
  copied: 'Copied',
  goodResponse: 'Good response',
  badResponse: 'Bad response',
  regenerate: 'Regenerate',
  sources: 'Sources',
  source: (n) => `Source ${n}`,
  jumpToLatest: 'Jump to latest',
  conversation: 'Conversation',
};

export type Direction = 'ltr' | 'rtl';

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
