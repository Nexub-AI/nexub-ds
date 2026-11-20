# Roadmap 10.3 → 11.0 — UI quality

Drafted 2026-11-15, last rewritten 2026-11-17. Follows [ROADMAP_8.x.md](ROADMAP_8.x.md). 8 releases: 10.3–10.9, then 11.0. **Approved by the owner on 2026-11-17**, with the suggestions in "Decisions" accepted. One input is still open and is listed there. Development started on 2026-11-17, on the owner's go.

**Why it starts at 10.3.** 10.1.0 (2026-11-16: division mega-menu, division and app accents, one typeface) and 10.2.0 (2026-11-17: CRM icon, icon gap and Vivid card fixes) are already released.

**Pace (decided 2026-11-17).** Fast, as in 8.x and 9.x: each version ships as soon as it is ready, one at a time, development → staging → production → npm. The 3–4 week rhythm in ROADMAP_8.x.md does not apply to this plan.

**Shipped.** 10.3.0 (2026-11-17), 10.4.0 (2026-11-17), 10.5.0 (2026-11-18, 10.5.1 the same day), 10.6.0 (2026-11-20), 10.7.0 (2026-11-20), 10.8.0 (2026-11-20). 10.9 and 11.0 are built on their `feat/*` branches and not yet released.

**Direction.** 5.x–7.x added components and a look. 8.x–9.x made the library stable and secure. 10.x is about what people see:

- **10.3 — The app stops looking plain.**
- **10.4–10.5 — Finish what 7.x started,** and add the states that never existed.
- **10.6–10.7 — New on web.** Phone-first overlays; charts, calendar and tables you can use.
- **10.8 — New templates.**
- **10.9 — New on native, and the 11.0 RC.**
- **11.0 — The better defaults become the defaults, and the docs show it all off.**

## How this plan was made

Three read-only audits on 2026-11-15 (web components, React Native, docs site), a review of the visual baselines, every earlier plan's "later" list, a pass on 2026-11-16 that checked each item against the changelogs so nothing already shipped is planned again, and a review of the product accents and the marketing and Vivid layers on 2026-11-17.

Two limits. Counts come from grep and prop reads, not from a running app. And the audits ran on a checkout from before 10.1.0, so anything 10.1 or 10.2 touched may have moved. **Each version starts by re-measuring its own numbers on current `development`.** Items the audit could only infer are marked *(check)*.

## Two findings that lead the plan

### The app looks plain next to the marketing site

- Vivid has been the default since 5.0, but it styles only filled buttons, switches, checkboxes, radios, progress bars, card hover and the focus halo.
- The surfaces people look at most in an app are untouched: sidebar, page header, stat cards, tables, empty states. In the baselines they are grey on white.
- Marketing mode has what the app lacks: heavier headings, a gradient main button, showcase cards, a gradient eyebrow chip, an ambient backdrop, reveal and float motion.

**Rule for bringing it over.** A marketing page is seen for 30 seconds and an app for hours. Colour and motion go on landmarks and moments; working surfaces (tables, forms) stay calm. Dense screens can still set `calm`.

### Product colour: one accent, no themes

10.1.0 already went this way, for the nexub.com rebuild:

- Accent scales for 5 divisions (os, commerce, fintech, intelligence, autonomous) under `data-division`.
- `@nexub/themes/products`: an accent for every app under `data-product` (people, contracts, forms, commerce, money, capital, mind, go, command-hub, runner, with aliases book-hub, payhub, founder-hub), generated from one token map.

**Direction (decision 1).** Keep it at that: every product looks like Nexub, and is recognised by its icon and name plus one accent colour in a few fixed places. No per-product themes. What 10.1 left for the apps:

- No written rule for where the accent may appear inside an app.
- `ThemeProvider` still accepts only the original 4 products.
- The app header and launcher do not read the product map *(check)*.
- The 4 hand-written files (leap, bookub, payub, founderub) sit beside the generated ones.

This is small and rides in 10.3.

## What already shipped, and what it left

| Area | Shipped | Left over |
|---|---|---|
| Sizes | Shared `Size` type (2.8) | 8 components use it. Combobox, Tabs, Slider, RadioGroup, OTPInput, FilterChip, TimePicker and DateTimePicker have no size prop |
| Density | Compact density (5.3) | 8 components use fixed heights and ignore it: Pagination, OTPInput, FloatingInput, Chip, Badge, Table, Switch, DatePicker day cells |
| Invalid | One shared rule styles every text-like input through `FormField` | Checkbox, RadioGroup, Switch, Slider, the card inputs and FileUpload have no invalid look. `readOnly` exists on 4 inputs |
| Disabled | "Disabled is a colour" rule | Three treatments in the Button gallery alone. Label still uses opacity |
| Loading and empty | Skeleton shimmer, DataTable `loading` and `emptyState` (7.4), EmptyState presets (5.6) | Charts, EventCalendar, TreeView, Kanban and Table have neither. 2 of 26 patterns take `loading` |
| Motion | Motion 2 (7.3), sliding indicator on Tabs and SegmentedControl, list height animation (7.5) | No indicator on ToggleGroup, NavigationRail, Sidebar, Pagination, Stepper. About 10 components change state with no motion. Drawer is off the spring tokens |
| Component tokens | Tier for Button, fields, Card, Badge (2.7) | No tier for dialog, popover, menu, tooltip, toast, tabs, table, switch, checkbox, avatar, alert, navigation. 70 raw type sizes in 29 components |
| Overlays | Dialog `sheet="auto"` (7.6) | No `collisionPadding` anywhere; only Select caps its height *(check)* |
| Native | Sheet and toast springs, 7.4–7.6 props ported (7.8) | Accordion, Progress, Checkbox, Radio, PageIndicator, Dialog and TextField do not animate. Keyboard avoidance missing in `ScreenContainer` and on Android sheets |
| Exception lists | Shrink-only lists (8.6, 9.2, 9.4) | Web px 36 hits, native 109 numbers, reflow 8 stories, docs CLS 5 pages |

## What does not exist yet

| Area | Missing |
|---|---|
| Error state | No data component has one. A failed load has no designed look anywhere |
| Empty states | Icon, title, one line. No illustration, so every empty screen looks the same |
| Phones | Select, Combobox, DatePicker, menus and CommandPalette open as desktop popovers on a phone. Sidebar never collapses on its own. Container queries in 3 places |
| Charts | No pointer crosshair, no click on a point, CSS-only tooltip, no legend toggles |
| Calendar | Month and week only. No day or agenda view |
| Tables | Plain `Table` has no sticky header, density or striping. DataTable has no footer row or column filter |
| Templates | 8 exist. Missing: sign-up, forgot password, OTP, onboarding, table page, detail/edit form, 404/500, booking flow, invoice, team and roles |
| Native | Touch read on the JS thread (stated in the 7.8 notes). 78 web components with no twin. No Android dynamic colour or predictive back. No tablet layouts. Baselines in light only. Showcase is a gallery, not an app |
| Docs | Playground on 4 of 141 components. 57 components with one example; loading shown in 2. No states gallery, token explorer, breadcrumbs, previous/next, or mobile table of contents |

## The plan

Rules for every version: additive and opt-in, all 10.0 gates stay blocking, every change gets a baseline in light, dark, RTL and forced colours, and docs examples ship with the feature.

| Version | Kind | Theme | Headline |
|---|---|---|---|
| **10.3** | **New** | **Lively app surfaces** | Vivid reaches the app. Page and dashboard headers: heavier headings and an optional soft colour wash. StatCard: coloured icon chip, sparkline, count-up, lift on hover. Sidebar and navigation: tinted active item with a sliding marker, real hover states. A small palette of category colours for icon chips, tags and avatars, AA-checked in every theme. Tonal colour variants for Button, and the gradient main action allowed in apps, one per screen. One hover language for rows, list items and cards. Chart fills use gradients. A welcome banner and a small success animation. The Dashboard template is rebuilt as the reference screen. All of it sits under `data-expression="vivid"`, so `calm` is unchanged. **Product accent in apps:** a written rule for where it appears (product icon chip, active navigation item, header wash, illustrations; not charts, whose palette is tuned to stay apart for colour-blind readers), `ThemeProvider` accepts every product in the 10.1 map, AppHeader, Sidebar and AppLauncher read the map, and the 4 hand-written product files are deprecated |
| **10.4** | Completion | **Consistent controls** | Every control on the shared size scale; the 8 fixed heights onto `h-control-*`. Invalid look for the 6 non-text controls; `readOnly` on every input. One disabled treatment per variant. Component token tier for the 12 parts that lack one. All raw type sizes onto type roles. Bulk action bar action sized to its label. Scrollbars in every engine, `tabular-nums` on numeric surfaces. Empties the web px list |
| **10.5** | Completion + **New** | **Every state** | *Completion:* `loading` and `emptyState` on charts, EventCalendar, TreeView, Kanban, Table and the patterns, in the DataTable prop shape. Sliding indicator on the components without one; motion for the static ones; Drawer onto the springs. Native: the 7 static components animate, keyboard avoidance on both platforms. *New:* an `errorState` with retry on every data component. `Skeleton` presets (card, table row, list row, chart, form). EmptyState `illustration` slot and spot illustrations coloured by the tokens and the product accent. Offline and "no access" as full-page states. Templates: 404, 500, maintenance. Empties the docs CLS and native lint lists |
| **10.6** | **New** | **Phone-first overlays** | Select, Combobox, MultiSelect, DatePicker, menus and CommandPalette open as a bottom sheet on narrow screens (`sheet="auto"`, opt-in until 11.0). AlertDialog adapts. `collisionPadding` and height caps on every popper. Sidebar collapses at a breakpoint, with tooltips when collapsed. Components respond to their container, not the viewport. NavigationMenu fits 320px. Empties the reflow list |
| **10.7** | **New** | **Charts, calendar and tables** | Charts: pointer crosshair with a real tooltip, `onPointClick`, legend toggles, keyboard point navigation, opt-in so default charts stay server-rendered. EventCalendar: day and agenda views. `Table`: sticky header, density, striping. DataTable: footer row and per-column filter. A `Truncate` helper that shows a tooltip only when text is cut. **Rider: description list, status steps, comparison bar (#306)** |
| **10.8** | **New** | **Templates** | *Getting in:* sign-up, forgot password, OTP/2FA, onboarding wizard, KYC step, with **riders PhoneInput (#303)** and **Countdown (#304)** for the OTP resend timer. *Daily work:* table page with filters and bulk actions, detail/edit form page, booking flow (calendar, slots, confirmation), invoice and receipt, team and roles, notifications page, search results. Each uses the 10.3 look, the 10.5 states and the 10.6 phone behaviour |
| **10.9** | **New** | **Native, next level, and 11.0 RC** | The 10.3 look and the product map on native. Gestures onto gesture-handler worklets (decision 4). **Rider: twins from #302** (Tabs, Table, Rating, StatCard, NumberTicker) plus Tooltip. **Rider: QRCode and QRScanner (#305)**, web and native. Android dynamic colour and predictive back. Tablet and landscape layouts. Baselines in dark, high contrast, RTL and large font. Showcase becomes a small connected app. Then feature freeze, deprecations, `nexub-migrate` rules, Migrating to 11.0, RC on `next` |
| **11.0** | Major | **Better defaults, and the showcase** | *Breaking:* the 4 hand-written product files removed in favour of the generated map; overlays adapt to small screens by default; sizes outside the shared scale removed; web and native variant names aligned; whatever 10.x deprecated removed. *Docs:* playground generated from prop types on every component page, a states gallery per page, token explorer, breadcrumbs, previous/next, mobile table of contents, search with recents, a landing page that shows the templates, docs chrome onto the DS's own components. Malayalam (#307) is dropped: see decision 6. Native components leave alpha **if** the Payub pilot has reported; otherwise 11.0 ships without that |

Waiver debt from 10.0 (flake window, Scorecard 8, the stale `next` dist-tag) is worked alongside, outside the version train.

10.3, 10.5 and 10.8 are the largest versions. If one runs long, ship it in two parts (the next number goes to the second part and the rest shift) before cutting scope.

## How each version is judged

| Version | Measure | Today | Target |
|---|---|---|---|
| 10.3 | App surfaces styled by Vivid (header, stat card, sidebar, rows, charts) | 0 of 5 | 5 |
| 10.3 | Products `ThemeProvider` accepts | 4 | the whole 10.1 map |
| 10.4 | Controls on the shared size scale / parts with a token tier | 8 / 8 | all / 20 |
| 10.4 | Web px exceptions / raw type sizes | 36 / 70 | 0 / 0 |
| 10.5 | Data components with loading, empty and error / components with no motion | 0 / 10 | all / 0 |
| 10.5 | Illustrated presets / docs CLS and native lint exceptions | 0 / 5 and 109 | 5 / 0 and 0 |
| 10.6 | Poppers that adapt on small screens / reflow exceptions | 1 / 8 | all / 0 |
| 10.7 | Chart types with pointer tooltip and click | 0 of 9 | 9 |
| 10.8 | Page templates | 8 | about 25 |
| 10.9 | Native gestures on the UI thread / baseline schemes | 0 / 1 | all / 5 |
| 11.0 | Components with a playground / with one example only | 4 / 57 | 141 / 0 |

## Why this order

- **The plain app first.** It is the most visible problem and the one the owner raised. It also sets the look that every later template is drawn in.
- **Completion before new screens.** Templates are built from the controls. If sizes, states and tokens are uneven, every template inherits it.
- **States and phones before templates.** The templates show loading, empty and error, and most sign-up and booking flows run on a phone.
- **Web before native.** Native ports decisions made on web.
- **Docs showcase last.** The playground and states gallery need the states and templates to exist. Examples ship with each version.

## Out of scope

Other languages and scripts (decision 6), per-product themes beyond one accent, rich text editor, form builder, voice input, live-updating charts, glass refraction, a Figma kit and Code Connect (no Figma access), docs version switcher (no hosted old docs), Expo Go QR (no EAS project), recorded screen-reader sessions.

## Decisions

Settled on 2026-11-17 with the plan's approval:

1. **Product colour.** One generated accent per product in fixed places, as 10.1 built. No per-product themes.
2. **11.0 is a major.** It removes the product files and flips defaults, so its RFC is written at 10.9, as the 2026-11-09 rule requires.
3. **Illustrations.** A small set drawn in code (SVG, token-coloured), one per EmptyState preset.
4. **Native gestures.** gesture-handler becomes a required peer of `@nexub/react-native` in 10.9.
5. **ROADMAP_8.x.md.** Its Matchub mentions were struck on approval.
6. **English only (owner, 2026-11-17).** The design system ships in English. Translation and other scripts, Malayalam included, are done in the application, so #307 is not built.

Still needed from the owner:

- **Which templates.** The 10.8 list is a guess at what the products build first. It is built as listed unless the owner swaps it before 10.8 starts.
