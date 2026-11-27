# @nexub/elements

## 12.1.0

## 12.0.0

## 11.9.0

### Minor Changes

- ed69a75: 11.9 Alpha → beta prep, and RFC 12.0 (ROADMAP_12.x.md).

  - **`@nexub/elements`, new:** `<nx-select>`, `<nx-combobox>` (async `onsearch`, stale answers dropped, `allow-custom`) and `<nx-phone-input>` (E.164 form value, the same phone rules as React). All form-associated, with `invalid` on every field. One element at a time: `@nexub/elements/define/<name>`.
  - **Screen-reader pass, automated half** (`A11Y_REVIEW.md` in each package; the human VoiceOver / NVDA pass follows before beta):
    - **Diagram:** connections are named by their node titles and share one Tab stop. Node order follows the layout. A focused connection can be deleted. Repeated announcements are read again, and a delete names what went.
    - **`<nx-date-picker>`:** no sideways scroll at 320px. Focus goes back to the field at once. The month is announced only when it changes, and the calendar button carries the field's name.
  - **`@nexub/react`:** opt-in `@nexub/react/styles.nexub-layer.css`, every style in one `nexub` layer, as RFC 12.0 proposes for `styles.css`. Load it first, or declare `@layer nexub;`, and app CSS always wins. Fix: the deprecated `Stepper current={-1}` marks the last step complete too.
  - **`@nexub/core`:** `choiceFieldMessages`, `invalidPhone`, `phoneCountryOf(locale)` (React PhoneInput uses it), and the diagram edge messages.
  - **`@nexub/tokens`:** `nexub-migrate --rules changes-in-12` (opt-in until 12.0).
  - **`@nexub/patterns`:** the README no longer points Tailwind 3 apps at the preset removed in 4.0.
  - **RFC 12.0** (`RFC_12.0.md`) is open for comment. Nothing breaking ships until it is accepted.

## 11.8.0

## 11.7.0

### Patch Changes

- 10ed9e3: 11.7 Quiet release: nothing flaky (ROADMAP_12.x.md). No new components; the follow-ups 11.6 left open, and the release rules for 12.x.

  - **`@nexub/react`**: DatePicker `granularity="month"` cells show the full month name ("March", not "Mar"), so each cell's accessible name ("March 2026") starts with its visible text (WCAG 2.5.3 Label in Name). French short months ("janv.") were not a part of the long name at all. Same as `<nx-date-picker>`.
  - **`@nexub/core`**: `dateFieldMessages`, the date field strings on their own. `NexubMessages` gains optional `diagram…` keys (`diagramShowAsList`, `diagramConnectTo`, … `diagramMinimap`) for `@nexub/diagram`.
  - **`@nexub/diagram`**: `DiagramCanvas` reads its strings from `NexubProvider` `messages`, so a translated provider covers the canvas with the rest of the app. Its `labels` prop still wins; the English defaults stay in `@nexub/diagram`.
  - **`@nexub/elements`**: the date picker strings come from `@nexub/core` (`dateFieldMessages`), the same source as React's, instead of a copy. No visible change.
  - **`@nexub/patterns`**: each page template ships only its own default strings, not every template's: template entries are 1.5–2.1 kB gzip smaller. `defaultPageTemplateMessages` and `usePageMessages` are unchanged.
  - **Native parity:** none needed. The changed strings and templates are web only.
  - **Release rules (repo, not packages):** a test that passes only on retry, or a run that passes only after a rerun, opens a `flake` issue; an open one blocks the production release, and so does a staging head under 48 hours old. Lighthouse also runs on mobile emulation (warn only until 12.1).

## 11.6.0

### Minor Changes

- 07007f9: 11.6 Diagrams and web components: two new packages at `alpha`, which close the last two platform gaps, #34 and #36 (ROADMAP_11.x.md). Both RFCs were accepted with changes on 2026-11-22 (#713, #712).

  - **`@nexub/diagram`** (#34, new, RFC #713): `DiagramCanvas` and `DiagramNode` on React Flow (`@xyflow/react` ^12.10, a peer dependency, so only apps that draw diagrams pay for it). Themed on the tokens (light, dark, forced colours, product accents). Keyboard access: arrow keys move focus between nodes, Alt+arrows move the focused node, C opens a "Connect to…" menu that makes an edge without dragging, Delete removes; moves and connections are announced. `layout="left-right" | "mind-map"` with the pure `layoutTree` and `layoutLayers` helpers (no layout dependency), `readOnly`, `minimap`, `controls`, a node `tone` (`good`, `warning`, `danger`) and a "Show as list" text alternative. Import `@nexub/diagram/styles.css`.
  - **`@nexub/elements`** (#36, new, RFC #712): form-associated web components for pages without React. `<nx-number-input>` has the 11.1 NumberInput rules (can be empty, half-typed values kept while focused, `min`/`max` on blur, `step="any"`). `<nx-date-picker>` takes `YYYY-MM-DD`, `YYYY-MM` or `YYYY` with `granularity`, `min`, `max`, a calendar dialog and a bottom sheet below 768px. A plain `<form>` posts their values, `form.reset()` resets them, and `required` and range limits take part in validation. They are themed by the same token variables, so `@nexub/themes` with `data-theme` and `data-product` applies. No framework and no runtime dependencies: load `@nexub/elements/define.js` from a CDN, or import the classes from `@nexub/elements`.
  - **`@nexub/core`**: the number rules (`parseNumberDraft`, `clampNumber`, `formatNumberValue`, `stepNumber`, `numberKeyTarget`) and date-value helpers (`parseDateValue`, `formatDateValue`, `dateRangeStatus`, `firstDayOfWeek` and more), shared by `@nexub/react` and `@nexub/elements` so they can't drift.
  - **`@nexub/react`**: NumberInput and the DatePicker period parsing use the shared core rules. No behaviour change.
  - **Native parity:** none. Native has no diagram editor (mobile shows the list view), and native apps use `@nexub/react-native` fields.
  - **The platform can delete** the Mind mind-map canvas, the Command Hub Studio workflow canvas, and the native `<input type="number">` and `<input type="date">` on the Forms respondent pages.
