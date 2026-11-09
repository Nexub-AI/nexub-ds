# @nexub/react

## 7.0.1

### Patch Changes

- 3e959a7: Security and bug fixes.

  - `PasswordInput`: revealed text no longer reaches browser spellcheck, autocorrect or autocapitalize (`spellCheck={false}`, `autoCorrect="off"`, `autoCapitalize="off"`, which can't be overridden). `autoComplete` now defaults to `current-password`; pass `autoComplete="new-password"` on sign-up forms.
  - `Progress`: leaving out `value` now renders the indeterminate state as intended (no `aria-valuenow`, a sliding segment). Previously `value` defaulted to 0, so indeterminate never showed. `value={0}` is unchanged.
  - @nexub/icons@7.0.1
  - @nexub/core@7.0.1

## 7.0.0

### Minor Changes

- d13580c: 7.0: consolidate.

  - **Breaking:** `StepIndicator` is removed from @nexub/patterns. Use `<Stepper orientation="vertical" current={…}>` from @nexub/react (`currentStep` becomes `current`; `steps` works as is).
  - **Breaking:** Autocomplete's `mode` prop and its inline layout are removed. The popover (the default since 6.0) is the only layout; for an always-open list, use the Combobox parts.
  - **`nexub-migrate`**: `removed-in-7` now reports any Autocomplete `mode`; `keep-5-defaults` no longer pins `mode="inline"`.
  - See Getting Started → Migrating to 7.0.

### Patch Changes

- @nexub/icons@7.0.0
- @nexub/core@7.0.0

## 6.9.0

### Minor Changes

- 88329d9: 7.0 release candidate.

  - **Deprecated, removed in 7.0**: `StepIndicator` (@nexub/patterns), use `<Stepper orientation="vertical" current={…}>` from @nexub/react; and Autocomplete's `mode="inline"` (and so `mode`), the popover stays.
  - **`Stepper`**: a step's `id` is optional (the label is the key), so a StepIndicator `steps` array works as is.
  - **`nexub-migrate`**: new default rule `removed-in-7` reports `<StepIndicator>` and `<Autocomplete mode="inline">`.
  - Docs: Migrating to 7.0.

### Patch Changes

- @nexub/icons@6.9.0
- @nexub/core@6.9.0

## 6.8.0

### Minor Changes

- 5aec98d: Accessibility proof 4.

  - Screen-reader test scripts (VoiceOver, NVDA) for Form, TreeView, Sortable / Kanban, ResizablePanels and EventCalendar on Foundations → Accessibility.
  - Every 6.x component has Storybook stories, so axe (WCAG 2.2 AA) runs on each in light and dark in CI.
  - RTL keyboard tests: TreeView, ResizablePanels and Kanban follow the reading direction.

### Patch Changes

- @nexub/icons@6.8.0
- @nexub/core@6.8.0

## 6.7.0

### Patch Changes

- Updated dependencies [4d94b73]
  - @nexub/core@6.7.0
  - @nexub/icons@6.7.0

## 6.6.0

### Minor Changes

- 46bd41c: Inbox, export and zoom.

  - **`NotificationCenter`** (new, beta, patterns): a bell with an unread count ("Notifications, 3 unread") that opens the notification list in a popover, with "Mark all as read", dismiss and an empty state. Your app owns the notifications.
  - **`NotificationItem`**: `href` or `onSelect` makes the whole item a link or a button (the dismiss button stays separate).
  - **`toCSV(rows, columns)`** (new): CSV text per RFC 4180 with CRLF line ends. Cells that start like a spreadsheet formula (`=`, `+`, `-`, `@`) get a leading `'`, so exports can't run formulas.
  - **`ChartZoom`** (new, beta): zoom any chart to part of its range with a two-thumb slider and a reset button. Only the wrapper is a client component; charts stay server-rendered.
  - New messages: `notificationCenter`, `unreadNotifications`, `markAllRead`, `noNotifications`, `zoomStart`, `zoomEnd`, `resetZoom`.

### Patch Changes

- Updated dependencies [46bd41c]
  - @nexub/core@6.6.0
  - @nexub/icons@6.6.0

## 6.5.0

### Minor Changes

- efe17f9: Reorder.

  - **`Sortable`** (new, beta): a list people reorder by dragging an item or with Alt+ArrowUp/Down on its handle. Focus stays on the moved item's handle and every move is announced ("Alpha moved to position 3 of 5").
  - **`Kanban`** (new, beta): columns of cards. Drag cards, or Alt+ArrowUp/Down within a column and Alt+ArrowLeft/Right across columns (mirrored in RTL). Columns are regions named by their headings.
  - **`DataTable`**: `onRowOrderChange` adds a row handle column for the same drag and Alt+Arrow moves; `getRowLabel` names rows. Handles hide while a column is sorted.
  - Built on the native drag-and-drop API, the same model as DataTable column reordering: no new dependency.
  - **Icons**: `GripVertical`.
  - New messages: `moveItem`, `reorderHint`, `itemMoved`, `itemMovedToColumn`.

### Patch Changes

- Updated dependencies [efe17f9]
  - @nexub/core@6.5.0
  - @nexub/icons@6.5.0

## 6.4.0

### Minor Changes

- 5839e96: Layout and flow.

  - **`ResizablePanels`** (new, beta): panels with draggable separators (ARIA window splitter). Arrow keys move a focused separator by 5% (mirrored in RTL), Home/End to its limits, Enter back to the default split. `sizes` / `onSizesChange` in percent so your app can persist the layout; `minSizes` per panel; horizontal or vertical.
  - **`Stepper`** (new, beta): progress through a multi-step flow. `current`, `completed`, and `onStepChange` makes reachable steps clickable (linear by default, `nonLinear` to allow any). Each step reads "Step 2 of 4: Billing", with "completed" when done. Horizontal or vertical. It will replace the patterns `StepIndicator` in 7.0.
  - **`ActionBar`** (new, beta): save / cancel that stay in view at the bottom of a long form, with a polite status `message`.
  - New messages: `stepOf`, `stepCompleted`, `resizePanels`.

### Patch Changes

- Updated dependencies [5839e96]
  - @nexub/core@6.4.0
  - @nexub/icons@6.4.0

## 6.3.0

### Minor Changes

- 0290a12: Hierarchy.

  - **`TreeView`** (new, beta): an ARIA tree. Arrow keys move, open and close (mirrored in RTL), Home/End jump, typing finds an item, and the tree is one tab stop. Single selection, or `checkable` with tri-state parents (`checked` lists every checked id). `hasChildren` + `onLoadChildren` load children on first open, with the item `aria-busy` meanwhile.
  - **`DataTable`**: `getSubRows` makes a tree table. The first column gets an expand toggle and indents each level; `expanded` / `defaultExpanded` / `onExpandedChange` control it. With `pagination`, a parent and its children stay on one page.
  - New messages: `expandRow`, `collapseRow`.

### Patch Changes

- Updated dependencies [0290a12]
  - @nexub/core@6.3.0
  - @nexub/icons@6.3.0

## 6.2.0

### Minor Changes

- 653ee48: Time.

  - **`TimePicker`** (new, beta): a time field on the native `<input type="time">`. Value is 24-hour `"HH:mm"`; the display is 12 or 24 hours from the reader's locale; `minuteStep` sets the arrow-key and picker step; phones open their own picker.
  - **`DateTimePicker`** (new, beta): a `DatePicker` and a `TimePicker` that edit one `Date` (local time). `defaultTime` fills the time when the date is picked first; `timeZone` names the zone next to the fields.
  - **`EventCalendar`** (new, beta): month and week grids of events (`{ id, title, start, end?, allDay?, tone? }`). Multi-day events show on each day, month view collapses extras into "N more", the week starts on the locale's first day, and Today / previous / next / Month–Week controls are built in. Display only: `onEventClick` and `onDayClick` hand the action to your app.
  - New messages: `dateLabel`, `timeLabel`, `previousWeek`, `nextWeek`, `calendarView`, `monthView`, `weekView`.

### Patch Changes

- Updated dependencies [653ee48]
  - @nexub/core@6.2.0
  - @nexub/icons@6.2.0

## 6.1.0

### Minor Changes

- 67643af: Forms 2.0.

  - **`Form`** (new, beta): validates on submit with the browser's constraint validation (`required`, `type`, `pattern`, `min`…) plus an optional `validate(data)` for your own rules (zod plugs in here). Messages show on the matching `FormField` by `name`, the first invalid field takes focus, a field's error clears as you edit it, and `onInvalidSubmit` hands the list to `ErrorSummary`. An async `onSubmit` marks the form `aria-busy`; `useForm()` reads `{ errors, submitting }`.
  - **`FormField`**: `Root` with a `name` inside a `Form` picks up that field's error (`invalid`, and `FormField.Error` shows the message when it has no children).
  - **`Fieldset`** (new, beta): native `<fieldset>` and `<legend>` with an optional description; `disabled` disables every control inside.
  - **`InlineEdit`** (new, beta): text that becomes an input on click. Enter or blur saves, Escape reverts, focus returns to the text; a rejected `onSave` promise keeps it open and invalid.
  - **`useUnsavedChanges(dirty)`** (new): asks the browser to confirm before the page unloads while there are unsaved changes.
  - New message: `editField`.

### Patch Changes

- Updated dependencies [67643af]
  - @nexub/core@6.1.0
  - @nexub/icons@6.1.0

## 6.0.0

### Minor Changes

- 5e4fa46: 6.0: enterprise defaults. Three opt-ins from 5.x are now on by default. No component is removed and no prop is renamed. See Migrating to 6.0, and run `npx nexub-migrate src --rules keep-5-defaults --write` to keep 5.x behaviour.

  - **Autocomplete** opens its list in a popover anchored to the field (`mode` defaults to `'popover'`). Set `mode="inline"` for the 5.x inline list.
  - **DataTable / DataTableVirtual** with `enableRowSelection` show the checkbox column, with select-page and "Select all N" (`selectionColumn` defaults to `true`). Set `selectionColumn={false}` if you render your own checkboxes.
  - **FilterBar** names its search field from `searchPlaceholder` (without a trailing "…") when `searchLabel` isn't set, instead of the generic "Search".

### Patch Changes

- @nexub/icons@6.0.0
- @nexub/core@6.0.0

## 5.9.0

### Minor Changes

- c11f400: 6.0 release candidate. Feature freeze: 5.9 adds no components; it prepares the three default changes in 6.0.

  - **Migrating to 6.0** (docs): what changes and what to do. Autocomplete opens in a popover by default, DataTable with `enableRowSelection` shows the checkbox column by default, and FilterBar names its search field from `searchPlaceholder` when `searchLabel` isn't set.
  - **`nexub-migrate --rules keep-5-defaults`**: an opt-in rule that keeps 5.x behaviour by adding `mode="inline"` and `selectionColumn={false}` where 6.0 would change it. Tags with a prop spread are reported, not changed. It is not part of the default run.
  - Prop docs for `Autocomplete mode` and `FilterBar searchLabel` now state their 6.0 defaults.

### Patch Changes

- @nexub/icons@5.9.0
- @nexub/core@5.9.0

## 5.8.0

### Minor Changes

- 151a74b: Accessibility proof for the 5.x components.

  - **`DataTable grid`**: an ARIA grid keyboard model for tables whose cells hold actions. The table becomes one tab stop; Arrow keys move between cells and the controls inside them, Home/End go to the row ends, and Ctrl+Home/End go to the corners. RTL mirrors Left and Right. Works with DataTableVirtual.
  - **Calendar day names** (DatePicker, DateRangePicker): days are now named with Intl's full date ("Monday, November 2, 2026") instead of the ordinal "2nd", so the visible number is part of the name (WCAG 2.5.3, for voice control).
  - **CommandPalette separators** no longer use `role="separator"` inside the listbox (ARIA allows only options and groups there).
  - **axe on open popups**: CI now opens MultiSelect, Autocomplete, SavedViews, DateRangePicker, CommandPalette, AlertDialog Confirm and the DataTable View menu, then scans them. Popups render outside the story root, so they were never scanned before.
  - **Screen-reader test scripts**: step-by-step VoiceOver and NVDA checks for 10 complex components, on the Accessibility conformance page.

### Patch Changes

- @nexub/icons@5.8.0
- @nexub/core@5.8.0

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

### Patch Changes

- Updated dependencies [18bbb2e]
  - @nexub/core@5.7.0
  - @nexub/icons@5.7.0

## 5.6.0

### Minor Changes

- b71b56f: States and safety.

  - **`EmptyStatePreset`** (new): ready-made empty states (`noData`, `noResults`, `noAccess` for 403, `serverError` for 500, `offline`), with an icon, localised title and description, and optional `actions`. Errors are announced. `EmptyState` itself stays a server component.
  - **`AlertDialog.Confirm`**: type-to-confirm for irreversible actions. The Action button stays disabled until the given `text` (for example, the resource name) is typed.
  - **`OTPInput`** (new, beta): one box per digit with `autocomplete="one-time-code"`, so codes from SMS fill every box. Supports paste-to-fill, Backspace and arrow keys, `onComplete`, `mode="alphanumeric"`, `invalid` and `name` for forms.
  - **`FileUpload.Item`**: `progress` (0–100) shows a bar, `onCancel` swaps the remove button for "Cancel upload" while uploading, and `error` shows why a file failed. Your app does the upload.
  - **Icons**: `Inbox`, `ServerCrash`, `WifiOff`.
  - New messages: `emptyStates`, `typeToConfirm`, `verificationCode`, `uploadProgress`, `cancelUpload`.

### Patch Changes

- Updated dependencies [b71b56f]
  - @nexub/icons@5.6.0
  - @nexub/core@5.6.0

## 5.5.0

### Minor Changes

- 04ff65b: Filters and views.

  - **`FilterBuilder`** (new, beta): builds AND/OR filter queries with nested groups (`maxDepth`, default 1). The output is plain JSON (`FilterGroup` / `FilterRule`), which your app runs. Field types `text`, `number`, `select` and `date` each get their own operators and value input. Helpers: `emptyFilter`, `countFilters`, `isFilterGroup`, `filterOperators`.
  - **`SavedViews`** (new, beta): a menu to switch, save (asks for a name), update and delete views. UI only: your app stores them.
  - **`DateRangePicker`**: `presets` (`true` gives Today, Last 7 days, Last 30 days, Month to date and Last month, or pass your own) and `timeZone`, shown under the calendar and used to count "today". `todayIn(zone)` is exported.
  - **`FilterBar`** (patterns): `activeCount` shows "N filters", and `onClearAll` adds a Clear all button.
  - Docs: removed DateRangePicker props that never existed (`numberOfMonths`, `error`).
  - New messages for presets, the filter builder, saved views and the filter bar. `filterOperators` is one object: overriding it replaces all its labels.

### Patch Changes

- Updated dependencies [04ff65b]
  - @nexub/core@5.5.0
  - @nexub/icons@5.5.0

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

### Patch Changes

- Updated dependencies [253949f]
  - @nexub/core@5.4.0
  - @nexub/icons@5.4.0

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

### Patch Changes

- Updated dependencies [8988b87]
  - @nexub/core@5.3.0
  - @nexub/icons@5.3.0

## 5.2.0

### Minor Changes

- 5f2ef4d: Combobox 2.0 and MultiSelect.

  - **`MultiSelect`** (new, beta): pick several options, shown as chips in the field. Search filters the list. Extra chips collapse into "+N more" (`maxVisibleChips`, default 3). Backspace in an empty field removes the last chip. Options carry `aria-checked`, and each chip has a "Remove ‹label›" button. Also supports `onInputChange` for fetching as you type, `onCreate` and `loading`.
  - **`Autocomplete`**: `mode="popover"` turns it into a field whose list opens below it while typing. `aria-expanded` follows the list. Inline stays the default until 6.0. New `onCreate` adds a "Create “text”" option, and `aria-label` and `disabled` are supported.
  - **Loading** in Autocomplete and MultiSelect shows skeleton rows instead of text. "Loading" is still announced.
  - **`Chip`**: new `removeLabel` prop for the dismiss button's accessible name.
  - New messages: `createOption`, `removeOption`.

### Patch Changes

- Updated dependencies [5f2ef4d]
  - @nexub/core@5.2.0
  - @nexub/icons@5.2.0

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

### Patch Changes

- Updated dependencies [60fed18]
  - @nexub/core@5.1.0
  - @nexub/icons@5.1.0

## 5.0.1

### Patch Changes

- b5a4915: Combobox and Autocomplete no longer scroll the page to their highlighted item when they mount. An inline list below the fold used to pull the window down to itself on load; the highlighted item now scrolls into view inside the list only.
  - @nexub/icons@5.0.1
  - @nexub/core@5.0.1

## 5.0.0

### Minor Changes

- 539443c: 5.0: Vivid by default, React 19.

  - **Vivid is the default expression.** `ThemeProvider` sets `data-expression="vivid"` on `<html>` when the app has not set one. Import `@nexub/themes/vivid` to see it. Keep the 4.x look with `data-expression="calm"` on `<html>` or `<ThemeProvider defaultExpression="calm">`. Calm stays fully supported.
  - **React 19 required.** `react` and `react-dom` peers are now `>=19 <20` in `@nexub/react`, `@nexub/patterns` and `@nexub/marketing`.
  - The 4.9 development warnings are removed. No component API changes. See /getting-started/migrating-to-5.

### Patch Changes

- @nexub/icons@5.0.0
- @nexub/core@5.0.0

## 4.9.0

### Minor Changes

- 36e3ece: 5.0 release candidate. The API is frozen until 5.0, which changes only what this release warns about.

  - **Vivid becomes the default in 5.0** for apps that do not set `data-expression`. `data-expression="calm"` is now an explicit value: set it on `<html>` to keep today's look after 5.0. `ThemeProvider` warns once in development when no `data-expression` is set.
  - **React 18 support is deprecated;** 5.0 requires React 19. `ThemeProvider` warns once in development on React 18.
  - New guide: Getting started → Migrating to 5.0.

### Patch Changes

- @nexub/icons@4.9.0
- @nexub/core@4.9.0

## 4.8.0

### Minor Changes

- c8eee68: Agent UI kit.

  - **`PlanTracker`**: an agent's plan as ordered steps (done, active, pending, failed), with each status read out and `aria-current="step"` on the active one.
  - **`ToolCall`**: one tool call, its name and a status badge, expandable to its input and output. A native `<details>`, so it opens from the keyboard with no JavaScript.
  - **`ApprovalCard`**: the agent asks before it acts. Approve or Deny, called back once, with the outcome announced.
  - **`DiffView`**: a unified diff for proposed changes, with added and removed lines spelled out for screen readers.
  - `PlanTracker`, `ToolCall` and `DiffView` are server components.

### Patch Changes

- @nexub/icons@4.8.0
- @nexub/core@4.8.0

## 4.7.0

### Minor Changes

- d55cacc: Docs site remix and `useScopedSeed`.

  - **`useScopedSeed(ref, seed)`**: recolours one element and everything inside it from a brand seed, like `<ThemeProvider seed>` but scoped, for previewing a customer brand on one card or section. CSP-safe (CSSOM) and lazy-loads `@nexub/tokens/seed`.
  - **nexub.design landing:** the hero now runs on the library itself, with `Aurora` and Vivid. A "Remix this page" bar recolours it live from six brand seeds and switches between Calm and Vivid, with a link to the theme builder.

### Patch Changes

- @nexub/icons@4.7.0
- @nexub/core@4.7.0

## 4.6.0

### Minor Changes

- be4e1b5: Shape, Glass 3.0 and interactive legends.

  - **Squircle corners:** `data-shape="squircle"` on any area gives its rounded corners the continuous, Apple-style curve where CSS `corner-shape` is supported; other browsers keep normal round corners.
  - **Glass 3.0 edge:** a specular rim that catches light like a lens. On by default for glass surfaces under `data-expression="vivid"`; anywhere else add `nx-glass-edge`. Off for reduced transparency and forced colours.
  - **`ChartToggle`:** wraps any chart with a legend whose entries are toggle buttons (`aria-pressed`). Colours stay stable as series hide, and the last series always stays on.

### Patch Changes

- @nexub/icons@4.6.0
- @nexub/core@4.6.0

## 4.5.0

### Minor Changes

- d100be5: Charts 2.0.

  - **`Gauge`**: progress toward a target on a 270° arc, with the value in the centre.
  - **`Heatmap`**: intensity over a grid (activity by weekday and week, load by hour) in seven steps of the sequential chart palette.
  - **`Funnel`**: drop-off through ordered steps, with conversion from the first step in the data table.
  - **`KpiTile`**: a headline number with its change versus last period (green or red, `invert` for metrics where down is good) and a sparkline.
  - **Crosshair**: hovering a category in `BarChart` and `LineChart` now draws a vertical guide through it alongside the tooltip.
  - All are server components with no style attributes, palette colours, and a hidden table or caption for screen readers.

### Patch Changes

- @nexub/icons@4.5.0
- @nexub/core@4.5.0

## 4.4.0

### Minor Changes

- 4738403: Page and state transitions.

  - **`SharedElement`**: gives its child a `view-transition-name` (through the CSSOM, so CSP-safe). Wrap the same thing on both sides, say a list avatar and the detail avatar, run the change in `startViewTransition()`, and the browser morphs one into the other.
  - **`ScrollProgress`**: a thin bar along the top that fills as the page scrolls, driven by a CSS scroll timeline. No JavaScript, server component, the Vivid gradient under `data-expression="vivid"`. Hidden where unsupported and under reduced motion.
  - **`FloatingInput`**: the label sits inside the empty field and floats above the value on focus or input. Pure CSS, server-safe, and the label stays a real `<label>`.

### Patch Changes

- @nexub/icons@4.4.0
- @nexub/core@4.4.0

## 4.3.0

### Minor Changes

- f2ee0a3: Micro-interactions.

  - **`Card effect="tilt"`**: the card leans toward the pointer in 3D while the sheen catches the light.
  - **`Button magnetic`**: the button drifts a few pixels toward the pointer. For one key action per screen.
  - **`Celebrate`**: a short confetti burst in the chart palette for a real win (first payment, onboarding done). Decorative, so announce the win in text too.
  - **Pure CSS details:** the Switch thumb stretches toward where it is going while pressed; a field shakes once when it becomes invalid (`aria-invalid`); the focus ring on controls pops out instead of appearing.
  - Pointer effects run only with a fine pointer; everything is off under reduced motion. Pointer positions go through the CSSOM, so it all stays strict-CSP safe.

### Patch Changes

- @nexub/icons@4.3.0
- @nexub/core@4.3.0

## 4.2.0

### Minor Changes

- b3425fe: Vivid: the opt-in expressive layer.

  - **`@nexub/themes/vivid`** with `data-expression="vivid"` on `<html>` or any area. Everything is scoped to that attribute, so apps that never set it are unchanged.
  - **Accent gradient** from your primary colour, sweeping 50° round the hue wheel at the same lightness (blue to violet, green to teal), so every brand gets its own pair and on-primary text keeps its contrast. Filled buttons get the gradient, a soft accent glow and a small lift on hover; switches, checkboxes, radios and progress bars use it too.
  - **Tinted depth:** elevation shadows take the accent instead of grey, and interactive cards pick up a gradient edge and glow on hover. Controls get a soft accent halo around the focus ring.
  - **`Aurora`**: a new decorative background of slow-drifting colour fields from your accent roles (deeper and more saturated in dark mode). Server component, `aria-hidden`; still under reduced motion, hidden in forced colours.
  - High contrast turns the gradients into flat fills and removes the glow. Browsers without CSS relative colours keep the flat fills.
  - `Button` and `Card` now expose `data-variant` as a styling hook.
  - New docs page: Foundations → Expression, with Calm and Vivid side by side.

### Patch Changes

- @nexub/icons@4.2.0
- @nexub/core@4.2.0

## 4.1.0

### Minor Changes

- f808dce: Quality first: full test coverage and interactive charts.

  - **Every component is now covered by the automated accessibility run.** The 24 components and marketing sections that had no Storybook story (the charts, MoneyInput, NavigationRail, Sheet, SplitButton, Float, Marquee, Reveal and every `@nexub/marketing` section) now have one, so axe-core (WCAG 2.2 A/AA, light and dark) and the screenshot suite run on them on every change. `@nexub/react/accessibility.json` reports 116 of 116 components covered.
  - **Charts: negative values.** `BarChart` and `LineChart` take values below zero: the axis spans zero, a zero line is drawn, and bars grow up or down from it (stacked bars stack positives and negatives separately). New `niceDomain(values)` helper.
  - **Charts: hover tooltip.** Hovering a category highlights it and shows every series value, built from CSS over the plot, so the charts stay server components with no JavaScript and no style attributes. Screen readers keep the data table.
  - **Charts: draw-in.** Bars grow from the zero line and lines reveal left to right on first paint (`.nx-chart-bar`, `.nx-chart-line` in `@nexub/themes`), off under reduced motion.
  - **MarketingNav accessibility (WCAG 2.5.3 Label in Name).** The logo link no longer overrides its name with "Home"; it takes the logo's own name ("Nexub"), so it matches the visible wordmark. `logoLabel` still overrides it. The country switcher's name now starts with the visible code ("SG, Choose country: Singapore").

### Patch Changes

- @nexub/icons@4.1.0
- @nexub/core@4.1.0

## 4.0.0

### Patch Changes

- @nexub/icons@4.0.0
- @nexub/core@4.0.0

## 3.9.0

### Patch Changes

- @nexub/icons@3.9.0
- @nexub/core@3.9.0

## 3.8.0

### Minor Changes

- d9f23e4: Accessibility conformance report.

  - **`@nexub/react/accessibility.json`**: a WCAG 2.2 AA conformance report for every component and pattern, generated from the test suite and the docs at each release. Per component: the automated result (axe-core WCAG 2.2 A/AA on every Storybook story in light and dark: pass, pass with a documented exception, or not covered), the documented keyboard behaviour and the screen-reader notes. It also states the method and lists every accepted exception, for procurement and audit tooling.
  - **Docs page**: Foundations → Accessibility shows the report, with counts and a row per component. It is honest about the gaps: components no story renders yet are marked "not covered", and recorded screen-reader sessions are not published yet.

### Patch Changes

- @nexub/icons@3.8.0
- @nexub/core@3.8.0

## 3.7.0

### Patch Changes

- @nexub/icons@3.7.0
- @nexub/core@3.7.0

## 3.6.0

### Patch Changes

- @nexub/icons@3.6.0
- @nexub/core@3.6.0

## 3.5.0

### Patch Changes

- 488f288: `Toaster` clears its pending "remove from the store" timers when it unmounts, so none fires after the tree is gone (it could throw in test environments after teardown).
  - @nexub/icons@3.5.0
  - @nexub/core@3.5.0

## 3.4.0

### Patch Changes

- @nexub/icons@3.4.0
- @nexub/core@3.4.0

## 3.3.0

### Patch Changes

- @nexub/icons@3.3.0
- @nexub/core@3.3.0

## 3.2.0

### Minor Changes

- ca3f2f1: Charts kit.

  - **`BarChart`** (grouped or `stacked`), **`LineChart`** (optional `area`), **`DonutChart`** (with a `center` slot), **`Sparkline`** and **`ChartLegend`**. Charts take `data` rows, an `index` key for the categories and a `series` list (`{ key, label?, color? }`), and colour each series from the categorical `--color-chart-1…8` palette, so they follow light, dark, high contrast and every product brand.
  - **Server components with no dependencies.** The charts are plain SVG with no hooks, so they render in React Server Components and ship no JavaScript (3.5 kB gzip for the whole kit). Geometry is SVG attributes only, so the server HTML is valid under a strict CSP.
  - **Accessible by default.** Each chart is a `figure` named by `title`, with a visually hidden data table holding every value. The legend and table name each series, so colour is never the only cue. Axis labels mirror in RTL.
  - Import from `@nexub/react` or per component from `@nexub/react/Chart`. Values are 0 or more; hover text is the native SVG title.

### Patch Changes

- @nexub/icons@3.2.0
- @nexub/core@3.2.0

## 3.1.0

### Minor Changes

- 9bf12bc: Marketing mode and server components.

  - **Server components.** `@nexub/react` is now compiled one file per module, each with its own `'use client'` or none, so presentational components (Heading, Text, Container, Section, Stack, Badge, EyebrowChip, Logo, Float, Marquee) render as React Server Components and interactive ones stay client components. Every component can be imported on its own (`@nexub/react/Button`), and `cn` from `@nexub/react/cn`. In Next.js, import per component or set `optimizePackageImports`: a page with Hero, StatBand and CTABand went from 181 kB to 19.4 kB of page JavaScript. `SplitButton` is a client component. Nothing changes for client-only apps.
  - **New package `@nexub/marketing`**: Hero, SectionHeader, LogoStrip, StatBand and StatBandItem, TestimonialGrid and TestimonialCard, ProductGrid and ProductCard, HowItWorks, FeatureSplit, CTABand, FAQ, PricingTable, MarketingNav (mega-menu, country switcher, mobile sheet) and MarketingFooter (tools marquee). Server components except the nav, pricing and FAQ.
  - **`@nexub/themes/marketing`**: the nexub.com look, only under `data-mode="marketing"`, so apps that don't set it see no change. Heavier headings, the hero backdrop, accent line, motion (rise, reveal, float, drift, ping, marquee, bar fill) on the spring tokens, and nothing moves under reduced motion.
  - **`@nexub/themes/core`**: `base` without the fonts and the page backdrop, for apps that bring their own (Next.js `next/font` sets `--font-family-sans` and `--font-family-display`). `base` is unchanged. `@nexub/themes/fonts` is exported too.
  - **Tokens**: a `marketing` group (hero button gradient on primary tones 45 → 40, glow, eyebrow gradient, 24px showcase card radius and shadows, floating-card shadow, accent line, lifts), the `display-xl` type role (64/68, 800) and `container-marketing` (1280px).
  - **Components**: `Button variant="hero"`, `Card variant="showcase"` with `accent`, `EyebrowChip variant="gradient"` and `live`, `Container size="marketing"`, `NumberTicker countOnView`, and the new `Reveal`, `Float` and `Marquee`. Each looks like its plain variant outside marketing mode.
  - **Patterns**: `PlanCard` takes `ctaHref` to make its button a link.
  - **React Native**: the `display-xl` role maps to `largeTitle`.

### Patch Changes

- @nexub/icons@3.1.0
- @nexub/core@3.1.0

## 3.0.0

### Minor Changes

- 1ea35c1: **Breaking:** `Banner`, `Callout`, `Tag` and `StatusPill` are removed, along with `BannerProps`, `CalloutProps`, `TagProps`, `StatusPillProps`, `bannerVariants`, `calloutVariants`, `tagVariants` and `statusPillVariants`. They had been deprecated since 1.1. Use `Alert` and `<Badge variant="soft">` instead. `npx nexub-migrate src --write` rewrites them, and reports the few uses it can't rewrite (`StatusPill dot`, the `*Variants` exports, uses outside JSX). See the Migrating to 3.0 page.

### Patch Changes

- @nexub/icons@3.0.0
- @nexub/core@3.0.0

## 2.9.0

### Patch Changes

- @nexub/icons@2.9.0
- @nexub/core@2.9.0

## 2.8.0

### Minor Changes

- e85caa3: API consistency. A shared `Size` type (`'sm' | 'md' | 'lg'`) is exported and used by Flag, Label, SegmentedControl, NumberInput, CountryBadge and Logo; Amount and Dialog extend it. `PasswordInput` gains `visible`, `defaultVisible` and `onVisibleChange` so the reveal toggle can be controlled. `SearchInput` now uses `useControllableState`, with no change in behaviour.
- 1ad3138: Dependency upgrades. `@nexub/icons` now uses lucide-react 1.x; every exported icon keeps its name, and a few glyphs are redrawn upstream. `DatePicker` and `DateRangePicker` use react-day-picker 10; their props and behaviour are unchanged. The packages are now built with TypeScript 6.0, tsup 9 and vite 8.

### Patch Changes

- Updated dependencies [1ad3138]
  - @nexub/icons@2.8.0
  - @nexub/core@2.8.0

## 2.7.0

### Minor Changes

- 3ca7a3f: Component token tier. Button, the text fields (Input, Textarea, Select), Card and Badge now read component tokens such as `--button-filled-bg`, `--field-border` and `--card-radius`, each falling back to the role it used before, so nothing changes by default. Set one on any element to restyle that component below it, without changing the roles other components share. The tokens are unset by default, so nested `data-theme`, `data-contrast` and `data-product` keep working. The list is published in DTCG format as `@nexub/tokens/json/component`, and a test keeps it in step with the components.
- c8df535: `ThemeScript` takes an optional `contrastStorageKey`. When set, a stored contrast level (`standard`, `medium` or `high`) is applied as `data-contrast` before first paint, so a saved contrast choice doesn't flash. The docs header now has a contrast switcher (Auto, Medium, High) that uses it.

### Patch Changes

- @nexub/icons@2.7.0
- @nexub/core@2.7.0

## 2.6.0

### Minor Changes

- 43c5314: Prebuilt CSS: `import '@nexub/react/styles.css'` gives you every style the components need (themes, product brands, the Inter and Plus Jakarta Sans fonts, the utilities they use), so you can use `@nexub/react` without Tailwind. It's all in cascade layers, so your own CSS always wins. Apps already on Tailwind 3 or 4 with the Nexub preset don't need it and keep working as before.
- 9d8bc9b: `cn()` now uses tailwind-merge 3. Class merging is unchanged: every `cn()` call made across the test suite (421 distinct inputs) gives the same result as on tailwind-merge 2. A bare `outline` still counts as the outline style, as Tailwind 3 reads it, so focus rings keep working in Tailwind 3 apps.

### Patch Changes

- @nexub/icons@2.6.0
- @nexub/core@2.6.0

## 2.5.0

### Minor Changes

- 3363ede: Start of the 3.0 runway (2.5.0).

  - `Banner`, `Callout`, `Tag` and `StatusPill` now log a one-time `console.warn` in development naming their replacement (`Alert` or `Badge`) and the 3.0 removal, as GOVERNANCE.md requires before a removal. Production builds stay silent.
  - `NotificationItem` and `ActivityFeed` take their accessible labels from `NexubProvider` messages: new keys `unread`, `dismissNotification` and `activityFeed`. The English defaults are unchanged.

### Patch Changes

- Updated dependencies [3363ede]
- Updated dependencies [9a97fb4]
  - @nexub/core@2.5.0
  - @nexub/icons@2.5.0

## 2.4.0

### Minor Changes

- 89acedb: Release hardening (2.4.0). No API changes.

  - Each `@nexub/react-native` preview example is now checked on a real iOS simulator and Android emulator against committed screenshot baselines, so an unintended visual change fails CI the way web visual regression already does. The docs show the same screenshots under "On device" on native component pages.
  - Deprecated components (Banner, Callout, Tag, StatusPill) now have a removal target: 3.0. See GOVERNANCE.md for the status lifecycle (alpha → beta → stable → deprecated) and the deprecation policy.

### Patch Changes

- da054ef: Governance and component status. New `GOVERNANCE.md`: RFCs (when they are required and a template), who decides, the `alpha → beta → stable → deprecated` lifecycle with promotion criteria, and the deprecation policy (deprecate in a minor, remove only in the next major). The `@deprecated` JSDoc on `Banner`, `Callout`, `Tag` and `StatusPill` now says their removal is planned in 3.0 (it said 1.0); no behaviour change. The docs show a status badge on every component page, including Alpha on the React Native pages, and a "Deprecated — removal planned in 3.0" notice with the replacement on deprecated ones; the AI references in `@nexub/mcp` carry the same removal note.
  - @nexub/icons@2.4.0
  - @nexub/core@2.4.0

## 2.3.1

### Patch Changes

- c67c72a: Published with npm trusted publishing (OIDC) from the `Nexub-AI/nexub-ds` release workflow, so every version now carries npm provenance: you can check on npmjs.com that it was built from this repository's source. No code changes.
- Updated dependencies [c67c72a]
  - @nexub/icons@2.3.1
  - @nexub/core@2.3.1

## 2.3.0

### Minor Changes

- 5771f93: `Sidebar.Footer` now sticks to the bottom of the sidebar (sidebar surface, top border) while the items scroll. `SettingsLayout` takes a new `navFooter` prop, pinned to the bottom of the section sidebar and the phone section menu, e.g. `navFooter="v1.2.0 · Updated 21 Oct 2026"`.

### Patch Changes

- 23d164c: Tailwind CSS 4 support. Consumers on Tailwind 3 are unaffected: keep using the `@nexub/tokens/tailwind` preset.

  - `@nexub/tokens`: the optional `tailwindcss` peer now accepts `^3.0.0 || ^4.0.0`. The v4 theme (`@import "@nexub/tokens/tailwind.css"`) now renders like the v3 preset in two places where it did not:
    - `max-w-sm` … `max-w-2xl` are Tailwind's own scale again (24rem … 42rem). Before, they picked up the Nexub `--container-*` layout tokens of the same name and rendered much wider. `max-w-container-*` still map to the tokens.
    - `text-xs` … `text-4xl` keep v3's line-height lengths (`text-sm` = 1.25rem) instead of v4's unitless ratios, so components nested in `text-sm` (a badge in a table cell, for example) keep their height.
  - `@nexub/themes`: `base.css` gives buttons the pointer cursor that Tailwind 3's preflight set and Tailwind 4's no longer does. It has zero specificity, so `cursor-*` utilities still win.
  - `@nexub/react`: `Pagination` page buttons set `tabular-nums` themselves. The nav already asked for tabular figures, but on Tailwind 3 the buttons never inherited them; on Tailwind 4 they did. Both now show tabular figures.
  - The docs site and Storybook are now built with Tailwind 4. Getting Started documents both setups, including importing the theme CSS into the `base` layer on v4.
  - @nexub/icons@2.3.0
  - @nexub/core@2.3.0

## 2.2.0

### Minor Changes

- 8226753: **Motion on the spring tokens, web and native:**

  - `Fade`, `Slide`, `Scale` and `Collapse` ride the spring tokens: opacity on `effects`, movement on `spatial`, and a quicker exit that never overshoots. `duration` maps to fast / default / slow springs. Passing `easing` keeps the old duration + easing tokens, so existing code can opt out. Under reduced motion they keep the fade and drop travel and scale.
  - `Drawer` / `Sheet` slide on the springs instead of vaul's fixed 0.5 s curve. Exit is quicker, and the panel fades instead of sliding under reduced motion.
  - New `ListTransition`: keyed items grow in, and removed items collapse and fade out in place. It works as `<ListTransition as="ul" itemAs="li">`.
  - New `SkeletonSwap`: crossfades from a skeleton to the loaded content and sets `aria-busy` while loading.
  - New `usePrefersReducedMotion()` hook.
  - `@nexub/themes/base`: `nx-stagger` (children rise in 40 ms apart), plus the `nx-list-item` and `nx-swap` keyframes the components use.
  - `@nexub/react-native`: `nxEnter`, `nxExit`, `nxLayout` (Reanimated layout animations) and `nxSpring` (a `withSpring` config), built from the same spring tokens. All of them follow the OS Reduce Motion setting.
  - Native animations:
    - Toast and Banner animate in and out.
    - `ListSection` rows grow in and fade out while the other rows glide into place.
    - `SwipeableRow` slides out toward the start edge when removed.
    - `Chip` glides to its new width and its check pops in.
    - The `SegmentedControl` pill slides between segments.
    - `Amount` has an opt-in `animate` prop.
    - Skeleton pulses at the web rhythm.

### Patch Changes

- @nexub/icons@2.2.0
- @nexub/core@2.2.0

## 2.1.0

### Minor Changes

- 736b9a5: **React Native support, foundations** (MOBILE_PLAN.md, phase M1):

  - New `@nexub/core`: the strings, locale direction, money formatting and shared prop types (`ToneValue`, `GlassMode`, …), now shared by web and native. `@nexub/react` re-exports everything it moved, so the web API is unchanged.
  - `@nexub/tokens/native`: tokens for React Native. Dimensions as dp numbers, colour roles resolved to hex per contrast level × scheme (plus product remaps), elevation as per-scheme `boxShadow`, and springs as Reanimated configs. A test keeps them equal to the CSS.
  - `@nexub/tokens/seed`: `createSeedRoles(seed)` returns the seeded family as `{ light, dark }` hex, for native.
  - `@nexub/icons/native`: the same icon names as `@nexub/icons`, on `lucide-react-native` (an optional peer).
  - New `@nexub/react-native` (alpha):
    - `NexubNativeProvider`: scheme, contrast (follows iOS Increase Contrast / Android high-contrast text), product, seed, glass dial (off under Reduce Transparency), Reduce Motion, haptics, locale, RTL and strings.
    - Primitives: `Text`/`Heading` (role type, Dynamic Type ramps), `Pressable` (state layer + 0.97 press spring + semantic haptics), `Surface` (tonal tiers, elevation, native Liquid Glass on iOS 26+ with a solid fallback), `Box`/`Stack`/`Inline`, `Icon` and `ScreenContainer`.
    - `nexubFonts` for `useFonts` (Inter, Plus Jakarta Sans, Geist Mono; OFL).

### Patch Changes

- Updated dependencies [c5cd6c5]
- Updated dependencies [736b9a5]
- Updated dependencies [080d2a4]
  - @nexub/core@2.1.0
  - @nexub/icons@2.1.0

## 2.0.0

### Patch Changes

- @nexub/icons@2.0.0

## 1.9.0

### Minor Changes

- 842ab9c: 1.9.0 — foundations (ENHANCEMENTS_PLAN.md release tracker).

  - **Brand theming from a seed colour.** `ThemeProvider seed="#e4572e"` (and `seedTarget="tertiary"` for a product brand) regenerates the accent roles at runtime with the same HCT tone table as the built-in themes, so contrast pairs stay AA in light, dark and every contrast level. The colour maths loads lazily, only when `seed` is set, and is applied through the CSSOM (strict-CSP safe). For SSR, `createSeedTheme()` / `createSeedThemeCss()` from the new `@nexub/tokens/seed` entry give the same values as data or CSS.
  - **Tailwind v4.** `@import "@nexub/tokens/tailwind.css"` after `@import "tailwindcss"` gives v4 apps the same utilities as the v3 preset (colour roles, shapes, elevation, type roles, spring timings, spacing), generated from the same token data and tested against Tailwind 4.3. The v3 preset is unchanged.

### Patch Changes

- @nexub/icons@1.9.0

## 1.8.0

### Minor Changes

- 2e931b7: 1.8.0 — adoption (ENHANCEMENTS_PLAN.md release tracker).

  - **`npx nexub-migrate`** (ships in `@nexub/tokens`): moves app code onto current conventions — legacy colour names → roles, physical → logical (RTL) classes; reports tailwindcss-animate classes and dead `[var(--x)]/NN` opacity modifiers. Dry run by default, `--write` to apply, `--check` for CI.
  - **Upgrading guide** and an **example dashboard** in the docs, built only from public APIs.
  - **DataTable**: `DataTableColumn<T>` type export, column alignment (`meta.align`), `caption`/`captionHidden`, `aria-label` on the table itself, translatable pager; sort buttons no longer submit forms; translatable empty state (default text is now "No results found."). Note: the `ColumnMeta` augmentation adds an `align` field to TanStack's column meta.
  - **Table.Root** is keyboard-scrollable (named region) when it overflows. **Kbd** keeps shortcut order in RTL. **NumberTicker** no longer reverses digits in RTL.
  - **StatCard** `sentiment` (colour independent of the arrow); **PageHeader** `level`; **SplitButton** `status="loading"` disables the menu toggle.
  - **AppHeader** `position` (`fixed` default, `sticky`, `static`) and translatable strings via NexubProvider.

### Patch Changes

- @nexub/icons@1.8.0

## 1.7.0

### Minor Changes

- 839c92c: 1.7.0 — hardening (ENHANCEMENTS_PLAN.md release tracker).

  - **Date pickers follow the reader.** `DatePicker` / `DateRangePicker` take a date-fns `locale` (or `NexubProvider dateLocale`) for month and weekday names, week start and the trigger format, follow `dir` (arrows and range bands flip in RTL), and their calendar labels are translatable messages.
  - **FileUpload** is a native `<label>` around the file input: one control with the visible text as its name (no nested buttons), keyboard and click open the picker natively, and file sizes format with `Intl` in the active locale.
  - **Accessibility fixes found by automated checks over every story:** a nameless `Avatar` is decorative (`aria-hidden`) instead of an unnamed image; `ScrollArea` viewports are keyboard-scrollable; `ActivityFeed` is a plain list (its `feed` role broke list semantics); the `NotificationItem` unread dot has an image role.
  - `Toast.Root` follows the finger when swiped, and toasts swipe toward the inline end in RTL.
  - Releases publish with npm trusted publishing only — no long-lived npm token.

### Patch Changes

- @nexub/icons@1.7.0

## 1.6.0

### Minor Changes

- f34aaa2: Dependency refresh (Radix UI, date-fns, React 19.3 floor). With `@radix-ui/react-toggle-group` 1.2, `ToggleGroup` and `SegmentedControl` expose better ARIA roles: a single-select root is now `role="radiogroup"` with `role="radio"` / `aria-checked` items (was `group` / `aria-pressed`), and a multi-select root is `role="toolbar"`. Update any tests or selectors that query `role="group"` on these components.
- d42a650: Wave 1 — secure and consistent (ENHANCEMENTS_PLAN.md).

  - **Strict CSP.** Layout and text components render scale values as classes, so server HTML carries no `style` attribute (blocked under `style-src` without `'unsafe-inline'`): `Stack`/`Flex`/`Grid` (`gap`, `align`, `justify`, `cols`, `rows`), `Text` `lineClamp` 1–6, `Heading`/`Label`/`HelperText` `tone`, `AspectRatio` common ratios, `Skeleton` defaults, `GradientDivider`, auto-growing `Textarea`. Off-scale values still fall back to inline style. `Progress` sets its fill through the CSSOM.
  - **Every component on Calm Depth.** The ~45 components the refresh hadn't reached now use colour roles, shape and elevation tokens, the global focus ring, colour-based disabled states and the state layer. Brand tones (`leap`, `bookub`, `payub`, `founderub`) now tint text in `Heading`, `Label`, `HelperText` and `EyebrowChip` instead of falling back.
  - **Brand accent roles.** `--color-leap`, `--color-on-leap`, `--color-leap-container`, `--color-on-leap-container` (and the same for `bookub`, `payub`, `founderub`), with light/dark and high-contrast values, plus Tailwind colours of the same names. New `--gradient-brand-vertical`.
  - **Spring enter/exit.** Overlays, menus, tooltips and toasts animate with `nx-motion` (themes/base.css): opacity on the effects spring, scale and travel on the spatial spring, quicker exits, and a crossfade-only fallback under reduced motion. Components no longer depend on `tailwindcss-animate` (the preset still registers it for your own classes).

- 28bced6: Wave 2 — cards, effects and motion (ENHANCEMENTS_PLAN.md).

  - **Cards.** `Card variant="interactive"` lifts 2px on a spring with elevation 1 → 2 and sinks on press (`nx-lift`; hover only where a real pointer hovers). Opt-in `effect="sheen"`: a soft light and rim follow the pointer (off for touch, reduced motion and reduced transparency). New `CardLink` makes the whole card one link with the focus ring on the card. New `usePointerSheen` hook.
  - **New components.** `RadioCardGroup`/`RadioCard` and `CheckboxCard` (selectable cards with a springing check badge), `MediaCard` (image with a glass caption and optional stretched link), `NumberTicker` (rolling digits; `Amount animate`, `StatCard animate`), and `BentoGrid`/`BentoTile` in patterns (container-query tiles).
  - **Toasts stack.** `Toaster` shows the newest toast with older ones peeking behind it and fans them out on hover or focus (timers pause meanwhile). New props `expand` and `visibleToasts`. Closed toasts are now removed from the store.
  - **Motion.** Checkbox checks draw in; `nx-reveal` crossfades content in; `AppHeader condense` shrinks the bar on scroll with a CSS scroll timeline; opt-in page transitions via `@nexub/themes/view-transitions` and `startViewTransition()`. Tooltips and hover cards share hover-intent delays. Under reduced motion, overlays now keep a short crossfade instead of popping in.
  - **Tokens.** New `--color-scrim` role.

- c57d385: Wave 3 — colour and UX (ENHANCEMENTS_PLAN.md).

  - **Data-viz colour.** `--color-chart-1..8` are now generated, light/dark aware, ≥3:1 on surfaces and tested to stay distinguishable under protanopia, deuteranopia and tritanopia (CIEDE2000 ≥ 10 between neighbours). New sequential `--color-chart-seq-1..7` and diverging `--color-chart-div-1..7`; Tailwind `chart` colours follow.
  - **Wide gamut.** On P3 displays the accent fills (primary, tertiary, semantic and brand accents) gain ~18% chroma via relative colour syntax; lightness — and so contrast — is unchanged.
  - **Medium contrast.** `data-contrast="medium"` sits between standard and high, AA-tested everywhere.
  - **Async buttons.** `Button status="loading" | "success" | "error"`: the width holds, focus stays (aria-disabled), success draws a check, error shakes once, and each change is announced. `SplitButton` keeps focus while loading.
  - **Forms.** New `ErrorSummary` pattern + `useFormErrors()` hook (focus moves to the summary; links focus the field).
  - **Undo over confirm.** `toast.undoable(title, { onUndo, onCommit })` commits exactly once when the toast closes without Undo.
  - **i18n and RTL.** New `NexubProvider` (`locale`, `dir`, `messages`) with Radix direction support; every built-in English string is a translatable message, and Intl formatting follows the provider locale. Components use logical properties throughout, directional icons mirror, and the Switch thumb and toasts follow the reading direction.
  - **Touch targets.** Button, IconButton, Checkbox, Radio and Switch get an invisible 44×44 hit area on touch screens.
  - **Optics.** Tables, pagination and stat values use tabular figures.

- c867e37: Wave 4 — AI surface kit (ENHANCEMENTS_PLAN.md).

  - `PromptInput`: an auto-growing composer with attachment and action slots; Enter sends, Shift+Enter adds a line, IME-safe; Send becomes Stop while streaming (Escape stops too); solid or glass.
  - `ThinkingIndicator`: a softly morphing shape with a shimmering label; `role="status"`; static under reduced motion.
  - `StreamingText`: new text fades in as it arrives with a caret while streaming; `aria-busy` instead of a chatty live region.
  - `MessageBubble` + `MessageActions`: user / assistant / system messages as labelled articles; copy (with a drawn check), thumbs up/down, regenerate; actions appear on hover or focus on pointer devices and stay visible on touch.
  - `Citation`, `SourceChip`, `SourceList`: numbered source markers with a hover-card preview, and a source row; only http/https links are rendered (`safeUrl`).
  - Patterns `Conversation`: a stick-to-bottom message list with a "Jump to latest" button and a composer slot.
  - 18 new translatable messages in `NexubProvider` for the AI surfaces.

### Patch Changes

- @nexub/icons@1.6.0

## 1.5.1

### Patch Changes

- 5aaeb38: `TextGradient`: render the brand gradient. The class compiled to `background-color`, so the gradient was dropped and the clipped text was invisible.
  - @nexub/icons@1.5.1

## 1.5.0

### Minor Changes

- ffb9dec: New components (design refresh Phase 5).
  - **`SplitButton`**: a primary action plus a chevron menu of related actions, as one connected control. Takes the Button variants, sizes and tones; `menu` holds `DropdownMenu.Item`s; `menuLabel` names the toggle.
  - **`ButtonGroup attached`** now renders as a connected group: capsule outer ends, 6px inner corners and 2px seams. Each segment keeps its own state layer and focus ring.
  - **`Toolbar.Root floating`**: a glass-capsule floating toolbar, with `placement="bottom"` to pin it to the bottom centre. Toolbar is also restyled onto the refresh (capsule state-layer items, secondary-container toggles).
  - **`NavigationRail`** (`Root`, `Item`): navigation for medium widths, with icons over labels and an active pill; `asChild` accepts router links.
  - **`Amount`**: money via `Intl.NumberFormat`, with tabular numerals, the currency's minor unit and a true minus sign. `size="display"` is a hero figure with a quieter symbol and minor units; `tone="auto"` colours gains and losses.
  - **`MoneyInput`**: an amount field with the currency symbol leading. It parses the locale's separators as you type (`onValueChange(number | null)`, rounded to the minor unit) and groups the value on blur.
  - **`ListDetail`** (patterns): the list-detail layout using a container query. At 720px+ of its own width the panes sit side by side; narrower, one pane shows at a time, with `showDetail` / `onBack`.

### Patch Changes

- @nexub/icons@1.5.0

## 1.4.0

### Minor Changes

- 6b51c55: Calm Depth core controls (design refresh Phase 2). Props and variant names are unchanged; the look moves onto the Phase 1 foundations.
  - **Button / IconButton**: capsule shape, the control-size ladder (md is now 40px; `data-density="compact"` shrinks it), role colours, and a state layer plus press spring instead of hover colour swaps. New variant names `filled`, `tonal`, `outlined`, `text`; `primary`, `secondary`, `subtle`, `outline` and `ghost` remain as aliases. Explicit disabled styling replaces 50% opacity.
  - **Input / Textarea / Select / Combobox**: 12px field shape, 16px text from md up, and a 2px primary border on focus instead of a halo ring. `invalid` uses the error role.
  - **Checkbox / Radio / Switch**: 2px outline borders (≥3:1), primary when on. Switch has new proportions and the thumb slides on a spring.
  - **Badge / Chip / Toggle**: role pairs (container / on-container), WCAG AA by construction.
  - **SegmentedControl / Tabs**: one indicator that slides to the selected item on a spring. Tabs now use a primary underline.
  - **Slider**: thin track, solid primary knob, and a state-layer halo.
  - Focus is the single global ring for every control. `cn` now understands the token scales (`text-label-lg`, `rounded-shape-*`, `h-control-*`, `shadow-elevation-*`).

- 8ee088d: Calm Depth surfaces & overlays (design refresh Phase 4). Props are unchanged.
  - **New role `--color-surface-elevated`** for floating layers: white in light, lighter than the page in dark. `--color-bg-raised` and `--color-surface-raised` now alias it; before, they were darker than the page in dark mode.
  - **Overlays** (Dialog, AlertDialog, CommandPalette, Drawer): 24px shape, the elevated surface, elevation 3, a 40% scrim, and spring enter/exit. AlertDialog's Action and Cancel are now real `Button` styles (destructive / outlined).
  - **Floating surfaces** (Popover, HoverCard, DropdownMenu, ContextMenu, Menubar, Select, NavigationMenu): 16px shape, elevation 2, and menu items with a concentric 10px radius, an on-surface state layer and explicit disabled text.
  - **Tooltip**: inverse surface on its own z-tier (`--z-tooltip`), so it no longer sits on the popover tier, and it now flips correctly in dark mode.
  - **Toast / Toaster**: an inverse-surface snackbar with an `inverse-primary` action.
  - **Card**: the elevated surface plus a soft alpha hairline. Shadows only for `surface` and `interactive`; `interactive` uses the state layer and a spring lift.
  - **Navigation**: TopNav and NavigationMenu items are capsules with state layers. The Sidebar is a tonal panel without a divider, and its active item is a secondary-container pill instead of a solid brand fill.
  - **AppHeader**: a glass header's account menu offers the glass intensity dial (Clear / Balanced / Tinted / Solid).

- 15c47b5: **`CommandPalette.Root`**: new props and a focus fix.
  - `scrollLock="class"` locks page scroll with the `nexub-scroll-lock` class instead of Radix's injected `<style>`, so the palette opens under `style-src 'self'`.
  - `shouldFilter={false}` for results that are already filtered (async search), and `label` for the dialog's accessible name (default "Command palette"; also silences Radix's missing-title warning).
  - Closing now returns focus to the element focused before it opened. Without a `Dialog.Trigger`, focus used to drop to `<body>`.
  - The dialog keeps a 1rem margin each side on phones.

- 14d2e1a: Glass 2.0 (design refresh Phase 3).
  - **Recipe**: the fill is the surface role at the dial's opacity (`color-mix`), so dark glass needs no separate values. `backdrop-filter` is `blur + saturate`, and the edge is a hairline with a top specular highlight and a bottom rim. Same `surface="glass"` API.
  - **Thickness** scales with size: buttons are thin (8px blur, elevation 1), bars and popovers regular (16px, elevation 2), dialogs and drawers thick (28px, elevation 3). Set `data-glass-thickness` to override.
  - **Intensity dial**: `ThemeProvider` gains `glass` / `setGlass` (`'clear' | 'balanced' | 'tinted' | 'off'`), persisted under `nexub-glass` and applied pre-paint by `ThemeScript`. It sets `data-glass` on `<html>`, and any ancestor can set it too.
  - **Variants**: `data-glass-tint="primary"` for the single emphasised action, and `data-glass-variant="clear"` over imagery only.
  - **Scroll edge**: `TopNav.Root` / `AppHeader` accept `scrollEdge="soft" | "hard"`. Soft dissolves content under the bar instead of showing a divider.
  - **Button `variant="glass"`** (thin glass).
  - **Fallbacks are solid** under `prefers-reduced-transparency`, `prefers-contrast: more` (plus a 2px outline), `forced-colors`, `data-glass="off"`, and in browsers without `backdrop-filter`.

### Patch Changes

- Updated dependencies [c0fe350]
  - @nexub/icons@1.4.0

## 1.3.0

### Minor Changes

- d907d10: **Strict CSP: `Sheet` / `Drawer` can lock scroll without an injected `<style>`.**
  - New `scrollLock` prop on `Sheet.Root` / `Drawer.Root`: `"style"` (default, unchanged) or `"class"`. With `"class"`, page scroll is locked by the `nexub-scroll-lock` class from `@nexub/themes/base` on `<html>` (keeping the scrollbar's space, so nothing shifts) instead of Radix's injected `<style>` tag, which `style-src 'self'` blocks. The sheet stays modal: focus trap, hidden background for screen readers, Escape and outside-click still work.
  - `SettingsLayout`'s phone menu uses `scrollLock="class"`, so it opens under a strict CSP with no console error and the page behind is locked.
  - `@nexub/themes/base` also ships Radix's scrollbar-hiding rule for `ScrollArea` and `Select` viewports, so they look right when a strict CSP blocks Radix's `<style>` tag.
  - New docs page, Getting Started → Strict CSP: which components are CSP-safe and how to use the others.
- d907d10: **`Sheet` / `Drawer` are fully typed without `vaul`.** The published types imported `vaul`, which isn't a dependency (it's bundled), so `Sheet.Root` and its props resolved to `any` in apps. They're now declared in `@nexub/react` itself (new `DrawerRootProps` export), so `onOpenChange={(open) => …}` infers `boolean` with no extra installs. Apps can drop their `(open: boolean)` annotations. The build now fails if a `.d.ts` file imports `vaul`.
- d907d10: **`Sidebar.Header` with a product logo and a status.** New `Sidebar.Header` takes the logo as children and an optional `status` (e.g. a "Live" `Badge`). They sit on one row when they fit; otherwise the status moves under the logo. When the sidebar is collapsed, the status is visually hidden but still announced.
  - `Logo` with `product` truncates the product name with an ellipsis when its container is too narrow, instead of overflowing.
  - `SettingsLayout`'s top bar lets a long product logo shrink and truncate next to the actions.
- fc5ca7d: Add `ThemeScript`: render it in `<head>` to apply the stored theme (and optionally the product brand) before first paint, so server-rendered apps no longer flash the wrong theme. Takes a `nonce` for pages with a strict Content-Security-Policy.

### Patch Changes

- @nexub/icons@1.3.0

## 1.2.0

### Minor Changes

- d296fe3: **Branding: the official Nexub mark in `Logo`.**
  - `NexubMark` (`@nexub/icons`) now draws the official Nexub mark (the purple-blue ribbon), taken from the master SVG without redrawing. It replaces the placeholder "B". New `variant` prop: `"mono"` (default, `currentColor`, as before) or `"color"`. Each instance gets its own gradient ids, so several marks on one page don't clash.
  - `Logo` gets `mark="color" | "mono"` (default `"color"`) and `product?: string`. With `product`, it renders the mark, "nexub", a subtle separator and the product name in muted text at the wordmark's size, e.g. `<Logo product="Command Hub" />`. The accessible name becomes "Nexub Command Hub".
  - `Logo` `variant="icon"` is the new name for the mark-only variant. `variant="mark"` still works. `Logo` now has `role="img"`, so its name is announced.
  - The mark is sized by height at its real 78:56 ratio (it used to sit in a square box).
  - `@nexub/tokens`: 47 new brand tokens, `--color-brand-mark-1` … `--color-brand-mark-47` (Tailwind `brand-mark-*`), holding the mark's gradient colours. `Logo` and `NexubMark` contain no hex values.

- d296fe3: **CSP: `@nexub/react` no longer injects a `<style>` tag on load.** The Drawer library (vaul) added one as soon as `@nexub/react` was imported, even with no Drawer on the page, which strict Content-Security-Policy pages block. vaul is now bundled into `@nexub/react` with that call removed, and its styles ship in `@nexub/themes/base` instead. Apps that import `@nexub/themes/base` (all of them) need no change, and a strict CSP no longer needs a hash for that style. The build fails if vaul's styles and `base.css` drift apart. `vaul` moves from dependencies to devDependencies.
- d296fe3: **Sheet / Drawer fixes.**
  - Left and right panels no longer scroll horizontally. vaul's over-drag strip (a `::after` 200% wide, past the panel edge) made the panel scrollable sideways once it scrolled at all. Side panels now clip x, which also lets long content scroll vertically with no extra classes. Apps can drop their `overflow-x-hidden` workaround.
  - `Sheet.Overlay` / `Drawer.Overlay` now has default styling (full-screen scrim). It used to render unstyled.
  - New `--color-overlay` token in `@nexub/themes/base` (`rgb(0 0 0 / 0.5)`). `Dialog`, `AlertDialog` and `CommandPalette` overlays use it instead of a hard-coded `bg-black/50`, with no visual change.

- d296fe3: **Tabs: inactive panels stay hidden whatever display class they get.** A `Tabs.Content` with `className="flex"` (or `grid`, `md:flex`, …) used to show while inactive, because the class beat the `hidden` attribute. Inactive panels now get `display: none !important`. Apps can drop their `data-[state=inactive]:hidden` workaround.

### Patch Changes

- Updated dependencies [d296fe3]
- Updated dependencies [d296fe3]
- Updated dependencies [d296fe3]
  - @nexub/icons@1.2.0

## 1.1.0

### Minor Changes

- 50236f4: ESM-only packages, working tree-shaking, and RSC-safe builds.
  - **Breaking:** `@nexub/react`, `@nexub/patterns` and `@nexub/icons` ship ESM only (CJS builds removed). `@nexub/tokens` exports gain a `default` condition, so `require('@nexub/tokens/tailwind')` now works on Node ≥20.19.
  - `@nexub/react` and `@nexub/patterns` are built per component and every output file starts with `'use client'`, so they import cleanly from Next.js Server Components. A single-component import drops from ~130 KB gz to ~6–9 KB gz.
  - `@nexub/icons`: unused icons are now tree-shaken (one icon ≈1 KB gz, was ≈10 KB).
  - The Tailwind preset now registers `tailwindcss-animate`, so component enter/exit animations actually render. `tailwindcss` is an optional peer of `@nexub/tokens`.
  - `@nexub/themes`: dark mode is no longer forced when `data-theme` is absent; with no attribute the OS preference decides.
  - **Breaking:** `ThemeProvider` drops the `attribute` prop (`class` mode never matched the theme CSS). `system` mode now removes `data-theme` instead of setting it, and the provider no longer causes hydration mismatches. `useMediaQuery` starts `false` on first render.

- 0a71d8d: Accessibility and stability fixes.
  - **Contrast (WCAG AA):** new `--color-fill-*` tokens (fixed shades, white text ≥ 4.5:1 in light and dark). Button, IconButton, Badge (solid), Checkbox, Pagination, Sidebar, DatePicker, FilterChip, AlertDialog and StepIndicator use them. Primary is now brand-600, which is visibly a little deeper. `--color-text-{info,success,warning,danger}` now alias the `-strong` shades, placeholder text uses `text-muted`, and icon tones follow the text tones.
  - **Focus ring:** `--shadow-focus` follows `--color-ring-*`, so it's correct in dark mode and brand themes.
  - **Slider:** thumbs no longer remount (and lose focus) on every value change. New `thumbLabels` prop; `aria-label` now names the thumb.
  - **Rating:** radio-group keyboard support (one tab stop, arrows, Home/End).
  - **Motion:** exits always complete, even when `transitionend` never fires (e.g. `duration="instant"`). Bubbled child events are ignored.
  - **Toaster** renders `action`. The close button stays visible on touch devices.
  - **Autocomplete** shows the selected label (not the id), filters by label, and renders a real "Loading…".
  - **NumberInput:** steppers respect bounds when `disabled={false}`.
  - **TopNav:** the menu scrolls instead of disappearing below `md`; `<nav aria-label="Main">`; `Item` supports `asChild`.
  - **Breaking:** **Sidebar:** the root is now `<nav aria-label="Sidebar">` (was `<aside>`); `Item` supports `asChild`, keeps an accessible name and tooltip when collapsed.
  - **Link:** new-tab links always get `noopener noreferrer` (merged with the caller's `rel`); supports `asChild`.
  - `@nexub/tokens`: brand-primary-800 is now `#1e40af` (was a copy of 900).

- 7d8ed02: Lighter packages and cleaner dependencies.
  - `@nexub/icons`: add `Camera` and `Layers`. Drop the unused `@radix-ui/react-slot` dependency.
  - **Breaking:** `@nexub/tokens`: remove the empty `./css/light` and `./css/dark` stub exports; use `@nexub/themes/light` and `/dark`. Stop shipping source maps that pointed at unpublished `src/`.
  - **Breaking:** `@nexub/react`: `@nexub/tokens` moves from a dependency to a peer dependency (install it alongside). It was only used for CSS variables and the Tailwind preset, never imported from JS.

- aa2eaa9: - `DatePicker` and `DateRangePicker` accept `id` and `aria-label`, so the field can be labelled (the selected value is appended to the accessible name). Previously the trigger's name was only the value or placeholder.
  - `FormField.Root` forwards its ref. `Autocomplete` and `Toaster` get a `displayName`.
  - Removed unused imports in `Dialog`, `Drawer` and `Heading`.
  - **Deprecated** (still exported, removed in 1.0): `StatusPill` and `Tag` (use `Badge`), `Banner` and `Callout` (use `Alert`). Editors show a strike-through; the docs mark them deprecated.
  - `Banner` now uses `role="status"` instead of `role="banner"`, which is the page-header landmark.
  - **Input borders meet WCAG 1.4.11:** new `--color-border-input` token (light `#848e9f`, ≥ 3:1 on every light surface; dark `#64748b`, ≥ 3:1). It's used for the boundaries of Input, Textarea, Select, DatePicker, DateRangePicker, Checkbox, Radio and the FileUpload drop zone, which are visibly darker. `--color-border-default` (cards, dividers, popovers) is unchanged.

### Patch Changes

- Updated dependencies [50236f4]
- Updated dependencies [0a71d8d]
- Updated dependencies [7d8ed02]
  - @nexub/icons@1.1.0

## 1.0.0

### Minor Changes

- 099ed36: Add the Liquid Glass material layer.
  - `@nexub/themes/glass` — a translucent material, orthogonal to light/dark, with a backdrop blur, hairline border, specular highlight, and a solid fallback under `prefers-reduced-transparency` / `prefers-contrast`.
  - `surface="glass"` on Card, Dialog, Popover, Drawer, and TopNav opts a surface into the material (defaults to `solid`, so existing usage is unchanged).
  - Fix: the `tone` prop now actually paints on Button, HelperText, and Label (previously a no-op).

### Patch Changes

- @nexub/tokens@1.0.0
- @nexub/icons@1.0.0

## 0.0.2

### Patch Changes

- Focus ring & navigation performance fixes

  **@nexub/react**
  - **Input** — replace `border-transparent` focus trick with `border-color` shift + `color-mix()`-based semi-transparent ring halo; eliminates double-ring artifact on all field components
  - **Textarea** — same semi-transparent ring pattern; invalid state ring now also uses `color-mix()` for consistent look
  - **Select** — same ring fix on Trigger; invalid state colour updated to match
  - **NumberInput** — inner `<input>` now strips all focus indicators (`border-0 shadow-none ring-0 focus:ring-0 focus-visible:ring-0`) so the wrapper's `focus-within` ring is the only visible outline
  - **Heading** — move tone colour from dynamic Tailwind class (`` `text-[var(--color-text-${tone})]` ``) to inline `style` prop; fixes Turbopack CSS parse error caused by template literals being emitted literally into generated CSS

- 94f96f7: Performance & stability fixes
  - **Toast SSR guard** — store is now client-only on `globalThis`; server-side module evaluations receive a fresh local object so toast state never leaks across concurrent SSR requests
  - **Collapse RAF cleanup** — `requestAnimationFrame` IDs are now stored and cancelled in the `useEffect` cleanup, preventing state updates on unmounted components (memory leak)
  - **FileUpload context memo** — context value is wrapped in `useMemo` so consumers only re-render when a tracked value actually changes, not on every parent render
  - **useMergedRefs stable callback** — replaced the spread-array dependency (new reference every call, defeating `useCallback`) with a `useRef` of refs pattern; the returned function is now truly stable
  - **Motion willChange hints** — `Fade`, `Slide`, and `Scale` now set `willChange: 'opacity'` / `willChange: 'opacity, transform'` so browsers promote these elements to their own compositor layer, eliminating repaint jank on lower-end devices
  - **@types/react devDep** — aligned to `^19.0.0` to match the root pnpm override
