# @nexub/core

## 12.2.0

### Minor Changes

- 37bb587: `AgentAvatar` (beta): an AI agent's avatar, so an agent never looks like a colleague. A rounded-square app tile with a small sparkle in the bottom inline-end corner, in the same sizes as `Avatar`. Takes `icon` (the app glyph) or `src`, `name`, `size` and an optional `category` colour; screen readers hear "Payhub agent, AI agent" (new `aiAgent` message).

  `AgentBadge` (beta): a soft `Badge` with a leading sparkle for an agent's chat header ("AI on your own key", "Buttons only"). Takes `icon`, `tone`, `category` and `size`.

- f275efa: Conversation: new `DateSeparator` shows "Today", "Yesterday" or a medium date ("25 Nov 2026") between messages, in the provider's locale.
  Conversation: when messages arrive while you're scrolled up, "Jump to latest" becomes "Jump to newest" and "New messages" is announced once per batch.
  Conversation: new `thinking` slot at the end of the list for a `ThinkingIndicator`, announced politely and never moving the scroll.
  Conversation: the scroller itself is now `relative`, so MessageBubble's screen-reader labels stay inside it (no more `[&>div>div:first-child]:relative` workaround).
  Core messages: new `jumpToNewest`, `newMessages` and `yesterday` strings (DateSeparator also uses the existing `today`).
- 605f865: MessageBubble: `avatar` now works on your own messages (`from="user"`) and sits at the inline end, mirroring the assistant's. The accessible name stays "You said".
  MessageBubble: `collapse={lines}` clamps a long message with a fade and a built-in "Read more" / "Show less" toggle (`aria-expanded`), shown only when the content is taller than the clamp.
  New `MessageCard` (beta): a bordered block inside a bubble with `title`, `status`, `fields` (label/value pairs, two columns on wide cards), `body`, `actions` (one filled button at most, extras in a "More actions" menu past two), `maxHeight` with "Show all", and a `done` line with a `SuccessCheck`.
  New `Highlight` (beta): an inline span for amounts, dates and statuses in running text, in six tones (`neutral`, `primary`, `success`, `warning`, `error`, `info`), AA in both themes.
  New messages `readMore`, `showLess` and `showAll` (English defaults) in `NexubMessages`.
- 9a3459e: `OrgChart`: `zoomable` adds a zoom toolbar (zoom out, level, zoom in, fit), pinch, ctrl/⌘ + wheel, drag to pan and + / - / 0 keys (`zoom`/`defaultZoom`/`onZoomChange`, `minZoom`/`maxZoom`, 0.25–2), and `stackAbove={n}` stacks a node's reports in a compact column when it has more than `n`, so wide teams fit without changing the tree semantics. New messages: `orgChartZoom`, `orgChartZoomIn`, `orgChartZoomOut`, `orgChartZoomFit`, `orgChartZoomLevel`.

  `EventCalendar`: `color` on an event (and on a legend item) takes any brand colour (hex, rgb(), hsl(), oklab(), oklch()) and stays readable in light and dark: the container is mixed into the surface and the text picked for 4.5:1 contrast. It wins over `tone`; an unreadable colour keeps the tone and warns in development.

- 69613f1: 12.2 PromptInput: slash commands and quick replies.

  - **`commands` and `onCommand(value, args)`:** typing `/` opens the commands (`CommandListItem[]`, with `shortcut` keys) in a list above the field, filtered as you type. ↑/↓ move, Enter or Tab picks, Esc closes and keeps the text. `/remind tomorrow 9am` + Enter calls `onCommand('remind', 'tomorrow 9am')`; uncontrolled input then clears. Text that matches no command submits as usual. The field is a combobox only while the list is open, and the list loads on the first `/`.
  - **`chips`:** a quick-reply row above the field (e.g. `Button size="sm" variant="tonal"`), labelled "Suggestions". On a phone it scrolls sideways with snap and edge fades instead of wrapping.
  - **Messages:** `promptSuggestions` ("Suggestions") and `promptCommands` ("Commands") in `NexubMessages`.

## 12.1.0

## 12.0.0

## 11.9.0

### Minor Changes

- ed69a75: 11.9 Alpha → beta prep, and RFC 12.0 (ROADMAP_12.x.md).

  - **`@nexub/elements`, new:** `<nx-select>`, `<nx-combobox>` (async `onsearch`, stale answers dropped, `allow-custom`) and `<nx-phone-input>` (E.164 form value, the same phone rules as React). All form-associated, with `invalid` on every field. One element at a time: `@nexub/elements/define/<name>`.
  - **Screen-reader pass, automated half** (`A11Y_REVIEW.md` in each package; the human VoiceOver / NVDA pass follows before beta):
    - **Diagram:** connections are named by their node titles and share one Tab stop. Node order follows the layout. A focused connection can be deleted. Repeated announcements are read again, and a delete names what went.
    - **`<nx-date-picker>`:** no sideways scroll at 320px. Focus goes back to the field at once. The month is announced only when it changes, and the calendar button carries the field's name.
  - **`@nexub/react`:** opt-in `@nexub/react/styles.nexub-layer.css`, every style in one `nexub` layer, as RFC 12.0 proposes for `styles.css`. Load it first, or declare `@layer nexub;`, and app CSS always wins. Fix: the deprecated `Stepper current={-1}` marks the last step complete too.
  - **`@nexub/core`:** `choiceFieldMessages`, `invalidPhone`, `phoneCountryOf(locale)` (React PhoneInput uses it), and the diagram edge messages.
  - **`@nexub/tokens`:** `nexub-migrate --rules changes-in-12` (opt-in until 12.0).
  - **`@nexub/patterns`:** the README no longer points Tailwind 3 apps at the preset removed in 4.0.
  - **RFC 12.0** (`RFC_12.0.md`) is open for comment. Nothing breaking ships until it is accepted.

## 11.8.0

### Minor Changes

- 78896f2: 11.8 Native catch-up I: fields (ROADMAP_12.x.md). The fields 11.1–11.5 fixed on web, on iOS and Android.

  - **`@nexub/react-native`, new:** `ComboboxField` (a searchable sheet; `onSearch` may return a promise, debounced, stale answers ignored), `CurrencySelect`, `FileUpload` (bring your own `pickFiles` and `capture`; `accept`, `maxSize`, `maxFiles`, `transform`, `validate` in web's order), `usePrompt()` / `PromptDialog`, `SwitchField`, `CheckboxField`, `CheckboxGroupField`.
  - **Fields:** TextField, PasswordInput, SearchField and MoneyInput take `invalid`, `readOnly`, `required`, `leadingIcon` / `trailingIcon`, `leadingAddon` / `trailingAddon`, `onClear` and `size="sm"`. PasswordInput: `visible`, `defaultVisible`, `onVisibleChange`. MoneyInput: `currencySlot`. Checkbox and Switch: `invalid`, `readOnly`, `size` (Switch also `checkedIcon` / `uncheckedIcon`). Stepper (web NumberInput): `nullable` (11.1 rules: empty state, clamp on blur), `precision`, `showSteppers`, `invalid`, `size`. SegmentedControl: `size`.
  - **DateTimeField:** `granularity="month" | "year"` (a grid in a sheet; values `'2026-03'` / `'2026'`, typed by `DateTimeFieldPeriodProps`), `mode="datetime"`, `disabledDates`, `presets`, `minuteStep`, `clearable`, `defaultValue`, `defaultTime`, `timeZone`, `locale`, `disabled`, `readOnly`, `invalid`, `loading`, `size` and icon / addon slots. Time mode shows a clock icon. The OS day picker can't grey out days, so a pick on a disabled day keeps the old value and says the day is unavailable.
  - **OTPInput:** `defaultValue`, `disabled`, `invalid`, `readOnly`, `size`, `name`; `mode="backup"` gets a capitals keyboard.
  - **MultiSelect:** `onSearch` (async), `onCreate`, `inputValue` / `onInputChange`, `emptyText`, `loading`, `maxVisibleChips`, `readOnly`, `size`. The field now shows the picked values as chips.
  - **Display:** TreeList (checkboxes with tri-state parents, `expanded`, `onLoadChildren`, `renderActions`, loading / empty / error states), StepProgress (`nonLinear`, `onStepChange`, `orientation`, `completed`), ActivityList states, Table `maxHeight` / `stickyHeader`, Button `status` with `successLabel` / `errorLabel`, IconButton `loading`, Link `external` / `variant` / `href`, Card `tone` / `variant` / `surface`, StatCard `change` / `note` / `tone`, Avatar `fallback` / `badgeColor`, AvatarGroup `spacing`, Skeleton `shape` / `animated`, Divider `tone`, ButtonGroup `attached`, InlineEdit `disabled` / `maxLength` / `size`, PhoneInput `size`.
  - **`@nexub/core`:** `takePhoto` and `opensExternally` messages.
  - **Parity:** web-only props on the 58 twins went from 283 to 140. 71 of them are web-only on purpose (`asChild`, browser drawer mechanics, DataTable column layout, …), each with its reason in the docs. The 69 real gaps left are listed on the React Native page, the largest DataTable → DataList (30) and Drawer → BottomSheet (13).
  - **Docs:** the native essentials list (85 components) on the React Native page; native prop tables now include inherited props.

## 11.7.0

### Minor Changes

- 10ed9e3: 11.7 Quiet release: nothing flaky (ROADMAP_12.x.md). No new components; the follow-ups 11.6 left open, and the release rules for 12.x.

  - **`@nexub/react`**: DatePicker `granularity="month"` cells show the full month name ("March", not "Mar"), so each cell's accessible name ("March 2026") starts with its visible text (WCAG 2.5.3 Label in Name). French short months ("janv.") were not a part of the long name at all. Same as `<nx-date-picker>`.
  - **`@nexub/core`**: `dateFieldMessages`, the date field strings on their own. `NexubMessages` gains optional `diagram…` keys (`diagramShowAsList`, `diagramConnectTo`, … `diagramMinimap`) for `@nexub/diagram`.
  - **`@nexub/diagram`**: `DiagramCanvas` reads its strings from `NexubProvider` `messages`, so a translated provider covers the canvas with the rest of the app. Its `labels` prop still wins; the English defaults stay in `@nexub/diagram`.
  - **`@nexub/elements`**: the date picker strings come from `@nexub/core` (`dateFieldMessages`), the same source as React's, instead of a copy. No visible change.
  - **`@nexub/patterns`**: each page template ships only its own default strings, not every template's: template entries are 1.5–2.1 kB gzip smaller. `defaultPageTemplateMessages` and `usePageMessages` are unchanged.
  - **Native parity:** none needed. The changed strings and templates are web only.
  - **Release rules (repo, not packages):** a test that passes only on retry, or a run that passes only after a rerun, opens a `flake` issue; an open one blocks the production release, and so does a staging head under 48 hours old. Lighthouse also runs on mobile emulation (warn only until 12.1).

## 11.6.0

### Minor Changes

- 07007f9: 11.6 Diagrams and web components: two new packages at `alpha`, which close the last two platform gaps, #34 and #36 (ROADMAP_11.x.md). Both RFCs were accepted with changes on 2026-11-22 (#713, #712).

  - **`@nexub/diagram`** (#34, new, RFC #713): `DiagramCanvas` and `DiagramNode` on React Flow (`@xyflow/react` ^12.10, a peer dependency, so only apps that draw diagrams pay for it). Themed on the tokens (light, dark, forced colours, product accents). Keyboard access: arrow keys move focus between nodes, Alt+arrows move the focused node, C opens a "Connect to…" menu that makes an edge without dragging, Delete removes; moves and connections are announced. `layout="left-right" | "mind-map"` with the pure `layoutTree` and `layoutLayers` helpers (no layout dependency), `readOnly`, `minimap`, `controls`, a node `tone` (`good`, `warning`, `danger`) and a "Show as list" text alternative. Import `@nexub/diagram/styles.css`.
  - **`@nexub/elements`** (#36, new, RFC #712): form-associated web components for pages without React. `<nx-number-input>` has the 11.1 NumberInput rules (can be empty, half-typed values kept while focused, `min`/`max` on blur, `step="any"`). `<nx-date-picker>` takes `YYYY-MM-DD`, `YYYY-MM` or `YYYY` with `granularity`, `min`, `max`, a calendar dialog and a bottom sheet below 768px. A plain `<form>` posts their values, `form.reset()` resets them, and `required` and range limits take part in validation. They are themed by the same token variables, so `@nexub/themes` with `data-theme` and `data-product` applies. No framework and no runtime dependencies: load `@nexub/elements/define.js` from a CDN, or import the classes from `@nexub/elements`.
  - **`@nexub/core`**: the number rules (`parseNumberDraft`, `clampNumber`, `formatNumberValue`, `stepNumber`, `numberKeyTarget`) and date-value helpers (`parseDateValue`, `formatDateValue`, `dateRangeStatus`, `firstDayOfWeek` and more), shared by `@nexub/react` and `@nexub/elements` so they can't drift.
  - **`@nexub/react`**: NumberInput and the DatePicker period parsing use the shared core rules. No behaviour change.
  - **Native parity:** none. Native has no diagram editor (mobile shows the list view), and native apps use `@nexub/react-native` fields.
  - **The platform can delete** the Mind mind-map canvas, the Command Hub Studio workflow canvas, and the native `<input type="number">` and `<input type="date">` on the Forms respondent pages.

## 11.5.0

### Minor Changes

- 826dba3: 11.5 Conversations, lists, chrome and the last P4s. Closes the platform gaps #18, #19, #20, #21, #28, #29, #35, #37 and #38 (ROADMAP_11.x.md). Additive and opt-in; no default changes. The web components (#36, `@nexub/elements`) wait for their RFC (#712).

  - **PromptInput and chat parts** (#18): PromptInput `sendLabel` (a visible label), `submitOn="mod-enter"` (Enter adds a line, Cmd/Ctrl+Enter sends, with a hint), `hint` and `error`. MessageBubble `from="other"` with a `name` and `meta` header for group threads; MessageActions `actions` for custom actions. Conversation `maxHeight`: it sizes itself in normal flow without a fixed-height parent.
  - **SavedViews** (#19): `onSave`, `onUpdate`, `onDelete` and the new `onRename` may return a promise (busy, and its error shown); `confirmDelete`; `defaultView`; `maxLength`.
  - **TreeView** (#20): `renderActions` (row actions that never shift the row), `trailing` meta, link nodes (`href`, Cmd/Ctrl-click opens a tab), `onActivate` separate from selection (Enter, double-click), and `ref.scrollToNode(id)`.
  - **ActivityFeed** (#21): `timestamp` as a `Date` in `<time dateTime>` with a relative text and a full-date tooltip; `actions`; `tone`; `ActivityFeed.Group` headers; title and description no longer force `<p>`.
  - **NavigationRail** (#28): `orientation="bottom"`, a phone tab bar; `badge` (a count or a dot) with an accessible label.
  - **InlineEdit** (#29): `size` up to `headline`, `as` (a heading, `Sheet.Title`), `maxLength` with a counter.
  - **OrgChart** (#35, new): cards with photo, name and role on the TreeView data shape, expand and collapse, keyboard navigation as a tree, and a TreeView on narrow screens.
  - **Layout polish** (#37): Alert `title` and AuthCard `description` take any content; AuthCard `logoAlign`; `Breadcrumb.Section` (a plain section; in `Breadcrumb.Trail` an item before the last with no `href` renders as one instead of a link with no target); PageHeader `eyebrow`; Dialog.Content `maxHeight`; `Collapsible.Trigger variant="default"` (a styled row with a chevron); DashboardPage's headline figure can be a count, not only money.
  - **Tokens** (#38): spacing `88` (22rem) and `104` (26rem); Tailwind `perspective-near` / `-normal` / `-far`, `shadow-glow-brand` (follows the product accent), and `w-zoom-105` / `110` / `125`.
  - **Native parity:** none of these props are on the native twins yet (native NavigationRail is already a bottom bar; native Alert and lists keep their current API).
  - **The platform can delete** these stopgaps and hand-built screens: the Go phone bar, the org chart SVG, admin-ui's chat header and tree row actions, the `max-h-[26rem]`, `w-[22rem]` and 3D one-offs, and the hand-made Collapsible triggers.

## 11.4.0

### Minor Changes

- a628cc5: 11.4 Boards, steps and calendars. Closes the platform gaps #12, #13, #14, #22 and #24 (ROADMAP_11.x.md). Additive and opt-in; no default changes. The diagram canvas (#34, `@nexub/diagram`) waits for its RFC (#713).

  - **Kanban** (#12): `readOnly` (no drag handles), `canMove({ item, from, to })` refuses a drop before it lands (a WIP limit), `dropTargets` outside the columns (Archive, Trash; the keyboard reaches them after the last column), `renderColumnHeader` and `renderColumnFooter` (a WIP badge, quick add), swimlanes (`lanes` + `getLane`), card `getTone`, `columnWidth`. `onChange` gets a second argument naming the moved card and where it went.
  - **Stepper** (#13): per-step `status`: `complete`, `current`, `upcoming`, `error`, `warning`, `skipped`, `cancelled` (named as in StatusSteps, read after the label); `description` takes any content; `actions` under a step. **Deprecated:** `current={-1}` meaning "every step done", removed in 12.0. `npx nexub-migrate --rules deprecated-in-11` reports it (a new rule, on by default).
  - **EventCalendar** (#14): `onEventMove` to drag an event to another day or time, with a keyboard alternative (Alt+Arrow, then arrows, Enter) and announcements; `editable: false` per event; `renderDayAction` (per-day add); `eventActions`; `legend`.
  - **Sortable** (#22): `layout="grid"` (2D keyboard moves), `disabled` and per-item `isLocked`, `variant="flat"`, items without an `id` (stable keys), and `Sortable.Group` / `SortableGroup` for moves between lists. The shared reorder hook gains `canMove`.
  - **ResourceTimeline** (#24, new): one row per person and days across, cells from `getCell` with tones, `onCellActivate` for the app's own editor (a grid with arrow-key navigation), footer and row totals, weekends shaded, today marked. Reference screens: People rosters, PayHub team leave.
  - **Native parity:** the native Stepper, Kanban, calendar and lists have none of these props yet; no native twin of ResourceTimeline.
  - **The platform can delete** these stopgaps and hand-built screens: the Command Hub calendar's drag layer, the Leap day list actions, the roster grid, admin-ui's sortable grid and its read-only board, and the `current={-1}` workarounds.

## 11.3.0

### Minor Changes

- b27bea2: 11.3 Dashboards tell the truth. Closes the platform gaps #11, #16, #23, #25, #26 and #32 (ROADMAP_11.x.md), and opens the RFCs for `@nexub/elements` (#712, gap #36) and `@nexub/diagram` (#713, gap #34). Additive and opt-in; no default changes.

  - **Charts** (#11): a `null` or missing value is drawn as a gap (no bar, a break in the line) and listed as "—", not as 0. Semantic tones `good`, `warning`, `danger` and `neutral` beside the 1–8 palette on any series, slice or sparkline. BarChart `orientation="horizontal"` for ranked lists with long names, `colorOf` for a colour per bar, and `variant="waterfall"` with `totalKey` (rises in `good`, falls in `danger`, totals from zero). `integerTicks` keeps the gridlines on whole numbers. One formatter per series (`series[].valueFormat`) for a multi-currency chart. The product accent still stays out of charts.
  - **Show as table** (#25): `tableView` on BarChart, LineChart, DonutChart, Funnel and Heatmap: a visible "Show as table" disclosure with the same data (a native `<details>`, so it works in server components with no JS).
  - **UsageTile** and **UsageBar** (#16, #26, new): used of a limit, a bar that turns to the warning tone near the limit (`warnAt`, default 80%) and danger at it, with a text hint ("84% used", "Limit reached") and `role="meter"`; unlimited plans show "Unlimited". `usageLevel()` is exported. **StatCard**: `size="sm"`, a `note` slot, `tone="bad-when-high"`, `change` with `changeFormat` (percent or absolute), and `changeLabel`.
  - **StageCounter** (#23, new): a row of toggle cards with a count and a failed count each, that filters a list (`aria-pressed`, single or `multiple`).
  - **Small options** (#32): DonutChart `maxSlices` groups the rest into "Other", `legendValues` shows value and share, a slice's `href` links its legend row, `size` (folds in the useful parts of #673). Funnel several `series` and `show="conversion" | "drop-off" | "both"`. Heatmap missing cells and a `legend`. Gauge `tone` and `caption`. FilterBar `search={false}`. CheckList item `status: 'done' | 'pending'`.
  - **Native parity:** the charts, tiles and StageCounter have no `@nexub/react-native` twin; native dashboards keep `KpiTile` and `ProgressBar`.
  - **The platform can delete** these admin-ui stopgaps: `UsageMetric`, `Metric`, the hand-built stage filter rows, the charts' `?? 0` null workarounds, and the table fallbacks under charts.

## 11.2.0

### Minor Changes

- aab07d0: 11.2 Pickers and prompts. Closes the platform's input gaps #8, #9, #10, #15, #17, #30, #31 and #33 (ROADMAP_11.x.md). Additive and opt-in; no default changes.

  - **CurrencySelect** and **CurrencyField** (#8, new): a searchable ISO 4217 list built from `Intl` (code, name and symbol), on ComboboxField, with `currencies`, `priority` and group headings. `currencyOptions(locale)` returns the same options. **MoneyInput** `currencySlot` puts a CurrencySelect (or anything) before the amount.
  - **AlertDialog.Prompt** and **`usePrompt()`** (#9, new): ask for a reason or a name in place of `window.prompt`: `label`, `required`, `minLength`, `maxLength`, `validate`, `multiline`, `tone`, and a busy state while `onSubmit` runs (a rejection shows its message and keeps the dialog open). `await prompt(options)` resolves to the trimmed answer or `null`.
  - **Autocomplete** (#10): visible `label`, `clearOnSelect` ("add" mode), `onClear` with a clear button, option `description` (a searched second line) and `disabled`. **MultiSelect**: `onSearch` (async, as on ComboboxField), option `description`, `disabled` and `avatar` (in the list and on the chip); picked values keep their label and avatar when they leave `options`.
  - **Date pickers** (#17): DateTimePicker `clearable`. DateRangePicker `endExclusive` (a half-open `to`, in and out) and `onComplete` (once both ends are set).
  - **ColorPicker** (#15, new): swatches (with optional names), a hex field, and `contrastAgainst` for a WCAG AA text hint. Popover, sheet on phones. `contrastRatio()` and `parseHex()` are exported.
  - **CommandList** (#30, new): the searchable, grouped, keyboard list from CommandPalette as an inline part for dialogs, sheets and pages: `items`, `onSelect`, async `onSearch` and `loading`, shortcuts and icons.
  - **OTPInput** (#31): `mode="backup"`, a 12-character recovery code in one field grouped in fours (the value has no dashes); `autoFocus`; an uncontrolled code posts with `name` and empties on form reset.
  - **EmojiPicker** and **IconPicker** (#33, new): search, categories, recent picks (kept in localStorage) and skin tone for emoji; IconPicker lists `@nexub/icons` by name, with optional categories. The emoji data and the icon set load only when a picker opens. `EmojiPickerPanel` and `IconPickerPanel` fit inside your own popover.
  - **Native parity:** OTPInput `mode="backup"` and MultiSelect option `disabled` and `avatar` (with search by description) are ported to `@nexub/react-native`. Native has no Autocomplete, DateRangePicker, ColorPicker, CommandList, Emoji or Icon picker, or AlertDialog prompt yet; DateTimeField has no clear button yet.
  - **The platform can delete** these admin-ui stopgaps: `CurrencyField` and `CURRENCY_OPTIONS`, `askText()` and the `window.prompt` calls, `SearchField`, and the free-text emoji fields in Mind spaces and docs.

## 11.1.0

### Minor Changes

- 505d41a: 11.1 Fields stop fighting the user. Closes the platform's open P1 gaps (ROADMAP_11.x.md: #1 check, #2, #3, #4, #5, #6, #27). Additive and opt-in; no default changes.

  - **NumberInput** (#2): `nullable` lets the field be empty (`null`, not 0) and keeps a half-typed `2.` or `-` while focused. `min` and `max` apply on blur, steppers and arrow keys, never mid-typing (typing 30 with a minimum of 15 no longer snaps the 3 to 15). `step="any"`. A focused field keeps what was typed, so `precision` formats on blur. Existing callers that pass a number are unchanged.
  - **DatePicker** (#4): `granularity="month" | "year"` with `'YYYY-MM'` / `'YYYY'` values: a grid of months or years in the same popover and phone sheet, arrow keys and Page Up/Down, `minDate` and `maxDate`. Replaces `<input type="month">`.
  - **FileUpload** (#5): `FileUpload.Trigger` (an outlined button, an `iconOnly` paperclip, or your own Button with `asChild`) with no drop zone; controlled `files` / `defaultFiles`; `capture` for the phone camera; `transform(file)` before the size check (shrink a photo); `disabled`, `busy` and `progress`; `Dropzone size="sm"`.
  - **ComboboxField** and **ComboboxPicker** (#6, new): a searchable single choice on the field tokens, with label, description and inline error. Grouped options, `keywords` and a second line per option, a `noneOption`, async search (`onSearch`, `loading`, `selectedOption`), and a hidden input with `name`.
  - **SwitchField**, **CheckboxField**, **CheckboxGroupField** (#27, new): label, description and error; switch-before-label `layout="start"`; checkbox `aside` and `indeterminate`; a fieldset group with one error. **Text** `tone="danger" | "success" | "warning"`.
  - **Phone** (#3): `formatPhone(e164, { style: 'national' | 'international' })` for read-only display, and `parsePhone()` now also returns `dialCode`. Both, with `isValidPhone`, are exported from `@nexub/react` (and `formatPhone` from `@nexub/react-native`). The E.164 string stays the one stored form.
  - **Vivid** (#1): every vivid component rule stops at the nearest expression, so `data-expression="calm"` on a wrapper inside a vivid page opts that area back out (CheckboxCard and RadioCard included). Shadows inside the calm area keep vivid's faint accent tint.
  - **Native parity:** the native Checkbox already carries its label and description; native has no NumberInput, DatePicker, FileUpload or Combobox twin yet, so those props have no native port in 11.1.
  - **The platform can delete** these admin-ui stopgaps: NumberField's nullable path, FileField, ComboboxField, ComboboxPicker, PickField, SwitchField, CheckboxField, CheckboxGroupField, and `TextField type="month"` month pickers.

## 11.0.0

## 10.9.0

### Minor Changes

- c71bb65: 10.9 Native, next level, and the 11.0 release candidate. 10.9.x is published under the npm tag `next`; `latest` stays on 10.8.x until 11.0.

  - **Native look**: `NexubNativeProvider expression="vivid"`, `product` accepts every product in the generated map, and the theme exposes the product accent. Category colours on `Badge` and `Avatar`, new `IconChip`, `StatCard`, `NumberTicker`, a gradient main action and tone-aware tonal buttons. `dynamicColor` follows the Android 12+ system accent (opt-in). `useBreakpoint` and `useResponsive` for tablets and landscape.
  - **Gestures on the UI thread**: BottomSheet, Toast, SwipeableRow and Slider read touches with react-native-gesture-handler worklets. **`react-native-gesture-handler` >= 3 is now a required peer**: wrap the app root in `GestureHandlerRootView`.
  - **New native twins** (#302): `Tabs`, `Table`, `Rating`, `Tooltip`, `StepIndicator` (alias of `StepProgress`), plus twins of `DescriptionList`, `ComparisonBar`, `PhoneInput`, `Countdown` and the `StatusSteps` pattern.
  - **QR codes** (#305): `QRCode` on web and native (always dark on light, value shown as text) and native `QRScanner` (optional `expo-camera` peer, with permission states, torch and a manual-entry fallback). The encoder is `encodeQR` in `@nexub/core`.
  - **Toward 11.0**: `npx nexub-migrate --rules changes-in-11` rewrites the four deprecated product theme imports and lists overlays that rely on the old `sheet` default. See "Migrating to 11.0" in the docs and RFC #662.
  - Device baselines for the pattern screens are also captured in dark, high contrast, RTL and (iOS) large text. The mobile demo gains a small connected app under `/demo`.

## 10.8.0

### Minor Changes

- b46edf1: 10.8 Templates: twelve new page templates and the three controls they needed.

  - **Getting in**: `SignUpPage` (password strength said in words, optional phone, terms), `ForgotPasswordPage` (request and "check your email" with a resend cooldown), `VerifyCodePage` (OTP and 2FA with resend countdown, other methods, code lifetime), `OnboardingPage` (a generic step wizard with validation, skip and a completion view) and `KycPage` (personal details, document upload, review, status).
  - **Daily work**: `TablePage` (search, filters, tabs, bulk and row actions, pagination), `DetailPage` (view and edit modes with an unsaved-changes guard), `BookingPage` (date, time slot, confirm, with an optional hold timer), `InvoicePage` (invoice and receipt), `TeamPage` (members, roles, invites, seats), `NotificationsPage` (grouped by day, tabs, load more) and `SearchResultsPage` (highlighted matches, kinds, pagination).
  - **`PhoneInput`** (#303): country picker, formatting as you type, E.164 out, paste of full international numbers. Country calling codes and helpers (`parsePhone`, `formatNational`, `toE164`, `isValidPhone`) are in `@nexub/core`.
  - **`Countdown`** and `useCountdown` (#304): time left to a deadline that stays right after the tab was in the background, tone changes near the end, and announcements at sensible intervals only.
  - **`TimeSlotPicker`**: a radio group of time slots, optionally grouped into morning, afternoon and evening.

  Every template uses the 10.3 look, the 10.5 loading, empty and error states and the 10.6 phone behaviour, and responds to its container.

  **Fix**: a read-only `Select` no longer switches Radix from uncontrolled to controlled after mount, which logged a React warning on every render of a read-only Select (seen first on a read-only `PhoneInput`).

  **Performance**: a closed `PhoneInput` country picker renders only the selected country, not all ~240 (Radix Select renders items while closed). 1,000 mounts of six PhoneInputs: over 10 minutes before, 10 seconds after.

## 10.7.0

### Minor Changes

- 9d9c9eb: 10.7 Charts, calendar and tables.

  - **Interactive charts** (opt-in; default charts stay server-rendered): `interactive` on BarChart, LineChart (and `area`), DonutChart, Heatmap, Funnel and Sparkline adds a crosshair that snaps to the nearest point, a tooltip that stays inside the plot, tap on touch, and keyboard navigation (arrows, Home, End, Escape) with the focused point announced. `onPointClick` reports the point. `legend="toggle"` on BarChart and LineChart turns the legend into show/hide buttons (`hiddenSeries`, `defaultHiddenSeries`, `onHiddenSeriesChange`).
  - **EventCalendar**: `day` view with an hour grid and a now line, and `agenda` view as a list grouped by day. `views` picks what the switcher offers (default unchanged); `now` makes it deterministic.
  - **Table**: `stickyHeader` with `maxHeight`, `density`, `striped` on `Table.Root`.
  - **DataTable**: a footer row from each column's `footer` (sums follow the filtered rows), and per-column filters (`meta.filter: 'text' | 'select' | 'number-range'`, `columnFilters`, `defaultColumnFilters`, `onColumnFiltersChange`, `manualFiltering`). The filter popover loads only when used.
  - **`Truncate`**: clips text to one or more lines and shows a tooltip only when the text is really cut.
  - **New (#306)**: `DescriptionList` (label and value rows on `<dl>`, inline or stacked, 1 to 3 columns, emphasis for totals), `ComparisonBar` (two values on one split bar with a text alternative) and the `StatusSteps` pattern (a read-only progress list with done, current, upcoming and problem steps).

## 10.6.0

## 10.5.1

## 10.5.0

### Minor Changes

- 11c1fd9: 10.5 Every state: loading, empty and error look designed everywhere, and state changes move.

  - **One prop shape** (`loading`, `emptyState`, `errorState`; error wins, then loading, then empty) on BarChart, LineChart, DonutChart, Gauge, Heatmap, Funnel, Sparkline, KpiTile, ChartZoom, EventCalendar, TreeView, Kanban, `Table.Body`, and `errorState` on DataTable and DataTableVirtual. Patterns too: ActivityFeed, InfoList, NotificationCenter, SettingsPage, DashboardPage, ListDetail, TransactionDetailPage, ActivityPage; `loading` on StatCard and UserCard. Exported as `DataStateProps`.
  - **Behaviour change**: a chart, tree or board with no data now says "Nothing here yet" instead of drawing an empty plot. Pass `emptyState` to change it.
  - **`SkeletonPreset`**: card, tableRow, listRow, chart, form.
  - **`Illustration`**: seven spot drawings (noData, noResults, noAccess, serverError, offline, notFound, maintenance) coloured by the theme and the product accent. `EmptyStatePreset illustrated` uses them; the preset gains `notFound` and `maintenance`.
  - **`StatusPage`** pattern for 404, 500, maintenance, offline and no access, with three new templates.
  - **Motion**: a sliding indicator on ToggleGroup (single), NavigationRail and Pagination; Stepper progress, Chip and FilterChip colours, the Avatar status dot and TreeView expand now animate; Drawer exits at the same speed as Dialog. `ErrorState` takes `retryLabel`.
  - **Docs layout shift**: ResizablePanels, Combobox, FilterBuilder and Slider render their final layout on the server.
  - **React Native**: Accordion, Progress, Checkbox, Radio, PageIndicator, TextField and Dialog animate on the shared springs. `ScreenContainer keyboardAvoiding` (default on) keeps inputs above the keyboard on iOS and Android; BottomSheet does the same on Android. Sizes read the theme tokens (lint exceptions 109 → 10).

## 10.4.0

## 10.3.0

### Minor Changes

- 8f48bf4: 10.3 Lively app surfaces: Vivid reaches the app, and every product gets one accent.

  - **Vivid in apps** (`@nexub/themes/vivid`, nothing changes under `calm`): page titles are heavier, the active Sidebar item and NavigationRail pill are tinted with the accent and the Sidebar gains a marker that slides between items, stat cards lift on hover, bars fade toward the baseline, and Table, DataTable and list rows share one hover tint.
  - **Category colours**: eight generated colours (`--color-category-*`, one per chart series, 4.5:1 in light and dark) plus `accent`. New `category` prop on `Badge`, `Avatar` (`"auto"` picks a stable colour from the name) and `StatCard`.
  - **New**: `IconChip` (an icon on a tinted tile), `SuccessCheck` (a small success animation), `WelcomeBanner` (pattern).
  - **PageHeader** `wash`: a padded panel that carries a soft wash of the accent under Vivid.
  - **StatCard** `category`, `trend` and `trendLabel`: a coloured icon chip and a small trend line.
  - **DashboardPage** is the reference screen: new `banner` and `chart` slots, stats take `category` and `trend`. Changed: the first quick action is now the filled main action, and transaction avatars take a colour from the name.
  - **Button**: `variant="tonal"` with a `tone` is now a soft, coloured button (the role's container pair). Changed: it used to render the same solid fill as `filled`.
  - **Product accent**: `ThemeProvider` accepts every app key in the product map (was four). `AppHeader` and `Sidebar.Root` take `accent`, and `AppLauncher` apps take `accent`. Under `data-product` or `data-division` the new `--color-spot*` values carry the app's accent to the icon chip, the active navigation item, the header wash and the welcome banner. `@nexub/react` re-exports `PRODUCT_KEYS`, `DIVISIONS`, `CATEGORY_COLORS` and `accentAttrs`.
  - **Deprecated**: `@nexub/themes/leap`, `/bookub`, `/payub` and `/founderub`. Import `@nexub/themes/products` instead; the four files are removed in 11.0.

## 10.2.0

## 10.1.0

### Minor Changes

- 4e7fbf9: Division mega-menu and division/app themes, for the nexub.com rebuild. Nothing is removed and apps that set neither `data-division` nor a new `data-product` key look the same.

  - **MarketingNav**: an item with `columns` opens a grouped mega-menu as wide as the container: up to 5 columns (3 + 2 below `xl`), each a labelled list whose title can link to the division page and take a division tint (`accent`), with an optional `footer` strip and `feature` card. In the mobile sheet each column is an accordion section. Links take a `badge` ("Coming soon") that is part of the link's name, on flat `items` menus too. Menu links now show the focus ring. New types `MarketingNavColumn` and `MarketingNavGroup`.
  - **Fix**: with `@nexub/themes/glass` loaded, the header's soft scroll edge was a mask that also hid the open mega-menu. MarketingNav no longer sets it.
  - **Tokens**: accent scales for the five divisions (`--color-accent-os-50` … `-950`, `-fill`, `-fill-hover`; also commerce, fintech, intelligence, autonomous) in CSS, Tailwind, JSON and JS; `native.color.divisions` and Figma `division` variables; the division → apps map at `@nexub/tokens/json/divisions`.
  - **Themes**: `@nexub/themes/divisions` (and `@nexub/themes/divisions/os` etc.) for `data-division`; `@nexub/themes/products` for every app under `data-product` (people, contracts, forms, commerce, money, capital, mind, go, command-hub, runner, plus the aliases book-hub, payhub, founder-hub). Generated from the token map; the per-product files stay.
  - **Components**: Card `accent` accepts `ProductKey | DivisionKey` (exported from `@nexub/react/Card` and `@nexub/core`). `division` on Hero, SectionHeader, ProductGrid, ProductCard and CTABand sets `data-division`; in marketing mode the eyebrow and the CTA band take the division's colour.
  - **Server components**: `@nexub/react/Marquee` is a new server-safe entry. LogoStrip and MarketingFooter use it, so they no longer bring the client-side Motion components onto a server-rendered page.

## 10.0.0

## 9.9.1

## 9.9.0

## 9.8.0

## 9.7.0

## 9.6.0

## 9.5.0

## 9.4.0

## 9.3.0

## 9.2.0

## 9.1.0

## 9.0.0

## 8.9.0

## 8.8.0

## 8.7.0

## 8.6.0

## 8.5.0

## 8.4.0

## 8.3.0

## 8.2.0

## 8.1.0

## 8.0.0

## 7.9.0

## 7.8.0

## 7.7.0

## 7.6.0

### Minor Changes

- 90b8f7d: 7.6: rich surfaces and navigation.

  - `Dialog.Content`: `showClose` (+ `closeLabel`), `sheet` (`true` or `'auto'`: a bottom sheet below `md`); **new** `Dialog.Body` scrolls while Header and Footer stay put, with hairlines that appear as you scroll (CSS scroll timeline; always shown where unsupported); a nested Dialog steps its parent back.
  - `Tabs.List`: overflowing lists fade at the scrollable edges and keep the active tab in view (without scrolling the page); `variant="pill"`.
  - `Tooltip`: `label` accepts any node, plus `description`, `shortcut` (a Kbd) and `arrow`. A Tooltip now works without an app-level `TooltipProvider`.
  - `IconButton`: `loading` and `tooltip` (`true` shows the `label`). The tooltip code loads only when used.
  - `Badge`: `dot`, `count` + `max` ("99+", full number for screen readers) with a tick when the count changes.
  - `CommandPalette`: pages (`CommandPalette.Page`, `Item page`, Backspace goes back), `loading`, and opt-in recents (`recentKey`).
  - `EmptyState.Root`: `size` (`sm` / `md` / `lg`) and opt-in `animate`.
  - New message: `recent`.

## 7.5.0

### Minor Changes

- c5738fa: 7.5: rich inputs.

  - `Input`: `clearable`, `showCount` (with `maxLength`; announced only near the limit) and `loading`.
  - `Select`: `Root clearable`, `Item description` (the option's accessible description), and `Content searchable` (a filter field at the top; typeahead is unchanged when it's off).
  - `Switch`: `loading` (spinner in the thumb, can't toggle) and `checkedIcon` / `uncheckedIcon`.
  - `Combobox.List loading`; the list height animates as results change (also Autocomplete and MultiSelect).
  - `DatePicker`: `typeable` (type a date in the locale's short format; invalid text is marked, the value is kept), `presets`, `disabledDates`, and a month crossfade.
  - `Slider`: `marks` (ticks and labels, RTL-aware), `showValue` (`true` or `'hover'`) and `formatValue` (also sets `aria-valuetext`).
  - `FileUpload`: image previews, paste to upload (through the same `accept` / `maxSize` / `validate` checks), and items that grow in and collapse out. A removed file now leaves after its exit animation, so tests that assert right after clicking Remove need `waitFor`.
  - New messages: `clear`, `characterCount`.

## 7.4.0

### Minor Changes

- ad149cc: 7.4: feedback and loading.

  - `Button`: the loading spinner waits 150ms before showing and then stays at least 400ms (no flicker); `successLabel` no longer changes the button's width; `type="submit"` inside a pending React 19 `<form action>` shows loading on its own (`useFormStatus`).
  - **New** `useAsyncAction(fn)` → `{ run, pending, error, reset }`: latest call wins, errors are captured, nothing updates after unmount.
  - `toast.promise(promise, { loading, success, error })` and `toast.update(id, partial)`; a `loading` tone; tone icons (`icon={false}` hides them); `showProgress` countdown bar that pauses with the timer; a quick flick dismisses even under the distance threshold.
  - `Skeleton animation="shimmer"` and **new** `SkeletonText` (`lines`), one line-height per line so the swap to real text doesn't shift.
  - `DataTable`: `loading` (skeleton rows, `aria-busy`) and `emptyState`.
  - `Avatar`: images fade in once loaded (server-rendered and cached images show at once); `status` (`online` / `away` / `busy` / `offline`) with the label in the accessible name.
  - `Progress`: `variant="circular"` and `segments` for step-style progress.

## 7.3.0

## 7.2.0

### Minor Changes

- 1bfe041: 7.2: secure by default.

  - **New** `safeHref` and `safeSrc` (also `@nexub/react/safeHref`). Every consumer-supplied link and image URL now goes through them: `Breadcrumb`, `MediaCard`, `CardLink`, `Avatar`, and the navs/links in `AppHeader`, `NotificationItem`, `NotificationCenter`, `SettingsPage`, `SettingsLayout`, `PlanCard`, `AppLauncher`, `MarketingNav`, `MarketingFooter`. `javascript:`, `vbscript:`, `data:` and `file:` links are dropped; images allow relative, http(s), `blob:` and `data:image/*`. `safeHref(url, { strict: true })` allows only web, mailto, tel and sms; it becomes the default in 8.0.
  - **New** `NexubProvider` `nonce`: hands your CSP nonce to the `<style>` tags Radix overlays inject, so every overlay works under `style-src-elem 'nonce-…'`.
  - **New** `scrollLock="class"` on `Dialog.Root` and `AlertDialog.Root` (already on Sheet/Drawer and CommandPalette): no `<style>` at all. It becomes the default in 8.0.
  - **New** `FileUpload.Root` `validate(file)`: return a message to reject a file (reason `'custom'`).
  - `PasswordInput`: the reveal button keeps one name ("Show password") and reports its state with `aria-pressed` and `aria-controls`. The `hidePassword` message is deprecated (removed in 9.0).
  - `ThemeScript`: a stored product brand is applied only when it's a known product.

## 7.1.0

## 7.0.1

## 7.0.0

## 6.9.0

## 6.8.0

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
