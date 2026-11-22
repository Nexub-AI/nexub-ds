# Roadmap 11.1 → 11.5 — what the apps need

Drafted 2026-11-21. Follows [ROADMAP_10.x.md](ROADMAP_10.x.md). 5 minor releases after 11.0.0. **Approved by the owner on 2026-11-21**, with every decision below. Development starts once 11.0.0 is released. **Goal set by the owner: all 38 gaps are closed by 11.5.**

**Shipped.** 11.1.0 (2026-11-21, on `latest`): gaps #1 (check), #2, #3 (rest), #4, #5, #6 and #27 are closed. 11.2.0 (2026-11-21, on `latest`): gaps #8, #9, #10, #15, #17, #30, #31 and #33 are closed. 11.3.0 (2026-11-21, on `latest`): gaps #11, #16, #23, #25, #26 and #32 are closed. 11.4.0 (2026-11-22, on `latest`): gaps #12, #13, #14, #22 and #24 are closed. 11.5.0 (2026-11-22, on `latest`): gaps #18, #19, #20, #21, #28, #29, #35, #37 and #38 are closed. 36 of 38 gaps are closed; #34 (`@nexub/diagram`, RFC #713) and #36 (`@nexub/elements`, RFC #712) were accepted with changes by the owner on 2026-11-22 and ship in 11.6.

**Source.** *Nexub design-system gaps* (nexub-platform `docs/design-system-gaps.md`, 18 Nov 2026). It lists 38 gaps found while moving the 14 Nexub web apps onto the design system: 7 P1, 12 P2, 13 P3, 6 P4. It was written against **10.0.0**, so every item was checked against current code (`feat/11.0-defaults-and-showcase`) before going into this plan.

**Direction.** 10.x made the library look and behave better. 11.x closes the gaps the apps work around today, so `@nexub/admin-ui` stopgaps and hand-built screens can be deleted. Every version is a minor: additive and opt-in, and no default changes.

- **11.1 — Fields stop fighting the user** (all P1 left open, plus admin-ui quick wins)
- **11.2 — Pickers and prompts** (P2 input gaps, emoji and icon picker)
- **11.3 — Dashboards tell the truth** (P2 charts and tiles, P3 dashboard parts)
- **11.4 — Boards, steps, calendars and diagrams** (P2 workflow components, diagram canvas)
- **11.5 — Conversations, lists, chrome and the last P4s** (the P2/P3 items left, org chart, web components, polish)

## Already shipped since 10.0

| # | Gap | Status |
|---|---|---|
| 1 | Vivid: ticked CheckboxCard / RadioCard unreadable | Fixed in 10.2: `vivid.css` skips `[data-selectable-card]`. **(check)** whether `data-expression="calm"` on a wrapper inside a Vivid area opts back out; the selector does not test for it. Re-checked in 11.1 |
| 7 | `@nexub/brand` CRM tile | Shipped in 10.2 (`app-icon-crm.svg`, `-light.svg`, 192 and 512 PNGs). The platform can drop its broken-image fallback |
| 3 | PhoneInput | Shipped in 10.8: country picker with flag, E.164 value, validity in `onValueChange`. Left: a display formatter (11.1). The doc asks for `{dialCode, number}`; the E.164 string is kept (see Decisions) |
| 14 (part) | EventCalendar day view | Shipped in 10.7 (`day`, `agenda`, `views` prop). Left: drag to reschedule, per-day add, legend (11.4) |
| 13 (part) | Failed steps | `StatusSteps` (patterns, 10.7) has an `error` status. `Stepper` (react) still has none (11.4) |
| 18 (part) | PromptInput attach | `attachments` slot exists. Left: send label, submit mode, error (11.5) |

The platform should remove the stopgaps for #1 and #7 now. That does not need a release.

## The plan

| Version | Theme | Gaps closed | Size |
|---|---|---|---|
| **11.1** | Fields stop fighting the user | 1 (check), 2, 3 (rest), 4, 5, 6, 27 | L |
| **11.2** | Pickers and prompts | 8, 9, 10, 15, 17, 30, 31, 33 | L |
| **11.3** | Dashboards tell the truth | 11, 16, 23, 25, 26, 32 (+ RFC for #36) | L |
| **11.4** | Boards, steps, calendars and diagrams | 12, 13, 14 (rest), 22, 24, 34 | XL |
| **11.5** | Conversations, lists, chrome and the last P4s | 18, 19, 20, 21, 28, 29, 35, 36, 37, 38 | XL |

Every one of the 38 gaps has a version: #7 is closed, and #1 and #3 are closed apart from the 11.1 items above. 11.4 and 11.5 are the largest; the overrun rule below says what moves if they run long.

### 11.1 — Fields stop fighting the user

Every P1 still open. These are the fields used in the most places (several hundred Combobox fields, about 120 number fields).

- **NumberInput (#2).** `value: number | null` with a cleared state (`null`, not `0`). Clamp to `min`/`max` on blur, not on every keystroke. Keep half-typed input (`"2."`, `"-"`) while focused. `step="any"`. Existing controlled callers that pass a number are unchanged.
- **DatePicker month and year (#4).** `granularity="month" | "year"`, value `'YYYY-MM'` / `'YYYY'`. Month grid and year grid on the same popover and sheet. Replaces `<input type="month">` in about 10 places.
- **FileUpload (#5).** `FileUpload.Trigger` (button or icon button, no drop zone), `capture` for the phone camera, controlled `files` / `onFilesChange` so a page can clear or set it, `disabled` and `busy` (with progress), `transform(file)` that runs before the size check (shrink a photo), `size="sm"` compact zone.
- **ComboboxField (#6).** A labelled, searchable single-choice field on the field tokens with inline error and description, built on `FormField` + `Combobox`. Grouped options, `keywords` per option, an optional "none" option, and async search (`onSearch`, `loading`). Port of admin-ui `ComboboxField` / `ComboboxPicker` / `PickField`.
- **SwitchField, CheckboxField, CheckboxGroupField (#27).** Label, description, switch-before-label compact layout, indeterminate, invalid. Port of the admin-ui versions. `Text tone="danger"` (and `success`, `warning` for parity).
- **PhoneInput (#3 rest).** `formatPhone(e164, { style: 'national' | 'international' })` for read-only display, and a `parsePhone()` helper that returns `{ country, dialCode, national }` for apps that store parts.
- **Vivid calm opt-out (#1 check).** If a `calm` wrapper inside Vivid still gets the gradient, scope the rule to the nearest expression.

**Retires in admin-ui:** NumberField nullable path, FileField, ComboboxField, ComboboxPicker, PickField, SwitchField, CheckboxField, CheckboxGroupField.

### 11.2 — Pickers and prompts

- **CurrencySelect (#8).** Searchable ISO 4217 list built from `Intl` (code, name, symbol), on ComboboxField. A `currency` slot on `MoneyInput` that renders it. Port of admin-ui `CurrencyField` and `CURRENCY_OPTIONS`.
- **AlertDialog.Prompt and `usePrompt()` (#9).** Asks for a reason or a name: label, `minLength`, `maxLength`, `validate`, and a busy state while the returned promise runs. Replaces `window.prompt` in about 40 places. Port of admin-ui `askText()`.
- **Async pickers (#10).** Autocomplete: `label`, `clearOnSelect` ("add" mode), `onClear`, option `description` (second line). MultiSelect: async options (`onSearch`, `loading`), per-option `disabled`, avatar slot for people as chips. Retires admin-ui `SearchField`.
- **Date pickers (#17).** DateTimePicker `clearable`. DateRangePicker `endExclusive` and `onComplete` (fires once both ends are set).
- **ColorPicker (#15).** Swatches, hex input, and a contrast hint against a given background. Popover, sheet on phones.
- **Modal search list (#30).** A `CommandList`-style searchable list for sheets and dialogs, arrow keys and Enter, built from the CommandPalette internals.
- **OTPInput (#31).** `mode="backup"` (12 characters, alphanumeric), `autoFocus`. `name` exists; check it posts with uncontrolled forms.
- **EmojiPicker and IconPicker (#33).** Search, categories, recent picks, skin tone for emoji; IconPicker over `@nexub/icons`. Popover, sheet on phones. Emoji data is lazy-loaded so it stays out of the main bundle (size budget). Replaces the free-text emoji field in Mind spaces and docs.

### 11.3 — Dashboards tell the truth

- **Charts (#11).** `null` drawn as a gap, not 0. Semantic tones (`good`, `warning`, `danger`) beside the categorical palette. `orientation="horizontal"` on BarChart, per-datum colour, integer-only ticks, a waterfall variant. Multi-currency axis: one formatter per series. Keep the 10.3 rule: product accent stays out of charts.
- **Chart / table switch (#25).** `tableView` on every chart: a visible "Show as table" toggle that renders the same data as a `Table`. Also the accessible fallback.
- **UsageTile and StatCard options (#16).** `UsageTile` (used of limit, bar that warns near and at the limit). StatCard: `size` / compact, a `note` slot inside the tile, `tone="bad-when-high"` (inverts the change colour), absolute change, custom change label. Retires admin-ui `UsageMetric` and `Metric`.
- **UsageBar (#26).** Compact used-of-limit bar for table cells and fact grids, label inline, `size="sm"`.
- **StageCounter (#23).** A row of selectable stat cards, each with a count and a failed count, that filters a list (`aria-pressed`).
- **Small chart and list options (#32).** DonutChart "Other" grouping and legend values (rebase or fold in open PR #673). Funnel: several series, conversion as well as drop-off. Heatmap: missing cell and legend. Gauge: tone and caption. FilterBar: search optional. CheckList: done / pending state.
- **RFC for `@nexub/elements` (#36).** Open the RFC issue for the web-component package that ships in 11.5 (new package, new build target, new size budget), so its 3 working days run in parallel with 11.4.

### 11.4 — Boards, steps, calendars and diagrams

- **Kanban (#12).** `readOnly` (no drag handles), `canMove(card, from, to)` to refuse a drop before it lands, drop targets outside columns (an archive or trash area), `renderColumnHeader` (value, WIP badge, actions), an in-column quick-add slot, swimlanes, card `tone`, column width option.
- **Stepper (#13).** Per-step `status`: `error`, `warning`, `skipped`, `cancelled`. `description` takes a ReactNode, plus an actions slot. Deprecate `current={-1}` meaning "all done" in favour of `status`. Align names with `StatusSteps`.
- **EventCalendar (#14 rest).** `onEventMove` (drag to another day or time, keyboard alternative), `renderDayAction` (per-day add), per-event actions, a legend. `views` already hides the switch.
- **Sortable (#22).** `layout="grid"`, `disabled` and per-item `locked`, `variant="flat"`, index keys when items have no id, groups.
- **ResourceTimeline (#24).** One row per person, days across, editable cells, footer totals. Built as an EventCalendar `resource` view if the data model fits, otherwise its own component. People rosters and PayHub team leave are the reference screens.
- **DiagramCanvas (#34).** New entry `@nexub/diagram` wrapping React Flow as an **optional peer** (not a dependency of `@nexub/react`): themed nodes, edges, handles, minimap and controls on DS tokens, keyboard access (move focus between nodes, move a node with arrow keys, connect from a menu), and a layout helper for mind maps and left-to-right workflows. Needs a `dependency-policy.json` entry and its own size budget. Reference screens: Mind mind map, Command Hub Studio workflow.

### 11.5 — Conversations, lists, chrome and the last P4s

- **PromptInput and chat parts (#18).** `sendLabel` (visible label), `submitOn="enter" | "mod-enter"`, `error` and `hint`. MessageBubble `role="other"` with name and meta header. MessageActions takes custom actions. Conversation sizes itself without a fixed-height parent.
- **SavedViews (#19).** `onSave` / `onDelete` may return a promise (busy and error state), `confirmDelete`, `defaultView`, rename, `maxLength`.
- **TreeView (#20).** `renderActions`, `trailing` meta, link nodes (`href`, Cmd-click), `onActivate` separate from select, `scrollToNode(id)`.
- **ActivityFeed (#21).** `timestamp` as a Date or ReactNode, rendered in `<time dateTime>` with a full-date tooltip. Actions slot, `tone`, `ActivityFeed.Group` headers. Title and description stop forcing `<p>`.
- **NavigationRail (#28).** `orientation="bottom"` phone tab bar, `badge` on items.
- **InlineEdit (#29).** `size` up to headline, `as` (heading, `Sheet.Title`), `maxLength`.
- **Layout polish (#37).** ReactNode `description` on AuthCard and `title` on Alert, logo alignment on AuthCard, plain Breadcrumb section item, badge row on PageHeader eyebrow, Dialog scrolling max height, styled Collapsible trigger, DashboardPage not money-only.
- **Tokens (#38).** Spacing keys for the measured values (22rem, 26rem), perspective utilities, brand glow, widths above 100%. Only the values the platform actually uses.
- **OrgChart (#35).** Built on the TreeView data shape from the same version: cards with photo, name and role, expand and collapse, keyboard navigation as a tree. Falls back to TreeView on narrow screens, which is what People does on phones today. Reference screens: People org chart, Command Hub Studio.
- **`@nexub/elements` (#36).** Web components `<nx-date-picker>` and `<nx-number-input>` for server-rendered pages, built from the same core logic as the React versions (11.1's NumberInput rules: can be empty, limits on blur). Form-associated (`ElementInternals`) so they post with a plain `<form>`, themed by the same tokens. Ships after the RFC opened in 11.3 is accepted. Reference screen: Forms respondent pages.

## Rules for every version

- Additive and opt-in. No breaking change and no default change (11.x minors). The one deprecation planned is `Stepper current={-1}` in 11.4.
- All 10.0 / 11.0 gates stay blocking. Baselines in light, dark, RTL and forced colours. Docs page with a playground and the new states on the same PR.
- Native: if the component has a native twin, the new prop is ported in the same version or listed as a parity gap in the release notes.
- Each version starts by re-checking its gaps on current `development` and against the platform branch, since the platform may have moved.
- Each release note lists the admin-ui stopgaps and hand-built screens the platform can now delete.
- Pace and release routine as in 10.x: ship when ready, one at a time, PUBLISHING.md for each.
- **Overrun rule.** A version always ships its P1 and P2 items. A P3 or P4 item that is not ready moves to the next version instead of holding the release. 11.5 is the hard stop: nothing moves past it.

## How each version is judged

| Measure | Today | After 11.5 |
|---|---|---|
| Gaps in the doc still open | 35 (3 closed in 10.x) | 0 |
| P1 / P2 / P3 / P4 gaps open | 4 / 12 / 13 / 6 | 0 / 0 / 0 / 0 |
| admin-ui stopgaps that duplicate a DS part | about 13 | 0 |
| Custom canvases and hand-built screens named in the doc | Command Hub calendar, Leap day list, roster grid, Go phone bar, 2 diagram canvases, org chart SVG | 0 |

## Why this order

- **P1 first, and fields before everything.** Fields appear on every page of every app, and ComboboxField is required by the platform's own CLAUDE.md rule.
- **11.1 before 11.2.** CurrencySelect, async pickers and the modal list are built on ComboboxField.
- **Charts before boards.** Every app has a dashboard; boards and calendars are a few apps each.
- **Chrome and tokens last.** Each is small and the pages already work around it.

## Decisions

Answered by the owner on 2026-11-21:

1. **Scope.** All 38 gaps close within 11.1–11.5. Nothing is left for later.
2. **PhoneInput value (#3).** Keep the E.164 string from 10.8 as the one stored form; add `parsePhone()` and `formatPhone()`. No `{dialCode, number}` value.
3. **Diagram canvas (#34).** Wrap React Flow as an optional peer in `@nexub/diagram` (11.4). Not a canvas of our own.
4. **Non-React controls (#36).** Web components in a new `@nexub/elements` package: RFC in 11.3, ships in 11.5.
5. **P4 placement.** EmojiPicker / IconPicker (#33) in 11.2; OrgChart (#35) on TreeView data in 11.5.
6. **Charts (#11).** All of it in 11.3, waterfall and multi-currency axis included.
7. **Overrun.** P1/P2 ship on time; unfinished P3/P4 items move to the next version; 11.5 is the hard stop.
8. **Order.** P1-first, as listed.
9. **Stepper `current={-1}`.** Deprecated in 11.4 with a `nexub-migrate` rule; removed in 12.0.

The plan as a whole was approved on 2026-11-21. 11.1 starts after 11.0.0 is released.
