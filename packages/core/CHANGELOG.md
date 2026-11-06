# @nexub/core

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
