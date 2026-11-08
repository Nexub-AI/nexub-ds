# @nexub/core

## 6.7.0

### Minor Changes

- 4d94b73: React Native parity for 6.x.

  - **`TreeList`** (new): the web TreeView on mobile, as drill-down lists with a back row; leaves are picked like radio rows.
  - **`StepProgress`** (new): the web Stepper on mobile: segments and "Step 2 of 4: Billing", read as a progress bar. (The existing `Stepper` stays the − value + control.)
  - **`SortableList`** (new): the web Sortable on mobile: Move up / Move down buttons while `editing`, and the same moves as VoiceOver and TalkBack actions on every row.
  - **`InlineEdit`** (new): text that turns into a field when tapped; Return or leaving the field saves.
  - Docs: native twins for TimePicker and DateTimePicker (`DateTimeField` with `mode="time"`), TreeView, Sortable, Stepper and InlineEdit, with live mobile previews.
  - New messages: `moveUp`, `moveDown`, `backTo`.

## 6.6.0

### Minor Changes

- 46bd41c: Inbox, export and zoom.

  - **`NotificationCenter`** (new, beta, patterns): a bell with an unread count ("Notifications, 3 unread") that opens the notification list in a popover, with "Mark all as read", dismiss and an empty state. Your app owns the notifications.
  - **`NotificationItem`**: `href` or `onSelect` makes the whole item a link or a button (the dismiss button stays separate).
  - **`toCSV(rows, columns)`** (new): CSV text per RFC 4180 with CRLF line ends. Cells that start like a spreadsheet formula (`=`, `+`, `-`, `@`) get a leading `'`, so exports can't run formulas.
  - **`ChartZoom`** (new, beta): zoom any chart to part of its range with a two-thumb slider and a reset button. Only the wrapper is a client component; charts stay server-rendered.
  - New messages: `notificationCenter`, `unreadNotifications`, `markAllRead`, `noNotifications`, `zoomStart`, `zoomEnd`, `resetZoom`.

## 6.5.0

### Minor Changes

- efe17f9: Reorder.

  - **`Sortable`** (new, beta): a list people reorder by dragging an item or with Alt+ArrowUp/Down on its handle. Focus stays on the moved item's handle and every move is announced ("Alpha moved to position 3 of 5").
  - **`Kanban`** (new, beta): columns of cards. Drag cards, or Alt+ArrowUp/Down within a column and Alt+ArrowLeft/Right across columns (mirrored in RTL). Columns are regions named by their headings.
  - **`DataTable`**: `onRowOrderChange` adds a row handle column for the same drag and Alt+Arrow moves; `getRowLabel` names rows. Handles hide while a column is sorted.
  - Built on the native drag-and-drop API, the same model as DataTable column reordering: no new dependency.
  - **Icons**: `GripVertical`.
  - New messages: `moveItem`, `reorderHint`, `itemMoved`, `itemMovedToColumn`.

## 6.4.0

### Minor Changes

- 5839e96: Layout and flow.

  - **`ResizablePanels`** (new, beta): panels with draggable separators (ARIA window splitter). Arrow keys move a focused separator by 5% (mirrored in RTL), Home/End to its limits, Enter back to the default split. `sizes` / `onSizesChange` in percent so your app can persist the layout; `minSizes` per panel; horizontal or vertical.
  - **`Stepper`** (new, beta): progress through a multi-step flow. `current`, `completed`, and `onStepChange` makes reachable steps clickable (linear by default, `nonLinear` to allow any). Each step reads "Step 2 of 4: Billing", with "completed" when done. Horizontal or vertical. It will replace the patterns `StepIndicator` in 7.0.
  - **`ActionBar`** (new, beta): save / cancel that stay in view at the bottom of a long form, with a polite status `message`.
  - New messages: `stepOf`, `stepCompleted`, `resizePanels`.

## 6.3.0

### Minor Changes

- 0290a12: Hierarchy.

  - **`TreeView`** (new, beta): an ARIA tree. Arrow keys move, open and close (mirrored in RTL), Home/End jump, typing finds an item, and the tree is one tab stop. Single selection, or `checkable` with tri-state parents (`checked` lists every checked id). `hasChildren` + `onLoadChildren` load children on first open, with the item `aria-busy` meanwhile.
  - **`DataTable`**: `getSubRows` makes a tree table. The first column gets an expand toggle and indents each level; `expanded` / `defaultExpanded` / `onExpandedChange` control it. With `pagination`, a parent and its children stay on one page.
  - New messages: `expandRow`, `collapseRow`.

## 6.2.0

### Minor Changes

- 653ee48: Time.

  - **`TimePicker`** (new, beta): a time field on the native `<input type="time">`. Value is 24-hour `"HH:mm"`; the display is 12 or 24 hours from the reader's locale; `minuteStep` sets the arrow-key and picker step; phones open their own picker.
  - **`DateTimePicker`** (new, beta): a `DatePicker` and a `TimePicker` that edit one `Date` (local time). `defaultTime` fills the time when the date is picked first; `timeZone` names the zone next to the fields.
  - **`EventCalendar`** (new, beta): month and week grids of events (`{ id, title, start, end?, allDay?, tone? }`). Multi-day events show on each day, month view collapses extras into "N more", the week starts on the locale's first day, and Today / previous / next / Month–Week controls are built in. Display only: `onEventClick` and `onDayClick` hand the action to your app.
  - New messages: `dateLabel`, `timeLabel`, `previousWeek`, `nextWeek`, `calendarView`, `monthView`, `weekView`.

## 6.1.0

### Minor Changes

- 67643af: Forms 2.0.

  - **`Form`** (new, beta): validates on submit with the browser's constraint validation (`required`, `type`, `pattern`, `min`…) plus an optional `validate(data)` for your own rules (zod plugs in here). Messages show on the matching `FormField` by `name`, the first invalid field takes focus, a field's error clears as you edit it, and `onInvalidSubmit` hands the list to `ErrorSummary`. An async `onSubmit` marks the form `aria-busy`; `useForm()` reads `{ errors, submitting }`.
  - **`FormField`**: `Root` with a `name` inside a `Form` picks up that field's error (`invalid`, and `FormField.Error` shows the message when it has no children).
  - **`Fieldset`** (new, beta): native `<fieldset>` and `<legend>` with an optional description; `disabled` disables every control inside.
  - **`InlineEdit`** (new, beta): text that becomes an input on click. Enter or blur saves, Escape reverts, focus returns to the text; a rejected `onSave` promise keeps it open and invalid.
  - **`useUnsavedChanges(dirty)`** (new): asks the browser to confirm before the page unloads while there are unsaved changes.
  - New message: `editField`.

## 6.0.0

## 5.9.0

## 5.8.0

## 5.7.0

### Minor Changes

- 18bbb2e: React Native parity for the 5.x data components.

  - **`DataList`** (React Native): the mobile form of DataTable. One row per record with its key fields (no sideways grid), a Sort sheet (one sort plus direction), and a selection mode with a count and `bulkActions`. Built on FlatList.
  - **`MultiSelect`** (React Native): a field that opens a sheet of checkbox rows, with search above 8 options. The field summarises the picks ("Bug, Design, +3 more").
  - **`FileList`** (React Native): files picked for upload with size, progress, errors, and remove or cancel. Bring your own picker (for example, expo-document-picker).
  - **`FilterSheet`** (React Native): the web FilterBuilder in a sheet. It edits one flat AND/OR list and keeps nested web groups untouched.
  - **Shared filter model**: `FilterGroup`, `FilterRule`, `FilterField`, `filterOperators`, `countFilters`, `emptyFilter`, `newFilterRule` and `isFilterGroup` now live in `@nexub/core`. Both `@nexub/react` and `@nexub/react-native` re-export them, so saved queries move between platforms. No API change for web.
  - New messages: `sortBy`, `sortDirection`, `ascending`, `descending`.
  - Docs: web DataTable, MultiSelect, FilterBuilder and OTP Input pages now show their mobile twins with live previews.

## 5.6.0

### Minor Changes

- b71b56f: States and safety.

  - **`EmptyStatePreset`** (new): ready-made empty states (`noData`, `noResults`, `noAccess` for 403, `serverError` for 500, `offline`), with an icon, localised title and description, and optional `actions`. Errors are announced. `EmptyState` itself stays a server component.
  - **`AlertDialog.Confirm`**: type-to-confirm for irreversible actions. The Action button stays disabled until the given `text` (for example, the resource name) is typed.
  - **`OTPInput`** (new, beta): one box per digit with `autocomplete="one-time-code"`, so codes from SMS fill every box. Supports paste-to-fill, Backspace and arrow keys, `onComplete`, `mode="alphanumeric"`, `invalid` and `name` for forms.
  - **`FileUpload.Item`**: `progress` (0–100) shows a bar, `onCancel` swaps the remove button for "Cancel upload" while uploading, and `error` shows why a file failed. Your app does the upload.
  - **Icons**: `Inbox`, `ServerCrash`, `WifiOff`.
  - New messages: `emptyStates`, `typeToConfirm`, `verificationCode`, `uploadProgress`, `cancelUpload`.

## 5.5.0

### Minor Changes

- 04ff65b: Filters and views.

  - **`FilterBuilder`** (new, beta): builds AND/OR filter queries with nested groups (`maxDepth`, default 1). The output is plain JSON (`FilterGroup` / `FilterRule`), which your app runs. Field types `text`, `number`, `select` and `date` each get their own operators and value input. Helpers: `emptyFilter`, `countFilters`, `isFilterGroup`, `filterOperators`.
  - **`SavedViews`** (new, beta): a menu to switch, save (asks for a name), update and delete views. UI only: your app stores them.
  - **`DateRangePicker`**: `presets` (`true` gives Today, Last 7 days, Last 30 days, Month to date and Last month, or pass your own) and `timeZone`, shown under the calendar and used to count "today". `todayIn(zone)` is exported.
  - **`FilterBar`** (patterns): `activeCount` shows "N filters", and `onClearAll` adds a Clear all button.
  - Docs: removed DateRangePicker props that never existed (`numberOfMonths`, `error`).
  - New messages for presets, the filter builder, saved views and the filter bar. `filterOperators` is one object: overriding it replaces all its labels.

## 5.4.0

### Minor Changes

- 253949f: DataTable 2.0, part 2: layout and scale.

  - **Resize**: `enableColumnResizing`, with `columnSizing` / `onColumnSizingChange`. Drag a header's edge. The handle is a focusable separator: Arrow keys resize by 16px and double-click resets. RTL-aware.
  - **Reorder**: `enableColumnReordering`, with `columnOrder` / `onColumnOrderChange`. Drag headers, or press Alt+Arrow on a focused header, and the move is announced.
  - **Pin**: `columnPinning` / `onColumnPinningChange` (`{ left, right }`). Pinned columns stay in view with an edge line, and the selection column pins with them.
  - **Sticky header**: `maxHeight` caps the table's height. Rows scroll and the header stays in view.
  - **`DataTableVirtual`** (new, beta), imported from `@nexub/react/DataTableVirtual`: renders only the rows in view, for thousands of rows. Rows carry `aria-rowindex` and the table `aria-rowcount`. It needs `@tanstack/react-virtual`, an optional peer dependency, so apps that don't use it don't install it.
  - Sizes and offsets are set through the CSSOM, not style attributes, so strict-CSP pages work.
  - New messages: `resizeColumn`, `columnMoved`.

## 5.3.0

### Minor Changes

- 8988b87: DataTable 2.0, part 1: selection and density.

  - **`selectionColumn`** (with `enableRowSelection`): a checkbox column. The header checkbox selects the page and shows a mixed state for partial selections. With pagination, a selected page offers "Select all N" across pages. On by default from 6.0.
  - **Controlled selection**: `rowSelection` / `onRowSelectionChange` and `getRowId` for stable ids.
  - **`bulkActions(rows, clear)`**: a floating bar while rows are selected, with the count (announced), your actions and a clear button.
  - **Multi-sort order**: Shift+click sorts by more columns. Each sorted header shows its order (1, 2…), which is also read out.
  - **Density**: `density` / `defaultDensity` / `onDensityChange` (`comfortable` or `compact`).
  - **Column visibility**: `columnVisibility` / `onColumnVisibilityChange`.
  - **`viewOptions`**: a "View" menu for density and which columns show. `toolbar` puts your own content (filters, a title) in the same row.
  - New messages: `selectRow`, `selectAllOnPage`, `selectedCount`, `selectAllRows`, `clearSelection`, `view`, `density`, `comfortable`, `compact`, `columns`, `sortOrder`.

## 5.2.0

### Minor Changes

- 5f2ef4d: Combobox 2.0 and MultiSelect.

  - **`MultiSelect`** (new, beta): pick several options, shown as chips in the field. Search filters the list. Extra chips collapse into "+N more" (`maxVisibleChips`, default 3). Backspace in an empty field removes the last chip. Options carry `aria-checked`, and each chip has a "Remove ‹label›" button. Also supports `onInputChange` for fetching as you type, `onCreate` and `loading`.
  - **`Autocomplete`**: `mode="popover"` turns it into a field whose list opens below it while typing. `aria-expanded` follows the list. Inline stays the default until 6.0. New `onCreate` adds a "Create “text”" option, and `aria-label` and `disabled` are supported.
  - **Loading** in Autocomplete and MultiSelect shows skeleton rows instead of text. "Loading" is still announced.
  - **`Chip`**: new `removeLabel` prop for the dismiss button's accessible name.
  - New messages: `createOption`, `removeOption`.

## 5.1.0

### Minor Changes

- 60fed18: Audit fixes and quick wins.

  Bug fixes:
  - **`FileUpload`**: dropped files now go through the same `accept` check as the file picker. Before, a drop let any file type in. The check covers MIME types, wildcards (`image/*`) and extensions (`.pdf`), and is exported as `fileAccepted`. It's a UX filter, so keep validating on the server.
  - **`Autocomplete`**: new `inputValue` and `onInputChange` props, so apps can fetch options as the user types. With `onInputChange` set, the options are shown as given, without built-in filtering.
  - **`FilterBar`**: the search field now has an accessible name (`searchLabel`, defaulting to the localised "Search"). It's now a `SearchInput` with a clear button and a localised placeholder.

  New:
  - **`FileUpload.Root`**: `maxSize` (bytes) and `onReject`. Files rejected for type, size or `maxFiles` get a message under the drop zone that screen readers announce. New messages: `fileTypeRejected`, `fileTooLarge`, `tooManyFiles`.
  - **`Toaster`**: `position` prop with six positions (`top-start` … `bottom-end`). Start and end follow the reading direction. Default is still `top-end`.
  - **`Drawer.Header` and `Drawer.Footer`** are sticky on solid panels, so long content scrolls under them. Glass panels are unchanged.
  - **`CommandPalette.Root`**: `shortcut` prop. For example, `shortcut="k"` toggles the palette with Cmd+K or Ctrl+K. Off by default.
  - **`Breadcrumb.Trail`**: builds a breadcrumb from `items` and moves the middle of long paths into a "More" menu (`maxItems`, default 4).

## 5.0.1

## 5.0.0

## 4.9.0

## 4.8.0

## 4.7.0

## 4.6.0

## 4.5.0

## 4.4.0

## 4.3.0

## 4.2.0

## 4.1.0

## 4.0.0

## 3.9.0

## 3.8.0

## 3.7.0

## 3.6.0

## 3.5.0

## 3.4.0

## 3.3.0

## 3.2.0

## 3.1.0

## 3.0.0

## 2.9.0

## 2.8.0

## 2.7.0

## 2.6.0

## 2.5.0

### Minor Changes

- 3363ede: Start of the 3.0 runway (2.5.0).

  - `Banner`, `Callout`, `Tag` and `StatusPill` now log a one-time `console.warn` in development naming their replacement (`Alert` or `Badge`) and the 3.0 removal, as GOVERNANCE.md requires before a removal. Production builds stay silent.
  - `NotificationItem` and `ActivityFeed` take their accessible labels from `NexubProvider` messages: new keys `unread`, `dismissNotification` and `activityFeed`. The English defaults are unchanged.

## 2.4.0

## 2.3.1

### Patch Changes

- c67c72a: Published with npm trusted publishing (OIDC) from the `Nexub-AI/nexub-ds` release workflow, so every version now carries npm provenance: you can check on npmjs.com that it was built from this repository's source. No code changes.

## 2.3.0

## 2.2.0

## 2.1.0

### Minor Changes

- c5cd6c5: **React Native core components** (MOBILE_PLAN.md, phase M2), alpha:

  - **Actions:** `Button` (filled/tonal/outlined/text/glass, `tone`, xs–xl, `loading`, icons), `IconButton`, `ButtonGroup`, `Link`.
  - **Data:** `Amount` (Intl, tabular, `tone="auto"`, hero `display`), `Badge` (solid/soft/outline, `dot`; covers web's deprecated Tag/StatusPill), `Avatar`, `AvatarGroup`, `Divider`.
  - **Inputs:** `TextField` (label, helper, error in one), `PasswordInput`, `SearchField`, `MoneyInput` (locale parsing), `Stepper`, `Checkbox`, `RadioGroup`/`Radio`, `Switch` (the platform switch in Nexub colours), `SegmentedControl`, `Slider`, `Chip`/`FilterChip`.
  - **Containers:** `Card`, `ListItem` (navigation/switch/checkbox/radio/button/value rows; one target, one screen-reader element), `ListSection` (inset-grouped), `Accordion`.
  - **Feedback:** `Banner`, `ToastProvider`/`useToast` (one at a time, announced; 10 s when it has an action), `Dialog`, `Progress` (linear/circular), `LoadingIndicator`, `Skeleton`, `EmptyState`, `ErrorState`.
  - Every control reaches a 44pt touch target and uses the shared state layer, press spring and semantic haptics.
  - `@nexub/core` money helpers work on Hermes for iOS, which lacks `resolvedOptions`/`formatToParts`: the same values are derived from `format()`.

- 736b9a5: **React Native support, foundations** (MOBILE_PLAN.md, phase M1):

  - New `@nexub/core`: the strings, locale direction, money formatting and shared prop types (`ToneValue`, `GlassMode`, …), now shared by web and native. `@nexub/react` re-exports everything it moved, so the web API is unchanged.
  - `@nexub/tokens/native`: tokens for React Native. Dimensions as dp numbers, colour roles resolved to hex per contrast level × scheme (plus product remaps), elevation as per-scheme `boxShadow`, and springs as Reanimated configs. A test keeps them equal to the CSS.
  - `@nexub/tokens/seed`: `createSeedRoles(seed)` returns the seeded family as `{ light, dark }` hex, for native.
  - `@nexub/icons/native`: the same icon names as `@nexub/icons`, on `lucide-react-native` (an optional peer).
  - New `@nexub/react-native` (alpha):
    - `NexubNativeProvider`: scheme, contrast (follows iOS Increase Contrast / Android high-contrast text), product, seed, glass dial (off under Reduce Transparency), Reduce Motion, haptics, locale, RTL and strings.
    - Primitives: `Text`/`Heading` (role type, Dynamic Type ramps), `Pressable` (state layer + 0.97 press spring + semantic haptics), `Surface` (tonal tiers, elevation, native Liquid Glass on iOS 26+ with a solid fallback), `Box`/`Stack`/`Inline`, `Icon` and `ScreenContainer`.
    - `nexubFonts` for `useFonts` (Inter, Plus Jakarta Sans, Geist Mono; OFL).

- 080d2a4: **React Native mobile-only components** (MOBILE_PLAN.md, phase M3), alpha:

  - **Overlays:** `BottomSheet` (detents incl. 'content', drag to resize or dismiss, grabber that cycles detents and is screen-reader operable, keyboard-aware), `ActionSheet` (the system sheet on iOS, a sheet on Android), `ContextMenu` (long-press, with the same items as accessibility actions), `Select` (a field that opens a sheet of choices).
  - **Gestures and lists:** `SwipeableRow` (swipe actions are also accessibility actions; the row is one element), themed `RefreshControl`, `Carousel` + `PageIndicator`.
  - **Payub inputs:** `OTPInput` (one field, so SMS autofill works: iOS oneTimeCode / Android sms-otp), `NumericKeypad`, `ExpressiveMoneyInput`, `DateTimeField` (platform pickers; optional peer `@react-native-community/datetimepicker`).
  - **Flow and privacy:** `StickyFooter` (primary action above the keyboard), `SensitiveValue` (masked, read as "hidden", re-masks in the background), `PrivacyShield` (covers the app-switcher snapshot; `preventCapture` with optional peer `expo-screen-capture`), `OfflineBanner`, `Coachmark`, `FAB` (Android only by default).
  - **Navigation, native chrome in Nexub colours:** `nexubStackOptions`, `nexubNavigationTheme`, `nexubTabsOptions`, `useNexubNavigation()`.
  - `@nexub/core`: mobile strings (resize, cancel, show/hide, hidden, keypad delete, code digit, offline, page, more actions).
  - `@nexub/icons`: `Delete` (backspace) icon.
  - `@nexub/react-native` exposes a `source` export condition for monorepo development; published installs use the built files.
