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
  /** FileUpload: a file outside `accept`. */
  fileTypeRejected: (fileName: string) => string;
  /** FileUpload: a file over `maxSize`; `maxSize` is already formatted ("5 MB"). */
  fileTooLarge: (fileName: string, maxSize: string) => string;
  /** FileUpload: files past `maxFiles`. */
  tooManyFiles: (maxFiles: number) => string;
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
  /** Combobox "create" option for text that matches nothing. */
  createOption: (text: string) => string;
  /** MultiSelect chip remove button. */
  removeOption: (label: string) => string;
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
  /** DataTable selection column. */
  selectRow: string;
  selectAllOnPage: string;
  /** DataTable bulk-action bar, e.g. "3 selected"; `count` is already formatted. */
  selectedCount: (count: string) => string;
  /** Offered when a whole page is selected, e.g. "Select all 1,240". */
  selectAllRows: (count: string) => string;
  clearSelection: string;
  /** DataTable view menu. */
  view: string;
  density: string;
  comfortable: string;
  compact: string;
  columns: string;
  /** Read after a sorted column's name when several columns are sorted, e.g. "sort 2". */
  sortOrder: (index: number) => string;
  /** DataTable column resize handle. */
  resizeColumn: (column: string) => string;
  /** Announced after a keyboard column move, e.g. "Email moved to position 2 of 4". */
  columnMoved: (column: string, position: number, total: number) => string;
  /** DateRangePicker presets. */
  today: string;
  last7Days: string;
  last30Days: string;
  monthToDate: string;
  lastMonth: string;
  /** DateRangePicker footer, e.g. "Time zone: GMT+1". */
  timeZoneLabel: (zone: string) => string;
  /** FilterBuilder. */
  addFilter: string;
  addGroup: string;
  removeGroup: string;
  matchAll: string;
  matchAny: string;
  /** Names a filter group for screen readers. */
  filterGroup: (combinator: 'and' | 'or') => string;
  filterField: string;
  filterOperator: string;
  filterValue: string;
  filterOperators: Record<'contains' | 'equals' | 'notEquals' | 'startsWith' | 'isEmpty' | 'greaterThan' | 'lessThan' | 'before' | 'after', string>;
  /** SavedViews. */
  views: string;
  saveView: string;
  updateView: (name: string) => string;
  deleteView: (name: string) => string;
  viewName: string;
  save: string;
  /** FilterBar, e.g. "3 filters". */
  filtersApplied: (count: number) => string;
  clearAll: string;
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
  // NotificationItem, ActivityFeed (@nexub/patterns)
  unread: string;
  dismissNotification: string;
  activityFeed: string;
  // Mobile (@nexub/react-native)
  /** Sheet grabber: cycles the sheet height. */
  resize: string;
  cancel: string;
  show: (label: string) => string;
  hide: (label: string) => string;
  /** Read in place of a masked value. */
  hidden: string;
  deleteDigit: string;
  /** OTP / PIN entry, e.g. "Digit 2 of 6". */
  codeDigit: (index: number, total: number) => string;
  offline: string;
  page: (index: number, total: number) => string;
  moreActions: string;
}

export const defaultMessages: NexubMessages = {
  close: 'Close',
  dismissAlert: 'Dismiss alert',
  dismissBanner: 'Dismiss banner',
  remove: 'Remove',
  removeFilter: 'Remove filter',
  removeFile: (fileName) => `Remove ${fileName}`,
  uploadFiles: 'Upload files',
  fileTypeRejected: (fileName) => `${fileName} isn’t an accepted file type`,
  fileTooLarge: (fileName, maxSize) => `${fileName} is larger than ${maxSize}`,
  tooManyFiles: (maxFiles) => `You can add up to ${maxFiles} file${maxFiles !== 1 ? 's' : ''}`,
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
  createOption: (text) => `Create “${text}”`,
  removeOption: (label) => `Remove ${label}`,
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
  selectRow: 'Select row',
  selectAllOnPage: 'Select all rows on this page',
  selectedCount: (count) => `${count} selected`,
  selectAllRows: (count) => `Select all ${count}`,
  clearSelection: 'Clear selection',
  view: 'View',
  density: 'Density',
  comfortable: 'Comfortable',
  compact: 'Compact',
  columns: 'Columns',
  sortOrder: (index) => `sort ${index}`,
  resizeColumn: (column) => `Resize ${column}`,
  columnMoved: (column, position, total) => `${column} moved to position ${position} of ${total}`,
  today: 'Today',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  monthToDate: 'Month to date',
  lastMonth: 'Last month',
  timeZoneLabel: (zone) => `Time zone: ${zone}`,
  addFilter: 'Add filter',
  addGroup: 'Add group',
  removeGroup: 'Remove group',
  matchAll: 'All',
  matchAny: 'Any',
  filterGroup: (combinator) => (combinator === 'and' ? 'Filters, match all' : 'Filters, match any'),
  filterField: 'Field',
  filterOperator: 'Condition',
  filterValue: 'Value',
  filterOperators: {
    contains: 'contains',
    equals: 'is',
    notEquals: 'is not',
    startsWith: 'starts with',
    isEmpty: 'is empty',
    greaterThan: 'greater than',
    lessThan: 'less than',
    before: 'before',
    after: 'after',
  },
  views: 'Views',
  saveView: 'Save as new view…',
  updateView: (name) => `Update “${name}”`,
  deleteView: (name) => `Delete “${name}”`,
  viewName: 'View name',
  save: 'Save',
  filtersApplied: (count) => `${count} filter${count !== 1 ? 's' : ''}`,
  clearAll: 'Clear all',
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
  unread: 'Unread',
  dismissNotification: 'Dismiss notification',
  activityFeed: 'Activity feed',
  resize: 'Resize',
  cancel: 'Cancel',
  show: (label) => `Show ${label}`,
  hide: (label) => `Hide ${label}`,
  hidden: 'Hidden',
  deleteDigit: 'Delete',
  codeDigit: (index, total) => `Digit ${index} of ${total}`,
  offline: 'You’re offline. Some things may not be up to date.',
  page: (index, total) => `Page ${index} of ${total}`,
  moreActions: 'More actions',
};

export type Direction = 'ltr' | 'rtl';

const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur']);

/** 'rtl' for Arabic, Hebrew, Persian and Urdu locales, else 'ltr'. */
export function directionOf(locale: string): Direction {
  return RTL_LANGUAGES.has(locale.toLowerCase().split(/[-_]/)[0]!) ? 'rtl' : 'ltr';
}
