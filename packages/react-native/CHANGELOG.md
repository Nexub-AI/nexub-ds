# @nexub/react-native

## 12.4.0

### Patch Changes

- Updated dependencies [0164c75]
- Updated dependencies [0d79efa]
  - @nexub/core@12.4.0
  - @nexub/tokens@12.4.0
  - @nexub/icons@12.4.0

## 12.3.0

### Minor Changes

- 5f4db9c: `Illustration` gets a `success` kind, so the spot illustrations now cover empty, error, offline and success states. It follows the theme, dark mode and forced colours, and stays decorative unless you give it a `title`.
  `Illustration` for React Native: the same eight kinds, `size` and `title` as on the web, drawn with react-native-svg in the theme's colour roles. It is hidden from VoiceOver and TalkBack unless you give it a `title`.
  React Native `EmptyState`, `ErrorState` and `ResultScreen` take an optional `illustration` (for example `<Illustration kind="success" />`) that replaces the icon disc. Without it they look the same as before.
- c9a48cb: Motion presets by intent: `enter`, `exit`, `emphasis`, `success` and `attention`, each an alias of a spring token. `@nexub/tokens` adds `--motion-preset-<intent>-easing` / `-duration`, Tailwind `ease-<intent>` / `duration-<intent>`, `tokens.motion.preset` and `native.motion.preset`.
  `@nexub/themes` adds utility classes `nx-motion-enter`, `nx-motion-exit`, `nx-motion-emphasis`, `nx-motion-success` and `nx-motion-attention` (part `motion-presets`); under `prefers-reduced-motion` enter and exit land at once and the rest don't move. Overlays, the shake, the count tick, the success check and the signature Switch thumb now read their preset (same springs, no visible change).
  `@nexub/react`: Switch and Toast now use the matching presets (same springs, no visible change).
  `@nexub/react-native` adds `nxPreset(intent)` (a `withSpring` config that follows Reduce Motion), the `MotionPreset` type, a `success` haptic token and `presetHaptic` (emphasis → selection, success → success, attention → warning). New opt-in `haptic` on `Banner` and on `toast({ … })` plays the tone's haptic (success, warning, or the error haptic for danger), off by default and silent when the user turned haptics off or the platform has none. Toast and Dialog springs now read `nxPreset('enter' | 'exit')` (same values).

### Patch Changes

- Updated dependencies [5b010e4]
- Updated dependencies [c9a48cb]
  - @nexub/core@12.3.0
  - @nexub/tokens@12.3.0
  - @nexub/icons@12.3.0

## 12.2.0

### Patch Changes

- Updated dependencies [37bb587]
- Updated dependencies [f275efa]
- Updated dependencies [605f865]
- Updated dependencies [9a3459e]
- Updated dependencies [69613f1]
  - @nexub/core@12.2.0
  - @nexub/tokens@12.2.0
  - @nexub/icons@12.2.0

## 12.1.0

### Patch Changes

- Updated dependencies [b3bc381]
  - @nexub/tokens@12.1.0
  - @nexub/icons@12.1.0
  - @nexub/core@12.1.0

## 12.0.0

### Patch Changes

- @nexub/tokens@12.0.0
- @nexub/icons@12.0.0
- @nexub/core@12.0.0

## 11.9.0

### Patch Changes

- Updated dependencies [ed69a75]
  - @nexub/core@11.9.0
  - @nexub/tokens@11.9.0
  - @nexub/icons@11.9.0

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

### Patch Changes

- Updated dependencies [78896f2]
  - @nexub/core@11.8.0
  - @nexub/tokens@11.8.0
  - @nexub/icons@11.8.0

## 11.7.0

### Patch Changes

- Updated dependencies [10ed9e3]
  - @nexub/core@11.7.0
  - @nexub/tokens@11.7.0
  - @nexub/icons@11.7.0

## 11.6.0

### Patch Changes

- Updated dependencies [07007f9]
  - @nexub/core@11.6.0
  - @nexub/tokens@11.6.0
  - @nexub/icons@11.6.0

## 11.5.0

### Patch Changes

- Updated dependencies [826dba3]
  - @nexub/core@11.5.0
  - @nexub/tokens@11.5.0
  - @nexub/icons@11.5.0

## 11.4.0

### Patch Changes

- Updated dependencies [a628cc5]
  - @nexub/core@11.4.0
  - @nexub/tokens@11.4.0
  - @nexub/icons@11.4.0

## 11.3.0

### Patch Changes

- Updated dependencies [b27bea2]
  - @nexub/core@11.3.0
  - @nexub/tokens@11.3.0
  - @nexub/icons@11.3.0

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

### Patch Changes

- Updated dependencies [aab07d0]
  - @nexub/core@11.2.0
  - @nexub/tokens@11.2.0
  - @nexub/icons@11.2.0

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

### Patch Changes

- Updated dependencies [505d41a]
  - @nexub/core@11.1.0
  - @nexub/tokens@11.1.0
  - @nexub/icons@11.1.0

## 11.0.0

### Patch Changes

- Updated dependencies [40b2b2f]
  - @nexub/tokens@11.0.0
  - @nexub/icons@11.0.0
  - @nexub/core@11.0.0

## 10.9.0

### Minor Changes

- c71bb65: 10.9 Native, next level, and the 11.0 release candidate. 10.9.x is published under the npm tag `next`; `latest` stays on 10.8.x until 11.0.

  - **Native look**: `NexubNativeProvider expression="vivid"`, `product` accepts every product in the generated map, and the theme exposes the product accent. Category colours on `Badge` and `Avatar`, new `IconChip`, `StatCard`, `NumberTicker`, a gradient main action and tone-aware tonal buttons. `dynamicColor` follows the Android 12+ system accent (opt-in). `useBreakpoint` and `useResponsive` for tablets and landscape.
  - **Gestures on the UI thread**: BottomSheet, Toast, SwipeableRow and Slider read touches with react-native-gesture-handler worklets. **`react-native-gesture-handler` >= 3 is now a required peer**: wrap the app root in `GestureHandlerRootView`.
  - **New native twins** (#302): `Tabs`, `Table`, `Rating`, `Tooltip`, `StepIndicator` (alias of `StepProgress`), plus twins of `DescriptionList`, `ComparisonBar`, `PhoneInput`, `Countdown` and the `StatusSteps` pattern.
  - **QR codes** (#305): `QRCode` on web and native (always dark on light, value shown as text) and native `QRScanner` (optional `expo-camera` peer, with permission states, torch and a manual-entry fallback). The encoder is `encodeQR` in `@nexub/core`.
  - **Toward 11.0**: `npx nexub-migrate --rules changes-in-11` rewrites the four deprecated product theme imports and lists overlays that rely on the old `sheet` default. See "Migrating to 11.0" in the docs and RFC #662.
  - Device baselines for the pattern screens are also captured in dark, high contrast, RTL and (iOS) large text. The mobile demo gains a small connected app under `/demo`.

### Patch Changes

- Updated dependencies [c71bb65]
  - @nexub/core@10.9.0
  - @nexub/tokens@10.9.0
  - @nexub/icons@10.9.0

## 10.8.0

### Patch Changes

- Updated dependencies [b46edf1]
  - @nexub/core@10.8.0
  - @nexub/tokens@10.8.0
  - @nexub/icons@10.8.0

## 10.7.0

### Patch Changes

- Updated dependencies [9d9c9eb]
  - @nexub/core@10.7.0
  - @nexub/tokens@10.7.0
  - @nexub/icons@10.7.0

## 10.6.0

### Patch Changes

- @nexub/tokens@10.6.0
- @nexub/icons@10.6.0
- @nexub/core@10.6.0

## 10.5.1

### Patch Changes

- Updated dependencies [c60dbed]
  - @nexub/tokens@10.5.1
  - @nexub/icons@10.5.1
  - @nexub/core@10.5.1

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

### Patch Changes

- Updated dependencies [11c1fd9]
  - @nexub/core@10.5.0
  - @nexub/tokens@10.5.0
  - @nexub/icons@10.5.0

## 10.4.0

### Patch Changes

- Updated dependencies [12a5ea5]
  - @nexub/tokens@10.4.0
  - @nexub/icons@10.4.0
  - @nexub/core@10.4.0

## 10.3.0

### Patch Changes

- Updated dependencies [8f48bf4]
  - @nexub/tokens@10.3.0
  - @nexub/core@10.3.0
  - @nexub/icons@10.3.0

## 10.2.0

### Patch Changes

- @nexub/tokens@10.2.0
- @nexub/icons@10.2.0
- @nexub/core@10.2.0

## 10.1.0

### Minor Changes

- ca95534: One typeface: Plus Jakarta Sans everywhere. Inter is no longer part of the design system.

  - `--font-family-sans` is now Plus Jakarta Sans, the same as `--font-family-display` (both tokens stay). Interface text, controls and body copy change face; sizes, weights and line heights are unchanged. Plus Jakarta Sans runs a little wider than Inter, so check tight layouts.
  - `@nexub/themes/base` (and `/fonts`) ships only the Plus Jakarta Sans files (latin, latin-ext, vietnamese; normal and italic). Other scripts fall back to the system font.
  - React Native: `nexubFonts` loads Plus Jakarta Sans 400–800 and no Inter files (`Inter_*` keys are gone; `useFonts(nexubFonts)` needs no change).
  - With `next/font`, load `Plus_Jakarta_Sans` for both `--font-family-sans` and `--font-family-display`.
  - Body roles (`body-lg`, `body-md`, `body-sm`) have no letter-spacing now: the small negative tracking was tuned for Inter and made Plus Jakarta Sans too tight.

### Patch Changes

- Updated dependencies [4e7fbf9]
- Updated dependencies [ca95534]
  - @nexub/tokens@10.1.0
  - @nexub/core@10.1.0
  - @nexub/icons@10.1.0

## 10.0.0

### Patch Changes

- @nexub/tokens@10.0.0
- @nexub/icons@10.0.0
- @nexub/core@10.0.0

## 9.9.1

### Patch Changes

- @nexub/tokens@9.9.1
- @nexub/icons@9.9.1
- @nexub/core@9.9.1

## 9.9.0

### Patch Changes

- @nexub/tokens@9.9.0
- @nexub/icons@9.9.0
- @nexub/core@9.9.0

## 9.8.0

### Patch Changes

- @nexub/tokens@9.8.0
- @nexub/icons@9.8.0
- @nexub/core@9.8.0

## 9.7.0

### Patch Changes

- @nexub/tokens@9.7.0
- @nexub/icons@9.7.0
- @nexub/core@9.7.0

## 9.6.0

### Patch Changes

- @nexub/tokens@9.6.0
- @nexub/icons@9.6.0
- @nexub/core@9.6.0

## 9.5.0

### Patch Changes

- @nexub/tokens@9.5.0
- @nexub/icons@9.5.0
- @nexub/core@9.5.0

## 9.4.0

### Patch Changes

- @nexub/tokens@9.4.0
- @nexub/icons@9.4.0
- @nexub/core@9.4.0

## 9.3.0

### Patch Changes

- @nexub/tokens@9.3.0
- @nexub/icons@9.3.0
- @nexub/core@9.3.0

## 9.2.0

### Patch Changes

- @nexub/tokens@9.2.0
- @nexub/icons@9.2.0
- @nexub/core@9.2.0

## 9.1.0

### Patch Changes

- @nexub/tokens@9.1.0
- @nexub/icons@9.1.0
- @nexub/core@9.1.0

## 9.0.0

### Patch Changes

- @nexub/tokens@9.0.0
- @nexub/icons@9.0.0
- @nexub/core@9.0.0

## 8.9.0

### Patch Changes

- @nexub/tokens@8.9.0
- @nexub/icons@8.9.0
- @nexub/core@8.9.0

## 8.8.0

### Patch Changes

- @nexub/tokens@8.8.0
- @nexub/icons@8.8.0
- @nexub/core@8.8.0

## 8.7.0

### Patch Changes

- @nexub/tokens@8.7.0
- @nexub/icons@8.7.0
- @nexub/core@8.7.0

## 8.6.0

### Patch Changes

- @nexub/tokens@8.6.0
- @nexub/icons@8.6.0
- @nexub/core@8.6.0

## 8.5.0

### Patch Changes

- @nexub/tokens@8.5.0
- @nexub/icons@8.5.0
- @nexub/core@8.5.0

## 8.4.0

### Patch Changes

- @nexub/tokens@8.4.0
- @nexub/icons@8.4.0
- @nexub/core@8.4.0

## 8.3.0

### Patch Changes

- @nexub/tokens@8.3.0
- @nexub/icons@8.3.0
- @nexub/core@8.3.0

## 8.2.0

### Minor Changes

- 6658b36: 8.2: test floor. No new API.

  - A smoke test renders every exported web (157) and React Native (93) component with no console errors and checks accessible names. A new export without a test fails CI.
  - Behaviour tests for every component that had none: the 8 web gaps (ActionBar, Amount, DateTimePicker, Fieldset, FloatingInput, Kanban, ResizablePanels, ScrollProgress) and 41 React Native components, overlays and inputs first.
  - Coverage is reported and gated in `@nexub/react`, `@nexub/patterns`, `@nexub/marketing` and `@nexub/react-native`, with thresholds at today's numbers. They only go up.
  - Fix: the outside-PR auto-close (8.1) closed maintainers' own PRs when their org membership is private. It now closes only PRs from forks.
  - Fix (React Native): a disabled `Slider` now reports `disabled` to screen readers, and VoiceOver/TalkBack increment/decrement no longer change it.

### Patch Changes

- @nexub/tokens@8.2.0
- @nexub/icons@8.2.0
- @nexub/core@8.2.0

## 8.1.0

### Patch Changes

- @nexub/tokens@8.1.0
- @nexub/icons@8.1.0
- @nexub/core@8.1.0

## 8.0.0

### Minor Changes

- 70e0436: 8.0: new defaults. No new features. Every change below shipped as an opt-in in 7.x, and `npx nexub-migrate --rules changes-in-8` reports where your code is affected. See "Migrating to 8.0" in the docs.

  - **Signature is the default look.** Set `data-style="classic"` on `<html>` or any wrapper to keep the 7.x Material-derived look until 9.0; `data-style="signature"` inside a classic wrapper switches back. React Native: `NexubNativeProvider` defaults to `style="signature"` (`style="classic"` keeps 7.x).
  - **`scrollLock` defaults to `"class"`** on `Dialog.Root`, `AlertDialog.Root`, `Drawer.Root` / `Sheet.Root` and `CommandPalette`: no injected `<style>`, so it works under a strict CSP. It needs `@nexub/themes/base` (the `html.nexub-scroll-lock` rule). `scrollLock="style"` keeps Radix's lock.
  - **`safeHref` is strict by default,** and so is every Nexub link that uses it: only relative URLs, `#…`, http(s), `mailto:`, `tel:` and `sms:` render. `safeHref(url, { strict: false })` allows custom schemes again (script-capable schemes stay blocked).
  - **Removed: the legacy motion tokens** `--duration-{instant,fast,normal,slow,slower}` and `--ease-{linear,in,out,in-out,out-expo,spring}` (deprecated in 7.3). Use the spring tokens, e.g. `var(--motion-spring-effects-default-duration)` and `var(--motion-spring-effects-default-easing)`.
  - **Removed: the `easing` prop** on `Fade`, `Scale`, `Slide` and `Collapse` (deprecated in 7.3). `duration` rides the spring tokens.

### Patch Changes

- Updated dependencies [70e0436]
  - @nexub/tokens@8.0.0
  - @nexub/icons@8.0.0
  - @nexub/core@8.0.0

## 7.9.0

### Minor Changes

- f36913e: 7.9: the Signature look (opt-in) and the 8.0 release candidate.

  - **New** `data-style="signature"` on `<html>` (or any subtree): the same contrast-guaranteed role engine with Nexub's own face. Neutral grey surfaces with a faint warm outline instead of lavender tints, 10px controls and fields with 16px cards, a primary seeded from the Nexub brand indigo, neutral-tinted tonal containers instead of pastels, tighter display tracking, tabular numerals in tables, and crisper hairline elevation. Chips, toggles, segmented controls and pill tabs stay full pills (`--shape-pill`). Every role pair is tested for WCAG AA in both styles.
  - Under Signature, `Switch` is a full-thumb switch; radio dots and checkbox ticks animate in on the springs.
  - React Native: `<NexubNativeProvider style="signature">`.
  - 8.0 RC: every 7.x deprecation is frozen with its removal version; `nexub-migrate --rules changes-in-8` reports what 8.0 changes in your code; **new** docs page "Migrating to 8.0". In 8.0 Signature becomes the default (`data-style="classic"` keeps today's look), `scrollLock="class"` and strict `safeHref` become the defaults, and the legacy motion tokens and `easing` prop are removed.

### Patch Changes

- Updated dependencies [f36913e]
  - @nexub/tokens@7.9.0
  - @nexub/icons@7.9.0
  - @nexub/core@7.9.0

## 7.8.0

### Minor Changes

- 6ed4283: 7.8: native smoothness.

  - `BottomSheet`: the drag feeds Reanimated shared values and carries the release velocity into the snap or close spring; a quick downward flick closes it. Closing is a spring whose completion unmounts the sheet (no timers). A fling now snaps toward the detent it was heading for.
  - `Toast` enters and leaves on the nx springs and can be swiped away sideways (velocity-aware).
  - Ported from web 7.4–7.6: `Button` spinner delay (150ms show / 400ms minimum), `Skeleton animation="shimmer"` and **new** `SkeletonText`, `Avatar status`, `Progress segments`, `TextField clearable` / `showCount` / `loading`, `Switch loading`, `Badge count` + `max`, `EmptyState size`.
  - Drags still read touches on the JS thread (PanResponder) because `react-native-gesture-handler` isn't a dependency; the animation itself runs on the UI thread.

### Patch Changes

- @nexub/tokens@7.8.0
- @nexub/icons@7.8.0
- @nexub/core@7.8.0

## 7.7.0

### Patch Changes

- @nexub/tokens@7.7.0
- @nexub/icons@7.7.0
- @nexub/core@7.7.0

## 7.6.0

### Patch Changes

- Updated dependencies [90b8f7d]
  - @nexub/core@7.6.0
  - @nexub/tokens@7.6.0
  - @nexub/icons@7.6.0

## 7.5.0

### Patch Changes

- Updated dependencies [c5738fa]
  - @nexub/core@7.5.0
  - @nexub/tokens@7.5.0
  - @nexub/icons@7.5.0

## 7.4.0

### Patch Changes

- Updated dependencies [ad149cc]
  - @nexub/core@7.4.0
  - @nexub/tokens@7.4.0
  - @nexub/icons@7.4.0

## 7.3.0

### Patch Changes

- Updated dependencies [fe8c22b]
  - @nexub/tokens@7.3.0
  - @nexub/icons@7.3.0
  - @nexub/core@7.3.0

## 7.2.0

### Patch Changes

- Updated dependencies [1bfe041]
  - @nexub/core@7.2.0
  - @nexub/tokens@7.2.0
  - @nexub/icons@7.2.0

## 7.1.0

### Patch Changes

- @nexub/tokens@7.1.0
- @nexub/icons@7.1.0
- @nexub/core@7.1.0

## 7.0.1

### Patch Changes

- @nexub/tokens@7.0.1
- @nexub/icons@7.0.1
- @nexub/core@7.0.1

## 7.0.0

### Patch Changes

- Updated dependencies [d13580c]
  - @nexub/tokens@7.0.0
  - @nexub/icons@7.0.0
  - @nexub/core@7.0.0

## 6.9.0

### Patch Changes

- Updated dependencies [88329d9]
  - @nexub/tokens@6.9.0
  - @nexub/icons@6.9.0
  - @nexub/core@6.9.0

## 6.8.0

### Patch Changes

- @nexub/tokens@6.8.0
- @nexub/icons@6.8.0
- @nexub/core@6.8.0

## 6.7.0

### Minor Changes

- 4d94b73: React Native parity for 6.x.

  - **`TreeList`** (new): the web TreeView on mobile, as drill-down lists with a back row; leaves are picked like radio rows.
  - **`StepProgress`** (new): the web Stepper on mobile: segments and "Step 2 of 4: Billing", read as a progress bar. (The existing `Stepper` stays the − value + control.)
  - **`SortableList`** (new): the web Sortable on mobile: Move up / Move down buttons while `editing`, and the same moves as VoiceOver and TalkBack actions on every row.
  - **`InlineEdit`** (new): text that turns into a field when tapped; Return or leaving the field saves.
  - Docs: native twins for TimePicker and DateTimePicker (`DateTimeField` with `mode="time"`), TreeView, Sortable, Stepper and InlineEdit, with live mobile previews.
  - New messages: `moveUp`, `moveDown`, `backTo`.

### Patch Changes

- Updated dependencies [4d94b73]
  - @nexub/core@6.7.0
  - @nexub/tokens@6.7.0
  - @nexub/icons@6.7.0

## 6.6.0

### Patch Changes

- Updated dependencies [46bd41c]
  - @nexub/core@6.6.0
  - @nexub/tokens@6.6.0
  - @nexub/icons@6.6.0

## 6.5.0

### Patch Changes

- Updated dependencies [efe17f9]
  - @nexub/core@6.5.0
  - @nexub/icons@6.5.0
  - @nexub/tokens@6.5.0

## 6.4.0

### Patch Changes

- Updated dependencies [5839e96]
  - @nexub/core@6.4.0
  - @nexub/tokens@6.4.0
  - @nexub/icons@6.4.0

## 6.3.0

### Patch Changes

- Updated dependencies [0290a12]
  - @nexub/core@6.3.0
  - @nexub/tokens@6.3.0
  - @nexub/icons@6.3.0

## 6.2.0

### Patch Changes

- Updated dependencies [653ee48]
  - @nexub/core@6.2.0
  - @nexub/tokens@6.2.0
  - @nexub/icons@6.2.0

## 6.1.0

### Patch Changes

- Updated dependencies [67643af]
  - @nexub/core@6.1.0
  - @nexub/tokens@6.1.0
  - @nexub/icons@6.1.0

## 6.0.0

### Patch Changes

- @nexub/tokens@6.0.0
- @nexub/icons@6.0.0
- @nexub/core@6.0.0

## 5.9.0

### Patch Changes

- Updated dependencies [c11f400]
  - @nexub/tokens@5.9.0
  - @nexub/icons@5.9.0
  - @nexub/core@5.9.0

## 5.8.0

### Patch Changes

- @nexub/tokens@5.8.0
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
  - @nexub/tokens@5.7.0
  - @nexub/icons@5.7.0

## 5.6.0

### Patch Changes

- Updated dependencies [b71b56f]
  - @nexub/icons@5.6.0
  - @nexub/core@5.6.0
  - @nexub/tokens@5.6.0

## 5.5.0

### Patch Changes

- Updated dependencies [04ff65b]
  - @nexub/core@5.5.0
  - @nexub/tokens@5.5.0
  - @nexub/icons@5.5.0

## 5.4.0

### Patch Changes

- Updated dependencies [253949f]
  - @nexub/core@5.4.0
  - @nexub/tokens@5.4.0
  - @nexub/icons@5.4.0

## 5.3.0

### Patch Changes

- Updated dependencies [8988b87]
  - @nexub/core@5.3.0
  - @nexub/tokens@5.3.0
  - @nexub/icons@5.3.0

## 5.2.0

### Patch Changes

- Updated dependencies [5f2ef4d]
  - @nexub/core@5.2.0
  - @nexub/tokens@5.2.0
  - @nexub/icons@5.2.0

## 5.1.0

### Patch Changes

- Updated dependencies [60fed18]
  - @nexub/core@5.1.0
  - @nexub/tokens@5.1.0
  - @nexub/icons@5.1.0

## 5.0.1

### Patch Changes

- @nexub/tokens@5.0.1
- @nexub/icons@5.0.1
- @nexub/core@5.0.1

## 5.0.0

### Patch Changes

- @nexub/tokens@5.0.0
- @nexub/icons@5.0.0
- @nexub/core@5.0.0

## 4.9.0

### Patch Changes

- @nexub/tokens@4.9.0
- @nexub/icons@4.9.0
- @nexub/core@4.9.0

## 4.8.0

### Patch Changes

- @nexub/tokens@4.8.0
- @nexub/icons@4.8.0
- @nexub/core@4.8.0

## 4.7.0

### Patch Changes

- @nexub/tokens@4.7.0
- @nexub/icons@4.7.0
- @nexub/core@4.7.0

## 4.6.0

### Patch Changes

- @nexub/tokens@4.6.0
- @nexub/icons@4.6.0
- @nexub/core@4.6.0

## 4.5.0

### Patch Changes

- @nexub/tokens@4.5.0
- @nexub/icons@4.5.0
- @nexub/core@4.5.0

## 4.4.0

### Patch Changes

- @nexub/tokens@4.4.0
- @nexub/icons@4.4.0
- @nexub/core@4.4.0

## 4.3.0

### Patch Changes

- @nexub/tokens@4.3.0
- @nexub/icons@4.3.0
- @nexub/core@4.3.0

## 4.2.0

### Patch Changes

- @nexub/tokens@4.2.0
- @nexub/icons@4.2.0
- @nexub/core@4.2.0

## 4.1.0

### Patch Changes

- @nexub/tokens@4.1.0
- @nexub/icons@4.1.0
- @nexub/core@4.1.0

## 4.0.0

### Minor Changes

- 82df5ba: 4.0: removes what 3.9 deprecated, and nothing else.

  - **Removed: the Tailwind 3 preset** (`@nexub/tokens/tailwind`) and its `tailwindcss-animate` dependency. Use Tailwind 4 with `@import "@nexub/tokens/tailwind.css"`; the utilities keep their names. The `tailwindcss` peer is now `^4.0.0`. `nexub-migrate --rules tailwind-3-preset` still finds any leftover import.
  - **Removed: Expo SDK 57 support.** `@nexub/react-native` now needs Expo SDK 58 or later (`expo-glass-effect`, `expo-haptics` and `expo-screen-capture` peers `>=58.0.0`).
  - No component API changed. If you were clear of the 3.9 warnings, 4.0 is a version bump. See Migrating to 4.0 in the docs.

### Patch Changes

- Updated dependencies [82df5ba]
  - @nexub/tokens@4.0.0
  - @nexub/icons@4.0.0
  - @nexub/core@4.0.0

## 3.9.0

### Minor Changes

- 474744c: 4.0 release candidate.

  - **The API is frozen until 4.0.** 3.9 adds no features: only the deprecations below and fixes. 4.0 removes exactly these, and changes no component API.
  - **Deprecated: the Tailwind 3 preset** (`@nexub/tokens/tailwind`). It now logs a one-time warning when it loads, and its type is marked `@deprecated`. Move to Tailwind 4 with `@import "@nexub/tokens/tailwind.css"`; the utilities keep their names.
  - **Deprecated: Expo SDK 57** for `@nexub/react-native`. 4.0 requires Expo SDK 58 or later.
  - **`nexub-migrate` rule `tailwind-3-preset`** finds every use of the Tailwind 3 preset (report only): `npx -p @nexub/tokens nexub-migrate . --rules tailwind-3-preset`.
  - **New guide: Migrating to 4.0**, with the removals, the codemod and the Tailwind 4 and Expo SDK 58 steps.

### Patch Changes

- Updated dependencies [474744c]
  - @nexub/tokens@3.9.0
  - @nexub/icons@3.9.0
  - @nexub/core@3.9.0

## 3.8.0

### Patch Changes

- @nexub/tokens@3.8.0
- @nexub/icons@3.8.0
- @nexub/core@3.8.0

## 3.7.0

### Patch Changes

- Updated dependencies [b1bf182]
  - @nexub/tokens@3.7.0
  - @nexub/icons@3.7.0
  - @nexub/core@3.7.0

## 3.6.0

### Patch Changes

- Updated dependencies [11c151d]
  - @nexub/tokens@3.6.0
  - @nexub/icons@3.6.0
  - @nexub/core@3.6.0

## 3.5.0

### Patch Changes

- Updated dependencies [147da58]
  - @nexub/tokens@3.5.0
  - @nexub/icons@3.5.0
  - @nexub/core@3.5.0

## 3.4.0

### Patch Changes

- @nexub/tokens@3.4.0
- @nexub/icons@3.4.0
- @nexub/core@3.4.0

## 3.3.0

### Patch Changes

- Updated dependencies [6a0521b]
  - @nexub/tokens@3.3.0
  - @nexub/icons@3.3.0
  - @nexub/core@3.3.0

## 3.2.0

### Patch Changes

- @nexub/tokens@3.2.0
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

- Updated dependencies [9bf12bc]
  - @nexub/tokens@3.1.0
  - @nexub/icons@3.1.0
  - @nexub/core@3.1.0

## 3.0.0

### Patch Changes

- Updated dependencies [1ea35c1]
- Updated dependencies [1ea35c1]
  - @nexub/tokens@3.0.0
  - @nexub/icons@3.0.0
  - @nexub/core@3.0.0

## 2.9.0

### Patch Changes

- Updated dependencies [872350c]
  - @nexub/tokens@2.9.0
  - @nexub/icons@2.9.0
  - @nexub/core@2.9.0

## 2.8.0

### Patch Changes

- Updated dependencies [1ad3138]
  - @nexub/icons@2.8.0
  - @nexub/tokens@2.8.0
  - @nexub/core@2.8.0

## 2.7.0

### Patch Changes

- Updated dependencies [3ca7a3f]
  - @nexub/tokens@2.7.0
  - @nexub/icons@2.7.0
  - @nexub/core@2.7.0

## 2.6.0

### Patch Changes

- Updated dependencies [ba4b800]
  - @nexub/tokens@2.6.0
  - @nexub/icons@2.6.0
  - @nexub/core@2.6.0

## 2.5.0

### Minor Changes

- 9a97fb4: Native marks and `SkeletonSwap` for React Native.

  - `@nexub/icons/native` now has the Nexub marks under the same names as on web: `NexubMark` (`variant="color"` draws the brand gradient), `LeapMark`, `BookubMark`, `PayubMark`, `FounderubMark`, `ACRA`, `IRAS`, `MCA` and `GST`. They take the usual `size`, `color` and `label` props.
  - `@nexub/react-native` adds `SkeletonSwap`, the twin of the web component: it crossfades from a skeleton to the loaded content in place on the motion springs, marks itself busy for screen readers while loading, and follows Reduce Motion. Content that is ready on first render shows without a fade.

### Patch Changes

- Updated dependencies [3363ede]
- Updated dependencies [9a97fb4]
  - @nexub/core@2.5.0
  - @nexub/icons@2.5.0
  - @nexub/tokens@2.5.0

## 2.4.0

### Minor Changes

- 89acedb: Release hardening (2.4.0). No API changes.

  - Each `@nexub/react-native` preview example is now checked on a real iOS simulator and Android emulator against committed screenshot baselines, so an unintended visual change fails CI the way web visual regression already does. The docs show the same screenshots under "On device" on native component pages.
  - Deprecated components (Banner, Callout, Tag, StatusPill) now have a removal target: 3.0. See GOVERNANCE.md for the status lifecycle (alpha → beta → stable → deprecated) and the deprecation policy.

### Patch Changes

- @nexub/tokens@2.4.0
- @nexub/icons@2.4.0
- @nexub/core@2.4.0

## 2.3.1

### Patch Changes

- c67c72a: Published with npm trusted publishing (OIDC) from the `Nexub-AI/nexub-ds` release workflow, so every version now carries npm provenance: you can check on npmjs.com that it was built from this repository's source. No code changes.
- Updated dependencies [c67c72a]
  - @nexub/tokens@2.3.1
  - @nexub/icons@2.3.1
  - @nexub/core@2.3.1

## 2.3.0

### Patch Changes

- Updated dependencies [23d164c]
  - @nexub/tokens@2.3.0
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

- 934f9a1: **Page templates, paired web and mobile.** `@nexub/patterns` adds full-page web twins of the native screens in `@nexub/react-native/patterns`, with the same data shapes (`Transaction`, `Quote`, `ReviewRow`, `ChatMessage`, `Plan`, `QuickAction`, `Insight`) so one data layer feeds both:

  - `DashboardPage` ↔ new native `HomeScreen`: balance with quick actions, key figures, recent activity and insights (Payub-style home; native adds pull-to-refresh).
  - `ActivityPage` ↔ `ActivityList`: grouped by day; Refresh and Load more stand in for pull-to-refresh and paging, `rowActions` for swipe actions.
  - `TransactionDetailPage` ↔ `TransactionDetail`, `SettingsPage` ↔ `SettingsScreen`, `SignInPage` ↔ `SignInScreen` (passkey autofill), `CheckoutPage` ↔ `AmountStep` + `ReviewStep` + `ResultScreen`, `ChatPage` ↔ `ChatScreen`, `PaywallPage` ↔ `PaywallScreen`.
  - Each renders a `<main>` landmark by default (`as="div"` inside an app shell), takes `messages` overrides on top of `NexubProvider` messages, and works from 360 px to desktop. `PageFrame` is the shared frame.

### Patch Changes

- @nexub/tokens@2.2.0
- @nexub/icons@2.2.0
- @nexub/core@2.2.0

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

- 1983f67: **React Native: docs, AI tooling and app icons** (MOBILE_PLAN.md, phase M5):

  - `@nexub/react-native` README is the reference: install, provider, every component and screen pattern, and the rules they follow.
  - Claude skill and `llms.txt` / `llms-full.txt` include the React Native reference. `@nexub/mcp` adds a `get_react_native` tool.
  - Docs: a Getting started → React Native page, with a web-to-native component map.
  - `@nexub/brand`: mobile app icons for the hub and every product. `assets/mobile/<product>-ios.png` is a 1024 px full-bleed square; the Android adaptive icon ships as `-android-foreground/background/monochrome.png` layers, including a monochrome layer for Android 13+ themed icons.

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

- c0f9add: **React Native screen patterns** (MOBILE_PLAN.md, phase M4), alpha, in `@nexub/react-native/patterns`. Each is a data-plus-callbacks template built only from the public components, so it works with any router:

  - **Auth:** `AuthScreen`, `SignInScreen` (platform autofill, optional "Sign in with Face ID"), `VerifyCodeScreen` (OTP with resend countdown), `LockScreen` (biometric unlock + passcode fallback).
  - **Money (Payub first):** `FlowStep` (progress + sticky action), `AmountStep` (keypad amount with live fee, rate and arrival; blocks over-balance), `ReviewStep`, `ActivityList` (grouped by day, pull-to-refresh, paging, swipe actions), `TransactionDetail`, `ResultScreen` (success/error/offline/maintenance/update).
  - **App:** `OnboardingScreen`, `PermissionPrimer`, `SettingsScreen` + `ProfileHeader`, `AppearanceSection` (theme, glass dial, haptics), `NotificationsInbox`, `SearchScreen`, `ChatScreen` (AI assistant, composer above the keyboard), `PaywallScreen`, `AppSwitcherSheet` (Nexub apps).

### Patch Changes

- Updated dependencies [c5cd6c5]
- Updated dependencies [736b9a5]
- Updated dependencies [080d2a4]
  - @nexub/core@2.1.0
  - @nexub/tokens@2.1.0
  - @nexub/icons@2.1.0
