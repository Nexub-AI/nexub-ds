# @nexub/elements

## 11.6.0

### Minor Changes

- 07007f9: 11.6 Diagrams and web components: two new packages at `alpha`, which close the last two platform gaps, #34 and #36 (ROADMAP_11.x.md). Both RFCs were accepted with changes on 2026-11-22 (#713, #712).

  - **`@nexub/diagram`** (#34, new, RFC #713): `DiagramCanvas` and `DiagramNode` on React Flow (`@xyflow/react` ^12.10, a peer dependency, so only apps that draw diagrams pay for it). Themed on the tokens (light, dark, forced colours, product accents). Keyboard access: arrow keys move focus between nodes, Alt+arrows move the focused node, C opens a "Connect to…" menu that makes an edge without dragging, Delete removes; moves and connections are announced. `layout="left-right" | "mind-map"` with the pure `layoutTree` and `layoutLayers` helpers (no layout dependency), `readOnly`, `minimap`, `controls`, a node `tone` (`good`, `warning`, `danger`) and a "Show as list" text alternative. Import `@nexub/diagram/styles.css`.
  - **`@nexub/elements`** (#36, new, RFC #712): form-associated web components for pages without React. `<nx-number-input>` has the 11.1 NumberInput rules (can be empty, half-typed values kept while focused, `min`/`max` on blur, `step="any"`). `<nx-date-picker>` takes `YYYY-MM-DD`, `YYYY-MM` or `YYYY` with `granularity`, `min`, `max`, a calendar dialog and a bottom sheet below 768px. A plain `<form>` posts their values, `form.reset()` resets them, and `required` and range limits take part in validation. They are themed by the same token variables, so `@nexub/themes` with `data-theme` and `data-product` applies. No framework and no runtime dependencies: load `@nexub/elements/define.js` from a CDN, or import the classes from `@nexub/elements`.
  - **`@nexub/core`**: the number rules (`parseNumberDraft`, `clampNumber`, `formatNumberValue`, `stepNumber`, `numberKeyTarget`) and date-value helpers (`parseDateValue`, `formatDateValue`, `dateRangeStatus`, `firstDayOfWeek` and more), shared by `@nexub/react` and `@nexub/elements` so they can't drift.
  - **`@nexub/react`**: NumberInput and the DatePicker period parsing use the shared core rules. No behaviour change.
  - **Native parity:** none. Native has no diagram editor (mobile shows the list view), and native apps use `@nexub/react-native` fields.
  - **The platform can delete** the Mind mind-map canvas, the Command Hub Studio workflow canvas, and the native `<input type="number">` and `<input type="date">` on the Forms respondent pages.
