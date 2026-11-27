# Nexub DS — Publishing Guide

This document is the canonical reference for releasing packages.
Update the [Release History](#release-history) table after every publish.

---

## Package Overview

| Package | npm | Purpose |
|---|---|---|
| `@nexub/tokens` | [![npm](https://img.shields.io/npm/v/@nexub/tokens)](https://www.npmjs.com/package/@nexub/tokens) | Design tokens (CSS vars + Tailwind preset) |
| `@nexub/themes` | [![npm](https://img.shields.io/npm/v/@nexub/themes)](https://www.npmjs.com/package/@nexub/themes) | CSS theme files (light, dark, 4 brands) |
| `@nexub/icons` | [![npm](https://img.shields.io/npm/v/@nexub/icons)](https://www.npmjs.com/package/@nexub/icons) | Tree-shakeable icon components |
| `@nexub/react` | [![npm](https://img.shields.io/npm/v/@nexub/react)](https://www.npmjs.com/package/@nexub/react) | 90+ React UI components |
| `@nexub/patterns` | [![npm](https://img.shields.io/npm/v/@nexub/patterns)](https://www.npmjs.com/package/@nexub/patterns) | Composite UI patterns |
| `@nexub/brand` | [![npm](https://img.shields.io/npm/v/@nexub/brand)](https://www.npmjs.com/package/@nexub/brand) | Brand files (mark SVGs, app icons, favicon) |
| `@nexub/mcp` | [![npm](https://img.shields.io/npm/v/@nexub/mcp)](https://www.npmjs.com/package/@nexub/mcp) | MCP server serving the Claude skill (components, tokens, rules) |

All seven packages are in a changesets **`fixed`** group — they always publish at the same version number.
`@nexub/docs` is excluded from publishing (it's the docs website, not a library).

---

## Release History

| Version | Date | Type | Summary | Tag |
|---|---|---|---|---|
| `0.0.1` | — | Initial | Initial private release (pre-public, workspace only) | — |
| `0.0.2` | 2026-04-27 | Patch | Focus ring double-ring fix (Input, Textarea, Select, NumberInput, Heading); Toast SSR guard; Collapse RAF cleanup; FileUpload useMemo; useMergedRefs stable callback; Motion willChange hints | [v0.0.2](https://github.com/Nexub-AI/nexub-ds/releases/tag/v0.0.2) |
| `1.0.0` | 2026-10-12 | Major | Liquid Glass material layer; first public 1.0 (lockstep versioning) | — |
| `1.1.0` | 2026-10-12 | Minor | Plus Jakarta Sans typeface; ESM-only packages with working tree-shaking and RSC-safe builds; accessibility and stability fixes (DatePicker labels, WCAG input borders); lighter dependencies; StatusPill/Tag/Banner/Callout deprecated | [@nexub/react@1.1.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.1.0) |
| `1.2.0` | 2026-10-12 | Minor | Official Nexub mark in `Logo` (`mark`, `product`, brand-mark tokens); new `@nexub/brand` package; `AppLauncher` and `SettingsLayout` patterns; `Apps`/`Pin`/`Send`/`Crown` icons; Sheet sideways-scroll, Tabs inactive-panel and Drawer CSP fixes | [@nexub/react@1.2.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.2.0) |
| `1.3.0` | 2026-10-13 | Minor | Strict CSP: `scrollLock="class"` for Sheet/Drawer; fully typed Drawer without `vaul`; `Sidebar.Header`; Strict CSP docs page | [@nexub/react@1.3.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.3.0) |
| `1.4.0` | 2026-10-20 | Minor | Calm Depth refresh, phases 0–4: HCT colour roles, Inter + Jakarta, capsule controls, spring motion, Glass 2.0 dial, overlays and surfaces; visual regression | [@nexub/react@1.4.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.4.0) |
| `1.5.0` | 2026-10-20 | Minor | Connected ButtonGroup, SplitButton, floating Toolbar, NavigationRail, Amount/MoneyInput, ListDetail; rewritten foundations docs | [@nexub/react@1.5.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.5.0) |
| `1.5.1` | 2026-10-20 | Patch | Landing page on DS components; `TextGradient` background-image fix | [@nexub/react@1.5.1](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.5.1) |
| `1.6.0` | 2026-10-21 | Minor | Enhancement waves 1–4: strict-CSP components, every component on Calm Depth, design lint; cards, sheen, selectable/media cards, stacked toasts; data-viz palettes, P3, medium contrast, async buttons, ErrorSummary, undo, i18n/RTL; AI surface kit. | [@nexub/react@1.6.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.6.0) |
| `1.7.0` | 2026-10-21 | Minor | Hardening: axe checks over every story, bundle-size budgets, docs visual tests; date pickers follow locale + RTL; native-label FileUpload; accessibility fixes; Claude skill, `llms.txt` and new `@nexub/mcp` package | [@nexub/react@1.7.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.7.0) |
| `1.8.0` | 2026-10-21 | Minor | Adoption: `nexub-migrate` CLI, Upgrading guide, example dashboard; DataTable column type/alignment/caption, keyboard-scrollable Table, StatCard `sentiment`, PageHeader `level`, AppHeader `position` + translatable strings; RTL fixes | [@nexub/react@1.8.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.8.0) |
| `1.9.0` | 2026-10-21 | Minor | Foundations: brand theming from a seed colour (`ThemeProvider seed`, `@nexub/tokens/seed`); Tailwind v4 theme (`@nexub/tokens/tailwind.css`) | [@nexub/react@1.9.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.9.0) |
| `2.0.0` | 2026-10-28 | Minor | Rolling-minor release after 1.9 (not breaking): app tiles for every Nexub app in `@nexub/brand`, `AppLauncher` groups; body-parser 2.4.0. (its changelogs first listed dependencies as `1.10.0`, the pre-rollover name; corrected, and the rollover script now renames them) | [@nexub/react@2.0.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.0.0) |
| `2.1.0` | 2026-10-30 | Minor | React Native support: new `@nexub/react-native` (provider, primitives, components and screen patterns for iOS and Android), new `@nexub/core` (strings, locale, money formatting and prop types shared by web and native), `@nexub/tokens/native` and `@nexub/tokens/seed`, `@nexub/icons/native` | [@nexub/react@2.1.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.1.0) |
| `2.2.0` | 2026-10-30 | Minor | nexub.design rebuilt on the design system (faster navigation, Web · Mobile previews on every component and pattern, mobile-only components, native props tables); page templates in `@nexub/patterns` (Dashboard, Activity, Transaction detail, Settings, Sign in, Checkout, Chat, Paywall) with React Native twins; motion on web (spring transitions, `ListTransition`, `SkeletonSwap`) and React Native (`nxEnter`/`nxExit`/`nxLayout`/`nxSpring`) | [@nexub/react@2.2.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.2.0) |
| `2.3.0` | 2026-10-31 | Minor | Sticky `Sidebar.Footer` and `SettingsLayout` `navFooter`; docs and Storybook on Tailwind 4, `@nexub/tokens` peer accepts Tailwind `^3 \|\| ^4` (v4 theme pins `max-w-*` and text line heights; button pointer cursor in `@nexub/themes`; Pagination tabular figures); React Native enter/exit/layout presets back on the springs (2.2.0's timed presets broke iOS) and the toast on Reanimated's stock fade | [@nexub/react@2.3.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.3.0) |
| `2.3.1` | 2026-10-31 | Patch | First release published with npm trusted publishing (OIDC) from `release.yml`; every package now carries npm provenance. No code changes. `NPM_TOKEN` retired | [@nexub/react@2.3.1](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.3.1) |
| `2.4.0` | 2026-10-31 | Minor | Release hardening, no API changes: native previews checked against committed iOS/Android screenshot baselines in CI (also shown as "On device" shots in the docs); Lighthouse CI (≥95 in all four categories on 5 docs pages); `GOVERNANCE.md` with the alpha → beta → stable → deprecated lifecycle and status badges; Banner, Callout, Tag and StatusPill removal planned in 3.0; post-publish check of npm versions and provenance | [@nexub/react@2.4.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.4.0) |
| `10.6.0` | 2026-11-20 | Minor | Phone-first overlays: `sheet` (`true` or `"auto"`, off by default until 11.0) opens pickers, menus, AlertDialog and CommandPalette as a bottom sheet below 768px; poppers keep 8px from the viewport edge; Sidebar `collapseBelow` with tooltips; opt-in AppShell mobile drawer; container queries on PageHeader, PageFrame and six more; NavigationMenu fits 320px | [@nexub/react@10.6.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4010.6.0) |
| `10.7.0` | 2026-11-20 | Minor | Charts, calendar and tables: opt-in `interactive` charts (crosshair, tooltip, keyboard point navigation, `onPointClick`, legend toggles); EventCalendar day and agenda views; Table `stickyHeader`, `density`, `striped`; DataTable footer row and per-column filters; new `Truncate`, `DescriptionList`, `ComparisonBar` and the `StatusSteps` pattern (#306) | [@nexub/react@10.7.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4010.7.0) |
| `10.8.0` | 2026-11-20 | Minor | Templates: twelve page templates (SignUp, ForgotPassword, VerifyCode, Onboarding, KYC, Table, Detail, Booking, Invoice, Team, Notifications, SearchResults); `PhoneInput` (#303), `Countdown` and `useCountdown` (#304), `TimeSlotPicker`; a read-only `Select` no longer warns on mount; a closed PhoneInput country picker renders only the selected country | [@nexub/react@10.8.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4010.8.0) |
| `10.9.0` | 2026-11-20 | Minor (RC, on `next`) | Native next level and the 11.0 release candidate: `NexubNativeProvider expression="vivid"`, opt-in Android `dynamicColor`, gestures on the UI thread (`react-native-gesture-handler` >= 3 is now a required peer), native twins of `Tabs`, `Table`, `Rating`, `Tooltip` and more (#302), `QRCode` and native `QRScanner` (#305), and the `changes-in-11` codemod; `latest` stays on 10.8.0 | [@nexub/react@10.9.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4010.9.0) |
| `11.0.0` | 2026-11-21 | Major (RFC #662) | Better defaults and one source for the product accent, the first major by RFC: the four product theme files (`@nexub/themes/leap`, `/bookub`, `/payub`, `/founderub`) are removed in favour of `@nexub/themes/products`, and overlays default to `sheet='auto'` (a bottom sheet below 768px). Migrate with `npx nexub-migrate --rules changes-in-11`. Also docs playgrounds, States sections, a token explorer and page navigation | [@nexub/react@11.0.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4011.0.0) |
| `11.1.0` | 2026-11-21 | Minor | Fields stop fighting the user (gaps #1–#6, #27 of `ROADMAP_11.x.md`): `NumberInput nullable` (can be empty, limits on blur, `step="any"`), `DatePicker granularity="month" \| "year"`, `FileUpload` controlled `files`, `disabled`, `busy`, `progress`, `transform` and a `FileUpload.Trigger` button, new `ComboboxField`, `SwitchField`, `CheckboxField` and `CheckboxGroupField`, `Text` tones `danger`, `success`, `warning`, `formatPhone` and `dialCode` in `parsePhone`, and a `data-expression="calm"` area inside Vivid now opts back out | [@nexub/react@11.1.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4011.1.0) |
| `11.2.0` | 2026-11-21 | Minor | Pickers and prompts (gaps #8, #9, #10, #15, #17, #30, #31, #33 of `ROADMAP_11.x.md`): `CurrencySelect` / `CurrencyField` and MoneyInput `currencySlot`, `AlertDialog.Prompt` and `usePrompt()`, `ColorPicker`, `CommandList`, `EmojiPicker` and `IconPicker`; Autocomplete `label`, `clearOnSelect`, `onClear`; MultiSelect `onSearch` and avatars; DateTimePicker `clearable`; DateRangePicker `endExclusive` and `onComplete`; OTPInput `mode="backup"` | [@nexub/react@11.2.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4011.2.0) |
| `11.3.0` | 2026-11-21 | Minor | Dashboards tell the truth (gaps #11, #16, #23, #25, #26, #32 of `ROADMAP_11.x.md`): charts draw missing values as gaps, chart tones `good`, `warning`, `danger`, `neutral`, BarChart `orientation="horizontal"`, `colorOf` and `variant="waterfall"`, `integerTicks`, per-series `valueFormat`, a no-JS `tableView` ("Show as table") on BarChart, LineChart, DonutChart, Funnel and Heatmap; new `UsageTile`, `UsageBar` and `StageCounter`; StatCard, DonutChart, Funnel, Heatmap, Gauge, FilterBar and CheckList options | [@nexub/react@11.3.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4011.3.0) |
| `11.4.0` | 2026-11-22 | Minor | Boards, steps and calendars (gaps #12, #13, #14, #22, #24 of `ROADMAP_11.x.md`): Kanban `readOnly`, `canMove`, `dropTargets`, column header and footer slots, swimlanes (`lanes`, `getLane`) and card tones; Stepper statuses `error`, `warning`, `skipped`, `cancelled` with step `actions`; EventCalendar `onEventMove`, `editable`, `renderDayAction`, `eventActions`, `legend`; new `ResourceTimeline`; Sortable grids, locked items and `Sortable.Group`; `nexub-migrate` reports `<Stepper current={-1}>` | [@nexub/react@11.4.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4011.4.0) |
| `11.5.0` | 2026-11-22 | Minor | Conversations, lists, chrome and the last P4s (gaps #18, #19, #20, #21, #28, #29, #35, #37, #38 of `ROADMAP_11.x.md`): PromptInput `sendLabel`, `submitOn="mod-enter"`, `hint`, `error`; MessageBubble `from="other"`; Conversation `maxHeight`; async SavedViews with `onRename` and `confirmDelete`; TreeView `renderActions`, links, `onActivate`, `scrollToNode`; ActivityFeed `Date` timestamps and `ActivityFeed.Group`; NavigationRail `orientation="bottom"` and `badge`; InlineEdit `size` and `as`; new `OrgChart`; `Breadcrumb.Section`, PageHeader `eyebrow`, Dialog `maxHeight`; spacing `88` and `104`, perspective and glow tokens | [@nexub/react@11.5.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4011.5.0) |
| `11.6.0` | 2026-11-22 | Minor | Diagrams and web components (gaps #34 and #36 of `ROADMAP_11.x.md`, RFCs #713 and #712): new `@nexub/diagram` at `alpha` (`DiagramCanvas` and `DiagramNode` on React Flow, keyboard moves and connections, `layoutTree` and `layoutLayers`, read-only, minimap, a "Show as list" view, `styles.css` and `theme.css`); new `@nexub/elements` at `alpha` (form-associated `<nx-number-input>` and `<nx-date-picker>`, no runtime dependencies, `define.js` for CDNs); `@nexub/core` number and date-value rules shared with `@nexub/react`. First publish of both new packages through trusted publishing, with provenance | [@nexub/react@11.6.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4011.6.0) |
| `11.7.0` | 2026-11-24 | Minor | Quiet release: nothing flaky (`ROADMAP_12.x.md`). No new components: DatePicker month cells show the full month name (WCAG 2.5.3); `@nexub/core` `dateFieldMessages` and `diagram…` message keys, so `DiagramCanvas` follows `NexubProvider` `messages`; `<nx-date-picker>` strings come from `@nexub/core`; page templates ship only their own strings (1.5–2.1 kB gzip smaller per entry). Repo: a pass on retry or rerun opens a `flake` issue that blocks production; Lighthouse on mobile emulation (warn only). The 48 h staging soak it added was removed by the owner on release day | [@nexub/react@11.7.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4011.7.0) |
| `11.8.0` | 2026-11-24 | Minor | Native catch-up I: fields (`ROADMAP_12.x.md`). `@nexub/react-native` gains `ComboboxField`, `CurrencySelect`, `FileUpload`, `usePrompt()` / `PromptDialog`, `SwitchField`, `CheckboxField` and `CheckboxGroupField`; fields take `invalid`, `readOnly`, `required`, icon and addon slots, `onClear` and `size`; DateTimeField month and year grids, `mode="datetime"`, presets and time zones; OTPInput, MultiSelect, TreeList, StepProgress and display props. Web-only props on the 58 twins went from 283 to 140; the native essentials list (85 components) is on the React Native page | [@nexub/react@11.8.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4011.8.0) |
| `11.9.0` | 2026-11-24 | Minor | Alpha → beta prep and RFC 12.0 (`ROADMAP_12.x.md`). `@nexub/elements` gains `<nx-select>`, `<nx-combobox>` and `<nx-phone-input>` (form-associated, `invalid` on every field, `@nexub/elements/define/<name>`); the automated half of the screen-reader pass for `@nexub/diagram` and `<nx-date-picker>` (`A11Y_REVIEW.md`); opt-in `@nexub/react/styles.nexub-layer.css` (one `nexub` cascade layer); `@nexub/core` choice-field and phone messages; `nexub-migrate --rules changes-in-12` (opt-in). RFC 12.0 opened for comment | [@nexub/react@11.9.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4011.9.0) |
| `12.0.0` | 2026-11-27 | Major (RFC #753) | The clean break: every prebuilt stylesheet (`@nexub/react`, `/patterns`, `/marketing`, `/diagram`) in one `nexub` cascade layer, so app CSS wins without `!important` (Tailwind 4 apps declare `@layer theme, base, nexub, components, utilities;`); `Stepper current={-1}` removed. The Tailwind v3 compatibility defaults are deprecated (removed in 13.0) and 27 components are promoted to stable. Migrate with `npx nexub-migrate --rules changes-in-12` and `/getting-started/migrating-to-12` | [@nexub/react@12.0.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4012.0.0) |
| `12.1.0` | 2026-11-27 | Minor | Performance (`ROADMAP_12.x.md`). Lean CSS: `@nexub/themes/base-lean` and `/core-lean`, 23 component stylesheet parts, and `nexub-usage --css` / `--prune`, so a typical page drops from 43.5 kB to 21.2 kB gzip (CI keeps it under 21.9 kB); option lists in MultiSelect, CommandList and ComboboxField are windowed above 100 options; the suite runs under the React Compiler in CI (DataTable opts out); an INP gate under 200 ms on the three heaviest templates, faster docs hydration and an IconPicker hydration fix. Repo: the iOS Maestro run stops the app after the keyboard-up preview, and the lock-screen baselines were redrawn | [@nexub/react@12.1.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%4012.1.0) |

---

## Versioning Policy

Nexub DS uses **one version** for every `@nexub/*` package. **Every release bumps the minor.**

**From 10.0: semver, no rollover.** After 10.9 comes 10.10. A major happens only when something has to break.

```
9.8.0 → 9.9.x (10.0 RC, on `next`) → 10.0.0 → 10.1.0 → … → 10.8.0 → 10.9.x (11.0 RC, on `next`) → 11.0.0
```

| Situation | Changeset bump | Example |
|---|---|---|
| Scheduled release (additive, opt-in) | `minor` | `10.3.0` → `10.4.0` |
| Security or critical fix on the latest version | `patch` | `10.4.0` → `10.4.1` |
| Breaking change | `major`, by RFC only. CI rejects it until the RFC is accepted | `10.x` → `11.0.0` |

**Up to 10.0: rolling minor.** The minor rolled over into the major after 9 (`1.9.0` → `2.0.0`, …, `9.9.0` → `10.0.0`), so a major was not a breaking-change signal and breaking changes shipped in minors. 9.9 → 10.0 is the last rollover (`LAST_ROLLOVER_MAJOR` in `scripts/release-version.mjs`).

Rules:
1. **Write changesets with `minor` or `patch` only.** `pnpm check:release-policy` (in CI) fails on `major`.
2. **Multiple changesets in one release still produce one bump.** All packages share a version (changesets `fixed` group) and the highest bump wins.
3. **A major needs an RFC and a migration guide.** The PR that ships it changes the guards in `scripts/check-changesets.mjs` and `scripts/release-version.mjs`. It removes only what a 10.x minor deprecated at least one release earlier (`@deprecated` JSDoc, dev warning, docs notice: see GOVERNANCE.md).
4. **Minors don't break.** From 10.0 a consumer on `^10.0.0` gets every 10.x, so a minor may add and deprecate, never remove or change a default.
5. **After every publish, merge the back-merge PR.** The release job opens `chore(release): back-merge vX into development` (production → development). Merge it before the next promotion, or the version lines will conflict.

### Release candidates and the `next` tag

`scripts/publish-tarballs.mjs` picks the npm dist-tag from the version (`distTag`, from the `RC_LINES` list). Every version on a release-candidate line publishes to `next`; everything else publishes to `latest`.

| RC line | Candidate for | `latest` meanwhile |
|---|---|---|
| 9.9.x | 10.0 (shipped 2026-11-14) | 9.8.x |
| 10.9.x | 11.0 (RFC: `RFC_11.0.md`; shipped 2026-11-21) | 10.8.x |

**11.0.0 shipped on 2026-11-21** on `latest`, one day after its release candidate 10.9.0 went to `next`. No RC is out now; `next` still points at 10.9.0 as history. Apps upgrade with `npx nexub-migrate --rules changes-in-11` and `/getting-started/migrating-to-11`.

**10.0.0 shipped on 2026-11-14, one day into the planned 4-week soak.** The owner waived three exit criteria (flake rate, Scorecard 8, the soak) so apps could move to 10 at once; 9.9 changed no component since 9.8. The docs page `/getting-started/release-status` records where each criterion stood. Flakes and Scorecard are still tracked.

For a future release candidate, add its line to `RC_LINES` (and a case to the test in `scripts/supply-chain.test.mjs`). While one is out:

- **Freeze.** While an RC is on `next`, only fixes that block the release are merged: no new component, prop, token or default.
- **Soak.** The RC stays on `next` in the Payub and Matchub pilots. A regression is fixed as a patch (still `next`).
- **A fix `latest` users need during a soak** can't ship on the previous version (production is already on the RC). Remove the RC line from `RC_LINES` in the fix PR: the RC then publishes to `latest` and the soak continues there.

### What the 11.0 PR must change

10.9 leaves the version guards alone, so until this PR a `major` changeset still fails CI. The 11.0 PR, opened after the RFC is accepted (3 working days of comments at least):

1. `scripts/check-changesets.mjs`: `invalidBumps` accepts `major` (today it accepts `minor` and `patch` only).
2. `scripts/release-version.mjs`: `nextVersion` lets `10.x → 11.0.0` through. Today it throws on any change of major ("changesets proposed a major bump").
3. `scripts/release-version.test.mjs`: the case `nextVersion('10.9.0', '11.0.0')` expects a throw; make it expect `11.0.0`.
4. One changeset with `major` for the fixed group, each breaking line starting with `**Breaking:**`.
5. The two changes of the RFC and nothing else: delete `packages/themes/src/{leap,bookub,payub,founderub}.css`, their `exports` in `packages/themes/package.json` and their imports in `packages/react/src/styles.css`, `packages/react/.storybook/preview.css` and `apps/docs/src/styles/globals.css`; set the `sheet` default to `'auto'` (`SheetProp` in `packages/react/src/utils/popper.ts`) and update the `@default` JSDoc. The first test in `packages/tokens/bin/nexub-migrate.test.mjs` reads the four files: drop them from its list. In the docs, point "Migrating to the latest version" (`apps/docs/src/registry/index.ts`) at `migrating-to-11` and move the "(latest)" label in `MigrationPicker.tsx`.
6. `scripts/publish-tarballs.mjs` needs no change: 11.0.0 is not on an RC line, so it publishes to `latest`. Keep `10.9` in `RC_LINES` as history.
7. In the first PR after 11.0.0 is on npm, put both guards back so the next `major` needs its own RFC. Done by design (checked in the 11.0.0 bookkeeping PR): `allowMajor` is true only while `@nexub/react` is on 10.x, and `nextVersion` passes only `10.x → 11.0.0`, so from 11.0.0 a `major` changeset fails CI again. The next major raises `APPROVED_MAJOR` with its own RFC.

The policy code lives in `scripts/release-version.mjs` and `scripts/check-changesets.mjs`, tested by `scripts/release-version.test.mjs`.

---|---|---|
| Bug fix, internal refactor, performance, docs | `patch` | `0.0.2` → `0.0.3` |
| New component, new prop, backward-compatible feature | `minor` | `0.0.3` → `0.1.0` |
| Renamed/removed export, breaking prop change, peer dep bump | `minor` with a `**Breaking:**` line (see the policy above) | `1.4.0` → `1.5.0` |

All packages in the fixed group always bump to the **same version** even if only one package changed.

---

## Release Process

Publishing is automated by `.github/workflows/release.yml` (changesets/action). Nobody runs `npm publish` by hand.

1. **Add a changeset in your PR.** Run `pnpm changeset` and pick **`minor`** (or `patch` for a hotfix). See the [Versioning Policy](#versioning-policy). Or write `.changeset/<name>.md` by hand:
   ```markdown
   ---
   "@nexub/react": patch
   ---

   Short description of what changed and why.
   ```
   Use one changeset per logical change. All of a release's changesets combine into one version bump.
2. **Merge through the branches:** feature → `development` (CI) → `staging` (deploys the staging docs) → `production`.
3. **The first push to `production`** with pending changesets makes changesets/action open or update a **"chore(release): version packages"** PR. That PR bumps versions and writes the CHANGELOGs.
4. **Merging the version PR** publishes all `@nexub/*` packages to npm (the tarballs packed and attested by the reusable `build-release.yml` build, uploaded byte for byte by `scripts/publish-tarballs.mjs`, then tagged with `changeset tag`; authenticated by npm trusted publishing: each package on npmjs.com trusts `Nexub-AI/nexub-ds` → `release.yml`, so no npm token is stored; versions carry provenance), attaches an SPDX SBOM to the `@nexub/react` GitHub release, and deploys the docs to production. The `publish` job's last step, `scripts/verify-published.mjs`, then checks that every published version is on the registry with a provenance attestation (retrying for up to 5 minutes while the registry catches up) and fails the run, naming the packages, if any is missing or unattested.
5. **Add a row** to the [Release History](#release-history) table.

> `release.yml` holds one credential per job (since 7.1). `build` has no secrets and builds packages and docs; `version` (Version PR) and `back-merge` use `RELEASE_PAT`; `publish` uses only npm OIDC and the job's own token; `deploy-docs` uses only the Cloudflare token, with wrangler pinned in the lockfile. Jobs that hold a credential install with `--ignore-scripts` and build nothing.
>
> `RELEASE_PAT` (a fine-grained PAT with Contents + Pull requests write; the org blocks the Actions bot from creating PRs) and the Cloudflare secrets belong in the **`release` environment** (Settings → Environments, deployment branch `production` only), not in repo secrets, so no PR-triggered workflow can read them. Since the version PR is opened by a real user, CI runs on it like any other PR.

### Release routine (checklist)

Follow this list every time a version is done. It covers each hop, the post-release wrap-up and how to report status. A version is finished only when every box is ticked.

**Rules for every hop**

- Merge only when the PR's CI is green. Never merge red. Repo auto-merge is off, so you merge each hop by hand: `gh pr merge <n> --merge`.
- Watch CI yourself, don't wait for someone to ping you: `gh pr checks <n> --watch --fail-fast`, or `gh run watch <run-id> --exit-status` for a workflow run.
- A changed PR base does not start CI. Push a commit (for example, merge the base in) to start it.
- **No rerun to green (11.7).** A check that fails and then passes on a retry or a rerun is a flake, not a pass. CI's *Flake issue* job opens an issue labelled `flake` for it (or comments on the open one). Find the cause and fix it; don't rerun until it passes and move on.
- **No soak (since 2026-11-24).** 11.7 added a 48-hour staging soak; the owner removed it on 2026-11-24. A version goes to `production` as soon as its staging CI and Mobile run are green and no `flake` issue is open. Release versions one at a time: each version gets its own `staging` → `production` hop and its own npm release. The gate still has `SOAK_HOURS` (now `0` in `ci.yml`) if a soak is wanted again.

**1. Promote**

- [ ] **feature → `development`**: changeset included, full CI green (build, typecheck, lint, test, visual, Lighthouse, release rehearsal). Merge.
- [ ] **Mobile (Maestro) on `development`**: runs after the merge, about an hour. It must pass for the commit you are promoting. If the PR adds native previews or changes the native look (tokens, React Native theme defaults), dispatch the Mobile workflow on the branch *before* merging.
- [ ] **`development` → `staging`**: build, typecheck and lint run (visual and Lighthouse already passed on `development`). Merge, then watch `staging.yml` deploy the staging docs.
- [ ] **`staging` → `production`**: confirm the Mobile run from the step above is green, and the PR's **Release gate** check: no open `flake` issue (the owner can label one `waived`). Merge. `release.yml` opens the **Version Packages** PR.
- [ ] **Version Packages PR**: CI green (it rehearses the publish). Merge. Watch `release.yml` until `publish`, `verify-published` and `deploy-docs` pass.
- [ ] **Check npm**: `curl -sH 'Cache-Control: no-cache' https://registry.npmjs.org/@nexub/react | jq -r '."dist-tags".latest'` shows the new version. The registry can lag a few minutes.
- [ ] **Back-merge PR** (`chore(release): back-merge vX into development`): CI green, merge. Do this before the next promotion.
- [ ] Add the row to [Release History](#release-history) and mark the version shipped in its `ROADMAP_*.md`.

If a step fails after the publish, see `INCIDENT_RUNBOOK.md`.

**2. Wrap up**

- [ ] **Open PRs**: merge the green, low-risk ones. List the rest with a recommendation. Don't close someone else's PR.
- [ ] **Branches**: `git fetch --prune`, delete local branches that are merged or gone (`git branch -d`; run `git cherry` before using `-D`), `git worktree prune`. Leave other people's worktrees alone.
- [ ] **Graphify**: in Claude Code, run `/graphify . --update` in the checkout that holds `graphify-out/`. For a code-only refresh without an LLM, run `graphify update .`. See [CONTRIBUTING.md](./CONTRIBUTING.md#knowledge-graph-graphify).
- [ ] **Obsidian vault**: stage the new graph report, the changed repo docs (plans, roadmap, this file) and the release notes in the vault inbox. Ingest them in one transaction with the claude-obsidian `wiki-ingest` skill, then checkpoint. Use the UTC date (`date -u +%F`) for ledger dates. Ask the maintainer for the vault path.

**3. Report status**

Whenever someone asks for status, during a release or any other work, answer with this table:

| Environment | Progress | Expected time (approx.) |
|---|---|---|
| development | ✅ #701 merged; Mobile run green | done |
| staging | 🔄 #702 CI running | ~10 min |
| production | ⏳ waits for staging | ~20 min |
| npm / docs | ⏳ Version PR not open yet | ~40 min |

Use one row per environment (or per stream of work outside a release). Under Progress, give the state plus the PR or run number. Expected time is a rough estimate.

### Pre-flight check (optional)

```bash
pnpm turbo build --filter='./packages/*'
for pkg in tokens themes icons react patterns; do (cd packages/$pkg && npm pack --dry-run); done
```

Check that only `dist/` (or `src/` for themes) is listed and that react stays under ~150 KB packed.

### Supply chain (9.7)

- The release build packs deterministically: `pnpm check:reproducible` builds twice and compares tarball hashes; CI compares its own build with the release build on every PR (job "Release rehearsal").
- The publish job attaches the tarballs, `checksums.txt` and `nexub-provenance.intoto.jsonl` to the `@nexub/react@<version>` release, verifies each published tarball's attestation (`gh attestation verify`), and pushes a Sigstore-signed tag `v<version>`. Since 9.8 both steps fail the run (the packages are already on npm by then; see `INCIDENT_RUNBOOK.md`, "A release step failed after the publish").
- If a publish stops halfway, re-run the workflow: versions already on npm are skipped.
- The Version Packages PR runs the release build and the publish dry run against the new version numbers, so a publish problem shows there, before the merge that publishes.
- A security or critical fix ships as a `patch` through the same path, without waiting for the next release: `INCIDENT_RUNBOOK.md`, "Hotfix".

### Break-glass: manual publish

Use this only if the workflow is broken. Run `npm login` (`npm whoami` to confirm), then `pnpm changeset version`, `pnpm release`, and commit the version bump.

---

## Troubleshooting

### `workspace:*` dependencies in published package
pnpm rewrites `workspace:*` and `workspace:^` to real versions on publish. Verify with `npm pack --dry-run`.

### "Package name too similar to existing package" / 403 on first publish
The `@nexub` scope must exist on npm and you must have publish rights.
Create the org at https://www.npmjs.com/org/create if needed.

### Publish succeeded but `npm view` shows old version
npm CDN propagates in ~30 seconds. Wait and re-run `npm view`.

---

## What ships in each package

| Package | Ships | Does NOT ship |
|---|---|---|
| `@nexub/tokens` | `dist/` (CSS vars, JS, Tailwind preset, JSON) | `src/`, `scripts/`, tests |
| `@nexub/themes` | `src/` (raw CSS files) | nothing extra — CSS is the source |
| `@nexub/icons` | `dist/` (ESM + types) | `src/`, tests |
| `@nexub/react` | `dist/` (ESM, one entry per component, + types) | `src/`, tests, stories |
| `@nexub/patterns` | `dist/` (ESM + types) | `src/`, tests |
| `@nexub/brand` | `assets/` (SVG, PNG, ICO) | `scripts/`, `glyphs/` |
| `@nexub/mcp` | `src/` (server + CLI), `dist/skill/` (copy of `plugins/nexub-ds/skills/nexub-ds`) | tests |

---

## Peer Dependencies

| Package | Peers |
|---|---|
| `@nexub/react` | `react`, `react-dom` `>=18 <20`; `@nexub/tokens` |
| `@nexub/patterns` | `react`, `react-dom`; `@nexub/react` (+ optional `@nexub/icons`, `@nexub/tokens`) |
| `@nexub/icons` | `react`, `react-dom` `>=18 <20` |
| `@nexub/tokens` | optional `tailwindcss ^3` (only for the Tailwind preset) |
| `@nexub/themes` | none |
| `@nexub/brand` | none |

All packages are **ESM-only**. Loading the Tailwind preset with `require()` needs Node ≥ 20.19.
