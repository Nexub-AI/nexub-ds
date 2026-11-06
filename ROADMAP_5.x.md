# Roadmap 5.1 → 6.0

Drafted 2026-11-06 from the enterprise SaaS component audit (Nexub-Component-Audit-Findings.pdf); approved 2026-11-07. Follows [ROADMAP_4.x.md](ROADMAP_4.x.md): one release per version, rolling-minor (5.9 rolls over to 6.0), development → staging → production → npm.

**Direction.** 4.x made Nexub expressive. 5.x makes it carry a real enterprise app: dense data, complex inputs, filters, and the states around them. Same ground rules: WCAG AA, tokens only, native platform before JavaScript, new behaviour opt-in in a 5.x minor and default only in 6.0.

## Audit verification

Every finding was checked against the source on `development` (after #314).

| Finding | Verdict | Evidence |
|---|---|---|
| FileUpload drop skips `accept` | Confirmed | `FileUpload.tsx` `handleDrop` passes `e.dataTransfer.files` straight to `addFiles`; only the `<input>` has `accept` |
| Autocomplete hides search text | Confirmed, and worse | `search` is internal state with no `onInputChange`; cmdk also filters client-side, so async results that don't match the label would be hidden even if the text were exposed. Fix needs `shouldFilter={false}` in async mode |
| FilterBar search has no label | Confirmed | raw `<input type="search">` with only a placeholder; the placeholder `'Search…'` is also hard-coded English (bypasses `useNexubMessages`) and the field skips `SearchInput`, so it has no clear button or focus ring token |
| DataTable gaps (selection UI, sort order, resize/reorder/visibility, pinning, virtualization, density) | Confirmed | props are only `columns, caption, data, enableSorting, enableRowSelection, pagination` |
| Toast fixed to top-end | Confirmed | `Toast.tsx:20` `fixed top-0 end-0` |
| Drawer header/footer not sticky | Confirmed | plain divs; the panel scrolls as one |
| Breadcrumb.Ellipsis visual only | Confirmed | no `maxItems`, no menu |
| No global Cmd+K | Confirmed | CommandPalette has no key listener |
| EmptyState generic, AlertDialog no type-to-confirm, DateRangePicker no presets/timezone | Confirmed | |
| No web OTP, no tag/multi-select input, no virtualization library | Confirmed | RN has OTPInput (`components/mobile.tsx`); no RN DataTable or file picker |
| Contrast "not confirmed" | **Wrong: already enforced** | `packages/tokens/scripts/generate.test.mjs` asserts 4.5:1 for every text pair and 3:1 for `outline` on every surface; seed and marketing tests do the same |
| No manual screen-reader evidence | Confirmed | already on the blocked list (recorded sessions) |
| Component count 107 / 26 patterns | Confirmed | 108 folders in `packages/react/src/components` incl. providers |

## Bugs (first in 5.1)

Decided 2026-11-06: the three audit bugs ship in 5.1, not as 4.x patches.

1. FileUpload: filter dropped files through the same `accept` check as the picker (MIME + extension, `image/*` wildcards). Client-side only; apps must still validate on the server, say so in the docs.
2. Autocomplete: add `inputValue` / `onInputChange` and turn cmdk filtering off when `onInputChange` is set.
3. FilterBar: render `SearchInput` with `aria-label` (new `searchLabel` prop, default from messages) and a localised placeholder.

## Versions

| Version | Theme | Headline |
|---|---|---|
| 5.1 | Bugs + quick wins | The three audit bugs above, then Toast `position` prop (6 positions), sticky Drawer header/footer, `CommandPalette` `shortcut` prop (Cmd/Ctrl+K, off by default), FileUpload `maxSize` + `onReject` with type/size error messages, Breadcrumb `maxItems` auto-collapse into a DropdownMenu |
| 5.2 | Combobox 2.0 | Popover rendering (`mode="popover"`, inline stays default until 6.0), skeleton loading, "Create ‹query›" option, async recipe. New **MultiSelect** with chips, "+N more", backspace-to-delete, built on the same Combobox |
| 5.3 | DataTable 2.0: selection & density | Built-in checkbox column, select page / select all (with "all 1,240 selected" banner), floating **BulkActionBar**, multi-sort order badges (1, 2…), density toggle (comfortable / compact, reuses compact density tokens), column visibility menu |
| 5.4 | DataTable 2.0: layout & scale | Column resize and reorder (TanStack column sizing/ordering + keyboard), pinned/sticky columns and header, virtualized rows via `@tanstack/react-virtual` (same vendor as the table; optional peer, only imported by `DataTable.Virtual`) |
| 5.5 | Filters & views | **FilterBuilder**: AND/OR groups, field/operator/value rows, serialisable JSON query (the app runs it). **SavedViews** menu: controlled UI only, the app stores views. FilterBar gains a "filters applied" count and clear-all. DateRangePicker presets (Today, Last 7d, MTD, custom list) and a timezone label |
| 5.6 | States & safety | EmptyState presets (no data, no results, no access 403, server error 500, offline), AlertDialog `confirmText` type-to-confirm, web **OTPInput** (`autocomplete="one-time-code"`, paste-to-fill), FileUpload per-file progress and abort (controlled: the app owns the upload) |
| 5.7 | React Native parity | RN DataList (mobile pattern for tables: rows with key fields, sort sheet, selection mode, no horizontal grid), MultiSelect as a bottom sheet, FileUpload list UI (picker-agnostic: the app passes files from expo-document-picker or similar), FilterBuilder as a sheet |
| 5.8 | Accessibility proof 3 | DataTable as an ARIA grid when interactive (roving tabindex, cell navigation), axe + Storybook for every new 5.x component, a written screen-reader test script per complex component (VoiceOver, NVDA) so recorded sessions can be done the moment someone has the setup |
| 5.9 | 6.0 release candidate | Feature freeze, deprecations (inline Combobox default, `FilterBar` placeholder-only search), `nexub-migrate` rules, Migrating to 6.0 |
| 6.0 | Enterprise defaults | Combobox popover by default, DataTable selection column on when `enableRowSelection`, removes 5.x deprecations |

## Why this order

- **5.1 first** because it carries the audit bugs and every other item is a prop on an existing component: low risk, visible to users right away.
- **Combobox before DataTable**: MultiSelect and the column-visibility menu both reuse the popover Combobox.
- **DataTable split in two**: selection/density are pure UI; resize/pin/virtualize change layout and need the new dependency, so they get their own release and perf budget.
- **Filters after DataTable**: FilterBuilder and SavedViews sit on top of a table that can show the result.
- **RN after web** so it ports settled APIs instead of chasing them.

## Decisions (2026-11-07)

1. Virtualization: `@tanstack/react-virtual` as an optional peer, imported only by `DataTable.Virtual`.
2. Saved views: UI only; the app stores views.
3. Native tables: DataList pattern, not a horizontally scrolling grid.
4. Release one version at a time, each to npm before the next starts.

## Still blocked (unchanged)

Figma Code Connect, native promotion to stable (Payub pilot), Expo Go QR (EAS project), recorded screen-reader sessions.
