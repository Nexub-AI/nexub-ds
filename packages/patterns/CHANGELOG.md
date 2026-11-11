# @nexub/patterns

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

### Minor Changes

- fc7b955: 7.7: reorder and data at scale.

  - `Sortable` and `Kanban` drag with Pointer Events (mouse, pen and touch) instead of native drag-and-drop: a drop line, items settle on the spatial spring, edge auto-scroll, and Escape or a cancelled pointer puts the item back. Alt+Arrow keyboard moves are unchanged. `DataTable` row reorder now drags from the grip only.
  - `DataTable` rows are memoised, so selecting a row or re-rendering with equal data no longer redraws every row. Cell renderers should depend only on their row and `columns`; if a renderer reads other state, include it in the `columns` memo.
  - `DataTable`: controlled and server-side sort and pagination: `sort` / `onSortChange` / `manualSort`, `page` / `pageSize` / `onPageChange` / `manualPagination` / `rowCount`.
  - The DataTable "View" menu loads only when `viewOptions` is used.
  - `FilterBuilder` renders its rule tree from a deferred value and keeps every keystroke; `FilterBar` documents the `useDeferredValue` recipe for big lists.
  - New perf tripwire (`pnpm --filter @nexub/react test:perf`, also part of the visual CI job): filtering 1,000 DataTable rows, typing in a 1,000-option Combobox and moving a Kanban card must stay under 200 ms per interaction with no long task over 100 ms.

## 7.6.0

## 7.5.0

## 7.4.0

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

### Minor Changes

- d13580c: 7.0: consolidate.

  - **Breaking:** `StepIndicator` is removed from @nexub/patterns. Use `<Stepper orientation="vertical" current={…}>` from @nexub/react (`currentStep` becomes `current`; `steps` works as is).
  - **Breaking:** Autocomplete's `mode` prop and its inline layout are removed. The popover (the default since 6.0) is the only layout; for an always-open list, use the Combobox parts.
  - **`nexub-migrate`**: `removed-in-7` now reports any Autocomplete `mode`; `keep-5-defaults` no longer pins `mode="inline"`.
  - See Getting Started → Migrating to 7.0.

## 6.9.0

### Minor Changes

- 88329d9: 7.0 release candidate.

  - **Deprecated, removed in 7.0**: `StepIndicator` (@nexub/patterns), use `<Stepper orientation="vertical" current={…}>` from @nexub/react; and Autocomplete's `mode="inline"` (and so `mode`), the popover stays.
  - **`Stepper`**: a step's `id` is optional (the label is the key), so a StepIndicator `steps` array works as is.
  - **`nexub-migrate`**: new default rule `removed-in-7` reports `<StepIndicator>` and `<Autocomplete mode="inline">`.
  - Docs: Migrating to 7.0.

## 6.8.0

## 6.7.0

## 6.6.0

### Minor Changes

- 46bd41c: Inbox, export and zoom.

  - **`NotificationCenter`** (new, beta, patterns): a bell with an unread count ("Notifications, 3 unread") that opens the notification list in a popover, with "Mark all as read", dismiss and an empty state. Your app owns the notifications.
  - **`NotificationItem`**: `href` or `onSelect` makes the whole item a link or a button (the dismiss button stays separate).
  - **`toCSV(rows, columns)`** (new): CSV text per RFC 4180 with CRLF line ends. Cells that start like a spreadsheet formula (`=`, `+`, `-`, `@`) get a leading `'`, so exports can't run formulas.
  - **`ChartZoom`** (new, beta): zoom any chart to part of its range with a two-thumb slider and a reset button. Only the wrapper is a client component; charts stay server-rendered.
  - New messages: `notificationCenter`, `unreadNotifications`, `markAllRead`, `noNotifications`, `zoomStart`, `zoomEnd`, `resetZoom`.

## 6.5.0

## 6.4.0

## 6.3.0

## 6.2.0

## 6.1.0

## 6.0.0

### Minor Changes

- 5e4fa46: 6.0: enterprise defaults. Three opt-ins from 5.x are now on by default. No component is removed and no prop is renamed. See Migrating to 6.0, and run `npx nexub-migrate src --rules keep-5-defaults --write` to keep 5.x behaviour.

  - **Autocomplete** opens its list in a popover anchored to the field (`mode` defaults to `'popover'`). Set `mode="inline"` for the 5.x inline list.
  - **DataTable / DataTableVirtual** with `enableRowSelection` show the checkbox column, with select-page and "Select all N" (`selectionColumn` defaults to `true`). Set `selectionColumn={false}` if you render your own checkboxes.
  - **FilterBar** names its search field from `searchPlaceholder` (without a trailing "…") when `searchLabel` isn't set, instead of the generic "Search".

## 5.9.0

### Minor Changes

- c11f400: 6.0 release candidate. Feature freeze: 5.9 adds no components; it prepares the three default changes in 6.0.

  - **Migrating to 6.0** (docs): what changes and what to do. Autocomplete opens in a popover by default, DataTable with `enableRowSelection` shows the checkbox column by default, and FilterBar names its search field from `searchPlaceholder` when `searchLabel` isn't set.
  - **`nexub-migrate --rules keep-5-defaults`**: an opt-in rule that keeps 5.x behaviour by adding `mode="inline"` and `selectionColumn={false}` where 6.0 would change it. Tags with a prop spread are reported, not changed. It is not part of the default run.
  - Prop docs for `Autocomplete mode` and `FilterBar searchLabel` now state their 6.0 defaults.

## 5.8.0

## 5.7.0

## 5.6.0

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

## 5.3.0

## 5.2.0

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

### Minor Changes

- 539443c: 5.0: Vivid by default, React 19.

  - **Vivid is the default expression.** `ThemeProvider` sets `data-expression="vivid"` on `<html>` when the app has not set one. Import `@nexub/themes/vivid` to see it. Keep the 4.x look with `data-expression="calm"` on `<html>` or `<ThemeProvider defaultExpression="calm">`. Calm stays fully supported.
  - **React 19 required.** `react` and `react-dom` peers are now `>=19 <20` in `@nexub/react`, `@nexub/patterns` and `@nexub/marketing`.
  - The 4.9 development warnings are removed. No component API changes. See /getting-started/migrating-to-5.

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

## 3.0.0

## 2.9.0

## 2.8.0

## 2.7.0

## 2.6.0

### Minor Changes

- 7f6d0ae: Prebuilt CSS: `import '@nexub/patterns/styles.css'` after `@nexub/react/styles.css` to use the patterns without Tailwind. It carries only the classes the patterns add (about 4 kB gzipped).

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

### Minor Changes

- 5771f93: `Sidebar.Footer` now sticks to the bottom of the sidebar (sidebar surface, top border) while the items scroll. `SettingsLayout` takes a new `navFooter` prop, pinned to the bottom of the section sidebar and the phone section menu, e.g. `navFooter="v1.2.0 · Updated 21 Oct 2026"`.

## 2.2.0

### Minor Changes

- 934f9a1: **Page templates, paired web and mobile.** `@nexub/patterns` adds full-page web twins of the native screens in `@nexub/react-native/patterns`, with the same data shapes (`Transaction`, `Quote`, `ReviewRow`, `ChatMessage`, `Plan`, `QuickAction`, `Insight`) so one data layer feeds both:

  - `DashboardPage` ↔ new native `HomeScreen`: balance with quick actions, key figures, recent activity and insights (Payub-style home; native adds pull-to-refresh).
  - `ActivityPage` ↔ `ActivityList`: grouped by day; Refresh and Load more stand in for pull-to-refresh and paging, `rowActions` for swipe actions.
  - `TransactionDetailPage` ↔ `TransactionDetail`, `SettingsPage` ↔ `SettingsScreen`, `SignInPage` ↔ `SignInScreen` (passkey autofill), `CheckoutPage` ↔ `AmountStep` + `ReviewStep` + `ResultScreen`, `ChatPage` ↔ `ChatScreen`, `PaywallPage` ↔ `PaywallScreen`.
  - Each renders a `<main>` landmark by default (`as="div"` inside an app shell), takes `messages` overrides on top of `NexubProvider` messages, and works from 360 px to desktop. `PageFrame` is the shared frame.

## 2.1.0

## 2.0.0

### Minor Changes

- 80df74b: `@nexub/brand`: a tile for every Nexub app (`app-icon-command-hub`, `-admin`, `-people`, `-payhub`, `-commerce`, `-contracts`, `-leap`, `-founder-hub`), and a white-glass `-light.svg` of every tile for light themes. `AppLauncher`: apps can carry a `group`; the menu then shows them in titled sections (in order of each group's first app), and the arrow keys move between sections. Also body-parser 2.4.0 (GHSA-27r3-jxmh-p828).

## 1.9.0

### Minor Changes

- 842ab9c: 1.9.0 — foundations (ENHANCEMENTS_PLAN.md release tracker).

  - **Brand theming from a seed colour.** `ThemeProvider seed="#e4572e"` (and `seedTarget="tertiary"` for a product brand) regenerates the accent roles at runtime with the same HCT tone table as the built-in themes, so contrast pairs stay AA in light, dark and every contrast level. The colour maths loads lazily, only when `seed` is set, and is applied through the CSSOM (strict-CSP safe). For SSR, `createSeedTheme()` / `createSeedThemeCss()` from the new `@nexub/tokens/seed` entry give the same values as data or CSS.
  - **Tailwind v4.** `@import "@nexub/tokens/tailwind.css"` after `@import "tailwindcss"` gives v4 apps the same utilities as the v3 preset (colour roles, shapes, elevation, type roles, spring timings, spacing), generated from the same token data and tested against Tailwind 4.3. The v3 preset is unchanged.

## 1.8.0

### Minor Changes

- 2e931b7: 1.8.0 — adoption (ENHANCEMENTS_PLAN.md release tracker).

  - **`npx nexub-migrate`** (ships in `@nexub/tokens`): moves app code onto current conventions — legacy colour names → roles, physical → logical (RTL) classes; reports tailwindcss-animate classes and dead `[var(--x)]/NN` opacity modifiers. Dry run by default, `--write` to apply, `--check` for CI.
  - **Upgrading guide** and an **example dashboard** in the docs, built only from public APIs.
  - **DataTable**: `DataTableColumn<T>` type export, column alignment (`meta.align`), `caption`/`captionHidden`, `aria-label` on the table itself, translatable pager; sort buttons no longer submit forms; translatable empty state (default text is now "No results found."). Note: the `ColumnMeta` augmentation adds an `align` field to TanStack's column meta.
  - **Table.Root** is keyboard-scrollable (named region) when it overflows. **Kbd** keeps shortcut order in RTL. **NumberTicker** no longer reverses digits in RTL.
  - **StatCard** `sentiment` (colour independent of the arrow); **PageHeader** `level`; **SplitButton** `status="loading"` disables the menu toggle.
  - **AppHeader** `position` (`fixed` default, `sticky`, `static`) and translatable strings via NexubProvider.

## 1.7.0

### Minor Changes

- 839c92c: 1.7.0 — hardening (ENHANCEMENTS_PLAN.md release tracker).

  - **Date pickers follow the reader.** `DatePicker` / `DateRangePicker` take a date-fns `locale` (or `NexubProvider dateLocale`) for month and weekday names, week start and the trigger format, follow `dir` (arrows and range bands flip in RTL), and their calendar labels are translatable messages.
  - **FileUpload** is a native `<label>` around the file input: one control with the visible text as its name (no nested buttons), keyboard and click open the picker natively, and file sizes format with `Intl` in the active locale.
  - **Accessibility fixes found by automated checks over every story:** a nameless `Avatar` is decorative (`aria-hidden`) instead of an unnamed image; `ScrollArea` viewports are keyboard-scrollable; `ActivityFeed` is a plain list (its `feed` role broke list semantics); the `NotificationItem` unread dot has an image role.
  - `Toast.Root` follows the finger when swiped, and toasts swipe toward the inline end in RTL.
  - Releases publish with npm trusted publishing only — no long-lived npm token.

## 1.6.0

### Minor Changes

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

## 1.5.1

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

## 1.4.0

### Minor Changes

- 15c47b5: **New pattern `AppHeader`**: the one top header every Nexub app shares. It is presentational; the app passes data and callbacks in.
  - Left to right: a `menu` slot (below `md`), the logo (`homeHref`, `onNavigate`), a centred search field (an icon below `md`) that opens a `CommandPalette`, the organization (`orgs`, `currentOrgId`, `onOrgChange`), a theme switch (`useTheme`, `showThemeSwitch`), the `AppLauncher` (`apps`) and an account menu (`user`, `accountHref`, `privacyHref`, `termsHref`, `onSignOut`, `accountMenuItems`).
  - Search takes static `searchItems` or an async `onSearch(query)` (debounced, with loading, empty and error states). Opens with ⌘K / Ctrl+K anywhere and "/" outside text fields.
  - Fixed to the top at the new `--app-header-height` variable (64px, in `@nexub/themes/base`) and followed by a spacer of that height, so pages, `AppShell.Body` and `SettingsLayout` start below it with no padding of their own.
  - `surface="glass"`; strict-CSP safe (class scroll lock, non-modal menus); fits at 375px, where the org switcher collapses to an icon.

  **`SettingsLayout`**: new `header` prop, `header={(menu) => <AppHeader menu={menu} … />}`, which replaces its top bar and hands the phone section-menu button to the AppHeader's menu slot. Its top bar and sticky sidebar now use `--app-header-height`.

- 8ee088d: Calm Depth surfaces & overlays (design refresh Phase 4). Props are unchanged.
  - **New role `--color-surface-elevated`** for floating layers: white in light, lighter than the page in dark. `--color-bg-raised` and `--color-surface-raised` now alias it; before, they were darker than the page in dark mode.
  - **Overlays** (Dialog, AlertDialog, CommandPalette, Drawer): 24px shape, the elevated surface, elevation 3, a 40% scrim, and spring enter/exit. AlertDialog's Action and Cancel are now real `Button` styles (destructive / outlined).
  - **Floating surfaces** (Popover, HoverCard, DropdownMenu, ContextMenu, Menubar, Select, NavigationMenu): 16px shape, elevation 2, and menu items with a concentric 10px radius, an on-surface state layer and explicit disabled text.
  - **Tooltip**: inverse surface on its own z-tier (`--z-tooltip`), so it no longer sits on the popover tier, and it now flips correctly in dark mode.
  - **Toast / Toaster**: an inverse-surface snackbar with an `inverse-primary` action.
  - **Card**: the elevated surface plus a soft alpha hairline. Shadows only for `surface` and `interactive`; `interactive` uses the state layer and a spring lift.
  - **Navigation**: TopNav and NavigationMenu items are capsules with state layers. The Sidebar is a tonal panel without a divider, and its active item is a secondary-container pill instead of a solid brand fill.
  - **AppHeader**: a glass header's account menu offers the glass intensity dial (Clear / Balanced / Tinted / Solid).

- 14d2e1a: Glass 2.0 (design refresh Phase 3).
  - **Recipe**: the fill is the surface role at the dial's opacity (`color-mix`), so dark glass needs no separate values. `backdrop-filter` is `blur + saturate`, and the edge is a hairline with a top specular highlight and a bottom rim. Same `surface="glass"` API.
  - **Thickness** scales with size: buttons are thin (8px blur, elevation 1), bars and popovers regular (16px, elevation 2), dialogs and drawers thick (28px, elevation 3). Set `data-glass-thickness` to override.
  - **Intensity dial**: `ThemeProvider` gains `glass` / `setGlass` (`'clear' | 'balanced' | 'tinted' | 'off'`), persisted under `nexub-glass` and applied pre-paint by `ThemeScript`. It sets `data-glass` on `<html>`, and any ancestor can set it too.
  - **Variants**: `data-glass-tint="primary"` for the single emphasised action, and `data-glass-variant="clear"` over imagery only.
  - **Scroll edge**: `TopNav.Root` / `AppHeader` accept `scrollEdge="soft" | "hard"`. Soft dissolves content under the bar instead of showing a divider.
  - **Button `variant="glass"`** (thin glass).
  - **Fallbacks are solid** under `prefers-reduced-transparency`, `prefers-contrast: more` (plus a 2px outline), `forced-colors`, `data-glass="off"`, and in browsers without `backdrop-filter`.

## 1.3.0

### Minor Changes

- d907d10: **Strict CSP: `Sheet` / `Drawer` can lock scroll without an injected `<style>`.**
  - New `scrollLock` prop on `Sheet.Root` / `Drawer.Root`: `"style"` (default, unchanged) or `"class"`. With `"class"`, page scroll is locked by the `nexub-scroll-lock` class from `@nexub/themes/base` on `<html>` (keeping the scrollbar's space, so nothing shifts) instead of Radix's injected `<style>` tag, which `style-src 'self'` blocks. The sheet stays modal: focus trap, hidden background for screen readers, Escape and outside-click still work.
  - `SettingsLayout`'s phone menu uses `scrollLock="class"`, so it opens under a strict CSP with no console error and the page behind is locked.
  - `@nexub/themes/base` also ships Radix's scrollbar-hiding rule for `ScrollArea` and `Select` viewports, so they look right when a strict CSP blocks Radix's `<style>` tag.
  - New docs page, Getting Started → Strict CSP: which components are CSP-safe and how to use the others.
- d907d10: **`Sidebar.Header` with a product logo and a status.** New `Sidebar.Header` takes the logo as children and an optional `status` (e.g. a "Live" `Badge`). They sit on one row when they fit; otherwise the status moves under the logo. When the sidebar is collapsed, the status is visually hidden but still announced.
  - `Logo` with `product` truncates the product name with an ellipsis when its container is too narrow, instead of overflowing.
  - `SettingsLayout`'s top bar lets a long product logo shrink and truncate next to the actions.

## 1.2.0

### Minor Changes

- d296fe3: **New pattern `AppLauncher`** (the "waffle" app switcher), replacing the copies hand-built in each app.
  - `<AppLauncher apps={[{ id, name, href, icon?, current? }]} onNavigate? surface? label? />`: an `IconButton` ("Nexub apps") opens a 320px `Popover` (aligned to the end) with a 3-column grid of app tiles (40px rounded icon and name).
  - Missing or broken icons fall back to an `Avatar` with initials. The current app is subtly highlighted and marked `aria-current="page"`.
  - Keyboard: opens with focus on the current app; arrow keys move through the grid, Home/End jump to the ends. `onNavigate(app)` takes over plain clicks for client-side routing; modified clicks still open the link.
  - `surface="glass"` supported. Renders nothing for an empty list.
  - `@nexub/icons`: new `Apps` icon (3×3 dots).

- d296fe3: **New pattern `SettingsLayout`** (the My Account layout) and **`SettingsRow`**.
  - Full-width frame: a `TopNav` with `logo` and `actions` slots, and a left `Sidebar` of sections built from `items: { id, label, icon, href }[]`, with `activeId` highlighted. It works with any router: `onSelect(item)` takes over plain clicks, and `href` still works for modified clicks.
  - Under 768px the sidebar becomes a menu button that opens a left `Sheet` with the same items. Choosing one closes it.
  - Content area (max width 3xl) with an optional page header (`title`, `description`). Children are sections: use `SettingsLayout.Section` (a `Card` with an optional title and description).
  - `SettingsRow` (also `SettingsLayout.Row`): label (and optional description) on the left, value in the middle, action on the right. It stacks on phones.

## 1.1.0

### Minor Changes

- 50236f4: ESM-only packages, working tree-shaking, and RSC-safe builds.
  - **Breaking:** `@nexub/react`, `@nexub/patterns` and `@nexub/icons` ship ESM only (CJS builds removed). `@nexub/tokens` exports gain a `default` condition, so `require('@nexub/tokens/tailwind')` now works on Node ≥20.19.
  - `@nexub/react` and `@nexub/patterns` are built per component and every output file starts with `'use client'`, so they import cleanly from Next.js Server Components. A single-component import drops from ~130 KB gz to ~6–9 KB gz.
  - `@nexub/icons`: unused icons are now tree-shaken (one icon ≈1 KB gz, was ≈10 KB).
  - The Tailwind preset now registers `tailwindcss-animate`, so component enter/exit animations actually render. `tailwindcss` is an optional peer of `@nexub/tokens`.
  - `@nexub/themes`: dark mode is no longer forced when `data-theme` is absent; with no attribute the OS preference decides.
  - **Breaking:** `ThemeProvider` drops the `attribute` prop (`class` mode never matched the theme CSS). `system` mode now removes `data-theme` instead of setting it, and the provider no longer causes hydration mismatches. `useMediaQuery` starts `false` on first render.

### Patch Changes

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

## 1.0.0

### Patch Changes

- Updated dependencies [099ed36]
  - @nexub/react@1.0.0
  - @nexub/tokens@1.0.0
  - @nexub/icons@1.0.0
