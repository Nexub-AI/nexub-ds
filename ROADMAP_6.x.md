# Roadmap 6.1 → 7.0

Drafted 2026-11-07, after 6.0 reached production. Follows [ROADMAP_5.x.md](ROADMAP_5.x.md): one release per version, rolling-minor (6.9 rolls over to 7.0), development → staging → production → npm, each version on npm before the next starts.

**Direction.** 5.x made Nexub carry dense data: tables, filters, complex inputs. 6.x covers what sits around the table in a real app: forms, time, hierarchy, layout, and reordering. 7.0 is a consolidation release, not a feature drop. Same ground rules: WCAG AA, tokens only, native platform before JavaScript, new behaviour opt-in in a 6.x minor and default only in 7.0.

## Gaps (checked against `development` after #378)

| Gap | Evidence |
|---|---|
| No form wrapper or validation flow | `FormField`, `FormError`, `HelperText` exist; `ErrorSummary` (patterns) isn't wired to submit |
| No time input or calendar view | only `DatePicker` / `DateRangePicker` |
| No tree | no TreeView; DataTable has no sub-rows |
| No resizable layout | no splitter or panel group |
| Stepper is visual only | `StepIndicator` (patterns) has no navigation or step validation |
| No reordering | no sortable list, no Kanban, no DataTable row reorder |
| No notification inbox | `NotificationItem` (patterns) only |
| Chart zoom/brush | backlog since 4.x (charts are server-rendered on purpose) |
| Autocomplete and Combobox overlap | since 5.2 both are popover comboboxes over cmdk with async support |

## Versions

| Version | Theme | Headline |
|---|---|---|
| 6.1 | Forms 2.0 | `Form` built on native constraint validation (`noValidate` + `checkValidity`), with `ErrorSummary` focus-on-submit and `aria-invalid` wiring through `FormField`. zod / react-hook-form recipe in docs only, no new dependency. `Fieldset` / `FormSection`, `InlineEdit` (view → edit → save/cancel, Escape reverts), unsaved-changes guard hook (`beforeunload` + an in-app confirm) |
| 6.2 | Time | `TimePicker` (12/24h from locale, step minutes), `DateTimePicker`, timezone-aware values (ISO string in, ISO string out; reuses the 5.5 timezone label). `Calendar` month and week views for events: display only, the app owns the data |
| 6.3 | Hierarchy | `TreeView`: ARIA tree, type-ahead, lazy children (`onLoadChildren`), tri-state checkbox selection. DataTable expandable and tree rows through TanStack `getSubRows`, which together give a tree table |
| 6.4 | Layout & flow | `ResizablePanels` (splitter with keyboard resize, min/max, collapse; sizes are controlled so the app persists them). Interactive `Stepper` / Wizard with per-step validation on the 6.1 `Form`. Sticky page `ActionBar` (save/cancel for long forms, reuses the BulkActionBar surface) |
| 6.5 | Reorder | `Sortable` list and a `Kanban` pattern that both work by keyboard (pick up / move / drop announced live), plus DataTable row reorder. Dependency: see decision 1 |
| 6.6 | Inbox & charts | `NotificationCenter` popover (unread count, mark-all-read, built on `NotificationItem`). `toCSV()` export helper for DataTable (visible columns, current sort). Chart zoom and brush as an opt-in client island, so the default charts stay server-rendered |
| 6.7 | React Native parity | TimePicker / DateTimePicker as sheets, TreeView as drill-down lists, Stepper, Sortable list (long-press to drag plus accessibility actions), InlineEdit |
| 6.8 | Proof 4 | axe + Storybook for every new 6.x component, a written screen-reader script per complex component (TreeView, Sortable, ResizablePanels, Calendar), an RTL sweep, a React Compiler compatibility check, and a perf budget for tree tables and DataTableVirtual |
| 6.9 | 7.0 release candidate | Feature freeze, deprecations (Autocomplete, StepIndicator), `nexub-migrate` rules, Migrating to 7.0 |
| 7.0 | Consolidate | Autocomplete folded into Combobox (one API for one job), `Stepper` replaces `StepIndicator`, 6.x deprecations removed |

## Why this order

- **Forms first**: Stepper (6.4) and InlineEdit depend on its validation flow.
- **Time and hierarchy next**: self-contained components, low risk, no new dependencies.
- **Reorder late**: the only release with a dependency decision, and Kanban sits on top of the 6.4 layout.
- **RN after web**, as in 5.x: it ports settled APIs instead of chasing them.
- **7.0 consolidates**: fewer overlapping components beats more components.

## Decisions (open)

1. **Drag and drop.** Recommended: `@dnd-kit` as an optional peer, imported only by the `Sortable` subpath (same pattern as `@tanstack/react-virtual` in 5.4). Alternative: native HTML drag and drop plus our own keyboard and touch handling, which native DnD lacks.
2. **7.0 breaking merges.** Fold Autocomplete into Combobox, and replace StepIndicator with Stepper.

## Out of scope

Rich text editor and form builder: both are large, and apps usually bring their own.

## Still blocked (unchanged)

Figma Code Connect, native promotion to stable (Payub pilot), Expo Go QR (EAS project), recorded screen-reader sessions, docs version switcher (needs hosted older docs).
