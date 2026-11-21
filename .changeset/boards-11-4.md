---
'@nexub/react': minor
'@nexub/core': minor
'@nexub/tokens': minor
---

11.4 Boards, steps and calendars. Closes the platform gaps #12, #13, #14, #22 and #24 (ROADMAP_11.x.md). Additive and opt-in; no default changes. The diagram canvas (#34, `@nexub/diagram`) waits for its RFC (#713).

- **Kanban** (#12): `readOnly` (no drag handles), `canMove({ item, from, to })` refuses a drop before it lands (a WIP limit), `dropTargets` outside the columns (Archive, Trash; the keyboard reaches them after the last column), `renderColumnHeader` and `renderColumnFooter` (a WIP badge, quick add), swimlanes (`lanes` + `getLane`), card `getTone`, `columnWidth`. `onChange` gets a second argument naming the moved card and where it went.
- **Stepper** (#13): per-step `status`: `complete`, `current`, `upcoming`, `error`, `warning`, `skipped`, `cancelled` (named as in StatusSteps, read after the label); `description` takes any content; `actions` under a step. **Deprecated:** `current={-1}` meaning "every step done", removed in 12.0. `npx nexub-migrate --rules deprecated-in-11` reports it (a new rule, on by default).
- **EventCalendar** (#14): `onEventMove` to drag an event to another day or time, with a keyboard alternative (Alt+Arrow, then arrows, Enter) and announcements; `editable: false` per event; `renderDayAction` (per-day add); `eventActions`; `legend`.
- **Sortable** (#22): `layout="grid"` (2D keyboard moves), `disabled` and per-item `isLocked`, `variant="flat"`, items without an `id` (stable keys), and `Sortable.Group` / `SortableGroup` for moves between lists. The shared reorder hook gains `canMove`.
- **ResourceTimeline** (#24, new): one row per person and days across, cells from `getCell` with tones, `onCellActivate` for the app's own editor (a grid with arrow-key navigation), footer and row totals, weekends shaded, today marked. Reference screens: People rosters, PayHub team leave.
- **Native parity:** the native Stepper, Kanban, calendar and lists have none of these props yet; no native twin of ResourceTimeline.
- **The platform can delete** these stopgaps and hand-built screens: the Command Hub calendar's drag layer, the Leap day list actions, the roster grid, admin-ui's sortable grid and its read-only board, and the `current={-1}` workarounds.
