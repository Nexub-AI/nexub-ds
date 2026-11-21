# RFC: @nexub/elements — web components for server-rendered pages

<!-- The text of the RFC issue (GOVERNANCE.md → RFC process). Open a GitHub issue with this title and the body below. -->

Open for comments for at least **3 working days** from the day this issue is opened. A maintainer then records the decision here (accepted, accepted with changes, or declined) and closes the issue. Planned in `ROADMAP_11.x.md` (gap #36): RFC opened in 11.3, package ships in 11.5 if accepted.

## Decision

Pending. RFC issue #712, opened 2026-11-21.

## Problem

Some Nexub screens are not React. The Forms respondent pages are server-rendered HTML with a plain `<form>`, so they can't use `@nexub/react`. Today they use `<input type="date">` and `<input type="number">`, which look different in every browser, ignore the design tokens, can't be empty in a controlled way, and clamp or reject input differently from the React fields. The platform's design-system gaps doc lists this as gap #36 (P4).

## Proposal

A new package, **`@nexub/elements`** (`packages/elements`), with two custom elements built from the same logic as the React fields:

- `<nx-number-input>`: the 11.1 NumberInput rules (can be empty, half-typed `2.` and `-` kept while focused, `min`/`max` applied on blur, `step`, `step="any"`).
- `<nx-date-picker>`: a field and a calendar popover (a bottom sheet below 768px), value `YYYY-MM-DD`, `min`, `max`, and `granularity="month" | "year"` as in 11.1.

Both are **form-associated** (`static formAssociated = true` and `ElementInternals`), so a plain `<form>` posts their value, `form.reset()` resets them, `required` and `setValidity` take part in constraint validation, and `<label for>` works. They are themed by the same CSS custom properties as `@nexub/react` (`--color-*`, `--shape-*`, `--size-control-*`), so `@nexub/themes` and `data-theme` / `data-product` apply unchanged.

The shared logic (number parsing and clamping, calendar grid, date formatting) moves to `@nexub/core`, which `@nexub/react` already depends on, so the two implementations can't drift.

## API

```html
<link rel="stylesheet" href="https://cdn.example/@nexub/themes/base.css" />
<script type="module" src="https://cdn.example/@nexub/elements/define.js"></script>

<form method="post">
  <label for="age">Age</label>
  <nx-number-input id="age" name="age" min="18" max="120" step="1"></nx-number-input>

  <label for="start">Start date</label>
  <nx-date-picker id="start" name="start" min="2026-01-01" required></nx-date-picker>

  <button>Send</button>
</form>
```

| Element | Attributes / properties | Events |
| --- | --- | --- |
| `nx-number-input` | `name`, `value` (string, empty for none), `min`, `max`, `step` (number or `any`), `required`, `disabled`, `readonly`, `placeholder`, `size` (`sm` / `md` / `lg`) | `input`, `change` (value as a string, empty when cleared) |
| `nx-date-picker` | `name`, `value` (`YYYY-MM-DD`, `YYYY-MM` or `YYYY`), `min`, `max`, `granularity` (`day` / `month` / `year`), `required`, `disabled`, `readonly`, `locale`, `size` | `change` |

`@nexub/elements/define` registers both tags; `@nexub/elements` exports the classes for apps that register their own names. No framework and no runtime dependencies. Shadow DOM with constructable stylesheets built from the token variables, so page CSS can't break the inside, and `::part()` for the few hooks apps may need.

## Accessibility

- `nx-number-input`: an inner `<input>` with `role="spinbutton"`, `aria-valuenow`/`min`/`max`; Arrow Up/Down, Page Up/Down, Home/End as the React field. The host's label reaches it through `ElementInternals` (`ariaLabel` from the associated `<label>`).
- `nx-date-picker`: a button that opens a dialog with a grid; the same keyboard map as `DatePicker` (arrows, Page Up/Down for months, Home/End, Enter, Escape); focus returns to the field. Invalid and required states are announced through the inner input's `aria-invalid` / `aria-required` and the form's validation message.
- Touch targets 24px minimum, focus rings from the tokens, reduced motion respected, forced-colours checked.
- Tested with axe in Playwright (Chromium, Firefox, WebKit) on a plain HTML page, and a screen-reader pass (VoiceOver, NVDA) before `beta`.

## Web + native parity

Web only. Native apps use `@nexub/react-native`, which has its own fields. The elements match the React components' names and attributes (`min`, `max`, `step`, `granularity`, `size`).

## Alternatives

- **Do nothing**: the respondent pages keep native inputs. Rejected by the gap list: they look and behave unlike the rest of Forms.
- **React islands** (hydrate `@nexub/react` fields on the page): pulls React into a page that has none (about 45 kB gzip more), and the pages are rendered by a non-JS backend.
- **Style the native inputs only**: no consistent empty state, no clamp-on-blur, and the date popup can't be themed.
- **Lit or another web-component library**: a dependency for two elements; the elements are small enough without one.

## Migration

None: a new package at `alpha`. New size budget entries (`elements`, `elements/define`) and a `dependency-policy.json` entry (no runtime dependencies). Ships in 11.5 if accepted; if the decision is later than 11.5's build, #36 is the one item that waits for it.
