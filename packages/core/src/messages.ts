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
  /** 11.1: FileUpload.Trigger's name when it shows only an icon, and its busy label. */
  uploadFile: string;
  uploading: string;
  clearSearch: string;
  showPassword: string;
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
  /** 11.1: ComboboxField's placeholder when nothing is picked. */
  selectPlaceholder: string;
  noResults: string;
  pickDate: string;
  pickDateRange: string;
  /** Calendar nav and day labels (DatePicker, DateRangePicker). */
  previousMonth: string;
  nextMonth: string;
  calendarNavigation: string;
  /** 11.1: DatePicker `granularity="month"` and `"year"`. */
  pickMonth: string;
  pickYear: string;
  previousYear: string;
  nextYear: string;
  previousYears: string;
  nextYears: string;
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
  /** EmptyState presets. */
  emptyStates: Record<'noData' | 'noResults' | 'noAccess' | 'serverError' | 'offline' | 'notFound' | 'maintenance', { title: string; description: string }>;
  /** StatusPage link for notFound and noAccess. */
  backToHome: string;
  /** AlertDialog type-to-confirm, e.g. "Type acme-prod to confirm". */
  typeToConfirm: (text: string) => string;
  /** OTPInput group name when no aria-label is given. */
  verificationCode: string;
  /** OTPInput `mode="backup"` (11.2). */
  backupCode: string;
  /** FileUpload per-file progress and cancel. */
  uploadProgress: (fileName: string, percent: number) => string;
  cancelUpload: (fileName: string) => string;
  /** InlineEdit display button, e.g. "Edit Company name". */
  editField: (label: string) => string;
  /** DateTimePicker part labels. */
  dateLabel: string;
  timeLabel: string;
  /** EventCalendar navigation and view switch. */
  previousWeek: string;
  nextWeek: string;
  calendarView: string;
  monthView: string;
  weekView: string;
  /** EventCalendar day and agenda views (10.7). */
  dayView: string;
  agendaView: string;
  previousDay: string;
  nextDay: string;
  allDay: string;
  /** DataTable column filter (10.7): the header button, e.g. "Filter Status", and the popover's controls. */
  filterColumn: (column: string) => string;
  clearFilter: string;
  filterMin: string;
  filterMax: string;
  /** DataTable sub-row toggle. */
  expandRow: string;
  collapseRow: string;
  /** Stepper, e.g. "Step 2 of 4". */
  stepOf: (step: number, total: number) => string;
  stepCompleted: string;
  /** StatusSteps: read before a step's title, with `stepCompleted`. */
  stepCurrent: string;
  stepUpcoming: string;
  stepProblem: string;
  /** ResizablePanels separator. */
  resizePanels: string;
  /** Sortable, Kanban and DataTable row handles. */
  moveItem: (label: string) => string;
  reorderHint: string;
  itemMoved: (label: string, position: number, total: number) => string;
  itemMovedToColumn: (label: string, column: string, position: number, total: number) => string;
  /** NotificationCenter (@nexub/patterns). */
  notificationCenter: string;
  unreadNotifications: (count: number) => string;
  markAllRead: string;
  noNotifications: string;
  /** ChartZoom range thumbs and reset. */
  zoomStart: string;
  zoomEnd: string;
  resetZoom: string;
  /** Interactive charts (10.7): the plot's role description and the name of the legend toggles. */
  interactiveChart: string;
  chartSeries: string;
  /** React Native SortableList and TreeList. */
  moveUp: string;
  moveDown: string;
  backTo: (label: string) => string;
  /** Mobile DataList sort sheet. */
  sortBy: string;
  sortDirection: string;
  ascending: string;
  descending: string;
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
  /** AlertDialog.Prompt (11.2): the default confirm label and the built-in checks. */
  promptConfirm: string;
  fieldRequired: string;
  textTooShort: (min: number) => string;
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
  /** Avatar `status` dot, read after the name ("Ada Lovelace, Away"). */
  presence: Record<'online' | 'away' | 'busy' | 'offline', string>;
  /** Input `clearable` button. */
  clear: string;
  /** Input `showCount`, read near the limit ("72 of 80 characters"). */
  characterCount: (count: number, max: number) => string;
  /** PhoneInput country picker name ("Country code, India +91"). */
  countryCode: (country: string, code: string) => string;
  /** Countdown announcements ("2 minutes left", "30 seconds left"). */
  timeLeft: (count: number, unit: 'minute' | 'second') => string;
  /** Countdown at zero. */
  timeUp: string;
  /** QRCode text alternative ("QR code for https://example.com"). */
  qrCodeFor: (value: string) => string;
  /** QRScanner (native): hint over the camera, permission primer and its button, the denied state and its button. */
  scanInstructions: string;
  cameraPermission: string;
  allowCamera: string;
  cameraDenied: string;
  openSettings: string;
  /** QRScanner: no camera module in the app, the switch to manual entry and back, the torch button, and the announcement after a scan. */
  cameraUnavailable: string;
  enterCodeManually: string;
  scanCode: string;
  torch: string;
  codeScanned: string;
  /** TimeSlotPicker: default group name, period headings, empty text, and a slot that cannot be picked. */
  chooseTime: string;
  dayPeriods: Record<'morning' | 'afternoon' | 'evening', string>;
  noTimesAvailable: string;
  slotUnavailable: (label: string) => string;
  /** EmojiPicker / IconPicker: trigger and panel names, category headings and the group naming them, the recent picks heading, search results heading and the skin tone choice. */
  pickEmoji: string;
  pickIcon: string;
  emojiCategories: Record<'smileys' | 'people' | 'animals' | 'food' | 'travel' | 'activities' | 'objects' | 'symbols' | 'flags', string>;
  pickerCategories: string;
  recentlyUsed: string;
  searchResults: string;
  allIcons: string;
  skinTone: string;
  skinTones: Record<'default' | 'light' | 'mediumLight' | 'medium' | 'mediumDark' | 'dark', string>;
  /** ColorPicker: popover name, hex field label, swatch group name, contrast ratio (e.g. "4.8") and the AA text hint. */
  colorPicker: string;
  colorHex: string;
  colorSwatches: string;
  contrastRatio: (ratio: string) => string;
  contrastPasses: string;
  contrastFails: string;
  /** CommandPalette `recentKey` group heading. */
  recent: string;
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
  uploadFile: 'Upload file',
  uploading: 'Uploading',
  clearSearch: 'Clear search',
  showPassword: 'Show password',
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
  selectPlaceholder: 'Select…',
  noResults: 'No results found.',
  pickDate: 'Pick a date',
  pickDateRange: 'Pick a date range',
  previousMonth: 'Go to previous month',
  nextMonth: 'Go to next month',
  calendarNavigation: 'Calendar navigation',
  pickMonth: 'Pick a month',
  pickYear: 'Pick a year',
  previousYear: 'Go to previous year',
  nextYear: 'Go to next year',
  previousYears: 'Go to previous years',
  nextYears: 'Go to next years',
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
  emptyStates: {
    noData: { title: 'Nothing here yet', description: 'When there’s something to show, it’ll appear here.' },
    noResults: { title: 'No results', description: 'Try other words or remove some filters.' },
    noAccess: { title: 'You don’t have access', description: 'Ask an admin of this workspace to give you access.' },
    serverError: { title: 'Something went wrong', description: 'We couldn’t load this. Try again in a moment.' },
    offline: { title: 'You’re offline', description: 'Check your connection, then try again.' },
    notFound: { title: 'Page not found', description: 'The page may have moved, or the link may be wrong.' },
    maintenance: { title: 'Down for maintenance', description: 'We’re making some improvements. Check back soon.' },
  },
  backToHome: 'Back to home',
  typeToConfirm: (text) => `Type ${text} to confirm`,
  verificationCode: 'Verification code',
  backupCode: 'Backup code',
  uploadProgress: (fileName, percent) => `${fileName}, ${percent}% uploaded`,
  cancelUpload: (fileName) => `Cancel upload of ${fileName}`,
  editField: (label) => `Edit ${label}`,
  dateLabel: 'Date',
  timeLabel: 'Time',
  previousWeek: 'Go to previous week',
  nextWeek: 'Go to next week',
  calendarView: 'Calendar view',
  monthView: 'Month',
  weekView: 'Week',
  dayView: 'Day',
  agendaView: 'Agenda',
  previousDay: 'Go to previous day',
  nextDay: 'Go to next day',
  allDay: 'All day',
  filterColumn: (column) => `Filter ${column}`,
  clearFilter: 'Clear filter',
  filterMin: 'Min',
  filterMax: 'Max',
  expandRow: 'Expand row',
  collapseRow: 'Collapse row',
  stepOf: (step, total) => `Step ${step} of ${total}`,
  stepCompleted: 'completed',
  stepCurrent: 'current',
  stepUpcoming: 'upcoming',
  stepProblem: 'problem',
  resizePanels: 'Resize panels',
  moveItem: (label) => `Move ${label}`,
  reorderHint: 'Alt+Arrow keys move it',
  itemMoved: (label, position, total) => `${label} moved to position ${position} of ${total}`,
  itemMovedToColumn: (label, column, position, total) => `${label} moved to ${column}, position ${position} of ${total}`,
  notificationCenter: 'Notifications',
  unreadNotifications: (count) => `${count} unread`,
  markAllRead: 'Mark all as read',
  noNotifications: 'You’re all caught up',
  zoomStart: 'Zoom start',
  zoomEnd: 'Zoom end',
  resetZoom: 'Reset zoom',
  interactiveChart: 'interactive chart',
  chartSeries: 'Series',
  moveUp: 'Move up',
  moveDown: 'Move down',
  backTo: (label) => `Back to ${label}`,
  sortBy: 'Sort',
  sortDirection: 'Direction',
  ascending: 'Ascending',
  descending: 'Descending',
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
  promptConfirm: 'Continue',
  fieldRequired: 'This field is required.',
  textTooShort: (min) => `Enter at least ${min} characters.`,
  show: (label) => `Show ${label}`,
  hide: (label) => `Hide ${label}`,
  hidden: 'Hidden',
  deleteDigit: 'Delete',
  codeDigit: (index, total) => `Digit ${index} of ${total}`,
  offline: 'You’re offline. Some things may not be up to date.',
  page: (index, total) => `Page ${index} of ${total}`,
  moreActions: 'More actions',
  presence: { online: 'Online', away: 'Away', busy: 'Busy', offline: 'Offline' },
  clear: 'Clear',
  characterCount: (count, max) => `${count} of ${max} characters`,
  countryCode: (country, code) => `Country code, ${country} +${code}`,
  timeLeft: (count, unit) => `${count} ${unit}${count !== 1 ? 's' : ''} left`,
  timeUp: 'Time is up',
  qrCodeFor: (value) => `QR code for ${value}`,
  scanInstructions: 'Point the camera at a QR code',
  cameraPermission: 'Allow camera access to scan a code.',
  allowCamera: 'Allow camera',
  cameraDenied: 'Camera access is off. Turn it on in Settings to scan a code.',
  openSettings: 'Open settings',
  cameraUnavailable: 'Scanning isn’t available on this device.',
  enterCodeManually: 'Enter code manually',
  scanCode: 'Scan a code',
  torch: 'Flashlight',
  codeScanned: 'Code scanned',
  chooseTime: 'Choose a time',
  dayPeriods: { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' },
  noTimesAvailable: 'No times available',
  slotUnavailable: (label) => `${label}, unavailable`,
  pickEmoji: 'Pick an emoji',
  pickIcon: 'Pick an icon',
  emojiCategories: {
    smileys: 'Smileys & emotion',
    people: 'People & body',
    animals: 'Animals & nature',
    food: 'Food & drink',
    travel: 'Travel & places',
    activities: 'Activities',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags',
  },
  pickerCategories: 'Categories',
  recentlyUsed: 'Recently used',
  searchResults: 'Search results',
  allIcons: 'All icons',
  skinTone: 'Skin tone',
  skinTones: { default: 'Default', light: 'Light', mediumLight: 'Medium-light', medium: 'Medium', mediumDark: 'Medium-dark', dark: 'Dark' },
  colorPicker: 'Color',
  colorHex: 'Hex',
  colorSwatches: 'Swatches',
  contrastRatio: (ratio) => `Contrast ${ratio}:1`,
  contrastPasses: 'Passes AA for text',
  contrastFails: 'Fails AA for text (needs 4.5:1)',
  recent: 'Recent',
};

export type Direction = 'ltr' | 'rtl';

const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur']);

/** 'rtl' for Arabic, Hebrew, Persian and Urdu locales, else 'ltr'. */
export function directionOf(locale: string): Direction {
  return RTL_LANGUAGES.has(locale.toLowerCase().split(/[-_]/)[0]!) ? 'rtl' : 'ltr';
}
