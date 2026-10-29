// Every user-facing default string, shared by @nexub/react and @nexub/react-native.
// Explicit component props still win; providers merge partial overrides on top.

/** Every user-facing default string in @nexub/react and @nexub/react-native. Explicit component props still win. */
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
  // DataTable pager
  pageOf: (page: number, total: number) => string;
  previous: string;
  next: string;
  // AppHeader (@nexub/patterns)
  search: string;
  searchProduct: (productName: string) => string;
  keyboardShortcut: (shortcut: string) => string;
  commandKey: string;
  controlKey: string;
  searching: string;
  searchFailed: string;
  noResultsFor: (query: string) => string;
  typeToSearch: string;
  switchOrganization: (name: string) => string;
  organizations: string;
  switchToLightTheme: string;
  switchToDarkTheme: string;
  glass: string;
  glassClear: string;
  glassBalanced: string;
  glassTinted: string;
  glassSolid: string;
  accountMenu: (name: string) => string;
  manageAccount: string;
  privacyPolicy: string;
  termsOfService: string;
  signOut: string;
  signingOut: string;
  accountAndApps: string;
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
  pageOf: (page, total) => `Page ${page} of ${total}`,
  previous: 'Previous',
  next: 'Next',
  search: 'Search',
  searchProduct: (productName) => `Search ${productName}`,
  keyboardShortcut: (shortcut) => `Keyboard shortcut: ${shortcut}`,
  commandKey: 'Command',
  controlKey: 'Control',
  searching: 'Searching…',
  searchFailed: 'Search failed. Try again.',
  noResultsFor: (query) => `No results for “${query}”`,
  typeToSearch: 'Type to search',
  switchOrganization: (name) => `${name}, switch organization`,
  organizations: 'Organizations',
  switchToLightTheme: 'Switch to light theme',
  switchToDarkTheme: 'Switch to dark theme',
  glass: 'Glass',
  glassClear: 'Clear',
  glassBalanced: 'Balanced',
  glassTinted: 'Tinted',
  glassSolid: 'Solid',
  accountMenu: (name) => `Account: ${name}`,
  manageAccount: 'Manage your Nexub Account',
  privacyPolicy: 'Privacy policy',
  termsOfService: 'Terms of service',
  signOut: 'Sign out',
  signingOut: 'Signing out…',
  accountAndApps: 'Account and apps',
};

export type Direction = 'ltr' | 'rtl';

const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur']);

/** 'rtl' for Arabic, Hebrew, Persian and Urdu locales, else 'ltr'. */
export function directionOf(locale: string): Direction {
  return RTL_LANGUAGES.has(locale.toLowerCase().split(/[-_]/)[0]!) ? 'rtl' : 'ltr';
}
