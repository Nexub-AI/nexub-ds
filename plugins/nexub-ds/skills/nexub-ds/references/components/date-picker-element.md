# Date Picker Element

`<nx-date-picker>`: a typed date field and a calendar as a form-associated web component, for server-rendered pages without React. The value is `YYYY-MM-DD`.

- Package: `@nexub/elements` · Category: Web Components · Status: alpha
- Load: `<script type="module" src="https://cdn.jsdelivr.net/npm/@nexub/elements/dist/define.js"></script>`
- Install: `npm install @nexub/elements`. No build step: the script tag above registers `<nx-date-picker>`. With a bundler, `import '@nexub/elements/define';` once does the same.
- Web only: It is a web component for HTML pages; native apps use DatePicker’s twin in `@nexub/react-native`, `DateTimeField` (the platform picker).
- Docs: https://nexub-ds-docs.pages.dev/components/date-picker-element

## When to use

- A date, month or year on a page with no React: server-rendered HTML, a plain `<form method="post">`.
- Where `<input type="date">` would do, but the calendar must match Nexub in every browser and the value must never shift across time zones.

## When not to use

- In a React app: use DatePicker from `@nexub/react`.
- A range (from and to): use DateRangePicker in React, or two fields.
- A date and a time: use DateTimePicker in React.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` |  | The form field name: a `<form>` posts the value under it. |
| `value` | `string` |  | The starting value: `YYYY-MM-DD`, `YYYY-MM` or `YYYY` by `granularity`; what `form.reset()` goes back to. The `value` property is the current value. In React, server rendering writes `value` as this attribute; in a client-only render pass `defaultValue`. |
| `granularity` | `'day' \| 'month' \| 'year'` |  | `day` (default), `month` or `year`: the calendar shows days, months or years, and the value has that precision. |
| `min` | `string` |  | Earliest value, same format. Earlier cells are disabled; a typed earlier date is invalid (`rangeUnderflow`). |
| `max` | `string` |  | Latest value (`rangeOverflow`). |
| `required` | `boolean` |  | Empty is invalid (`valueMissing`). |
| `disabled` | `boolean` |  | Not editable, not posted; the calendar button is disabled. |
| `readonly` | `boolean` |  | Posted but not editable; the calendar doesn’t open. |
| `locale` | `string` |  | BCP 47 locale for month and weekday names, the week start and the typed format. Defaults to the nearest `lang`. |
| `size` | `'sm' \| 'md' \| 'lg'` |  | `sm`, `md` (default) or `lg`: the control heights of `@nexub/react`. |
| `aria-label` | `string` |  | Names the field when it has no `<label for>`. |
| `change event` | `Event` |  | When the value changes: a day picked, or a typed date committed on blur or Enter. |
| `show() / close()` | `() => void` |  | Open the calendar (focused on the selected date, or today) and close it; `open` is true while it is. |

## Example: Default

Type a date or open the calendar. Rendered here in React 19; on a server-rendered page it is the same tag.

```tsx
'use client';

import * as React from 'react';
// Registers <nx-number-input> and <nx-date-picker>. On a page without a bundler, use
// <script type="module" src="…/@nexub/elements/dist/define.js"></script> instead.
import '@nexub/elements/define';

export default function Example() {
  const ref = React.useRef<HTMLElementTagNameMap['nx-date-picker']>(null);
  const [value, setValue] = React.useState('2026-03-14');
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onChange = () => setValue(el.value);
    el.addEventListener('change', onChange);
    return () => el.removeEventListener('change', onChange);
  }, []);

  return (
    <div lang="en-US" className="flex w-full max-w-xs flex-col gap-2">
      <label htmlFor="start" className="text-label-lg text-on-surface">
        Start date
      </label>
      <nx-date-picker ref={ref} id="start" name="start" min="2026-01-01" max="2026-12-31" value="2026-03-14" />
      <p className="text-body-sm text-on-surface-muted">Value: {value || 'empty'}</p>
    </div>
  );
}
```

## Example: Months, in a form

`granularity="month"` posts `YYYY-MM`; `required` and `min` block the submit until the value is valid.

```tsx
'use client';

import * as React from 'react';
import { Button } from '@nexub/react';
import '@nexub/elements/define';

export default function Example() {
  const [posted, setPosted] = React.useState<string | null>(null);

  return (
    <form
      lang="en-US"
      className="flex w-full max-w-xs flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setPosted(JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))));
      }}
      onReset={() => setPosted(null)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="billing-month" className="text-label-lg text-on-surface">
          First billing month
        </label>
        <nx-date-picker id="billing-month" name="month" granularity="month" min="2026-04" required />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="reset" variant="outlined">
          Reset
        </Button>
      </div>
      <p className="text-body-sm text-on-surface-muted">Posted: {posted ?? 'nothing yet'}</p>
    </form>
  );
}
```

## Accessibility

- Roles: textbox (the typed field) and a button with `aria-haspopup="dialog"` and `aria-expanded`, dialog (modal), named "Pick a date", "Pick a month" or "Pick a year", grid with gridcell buttons for days (`aria-selected`, `aria-current="date"` on today); a group of toggle buttons (`aria-pressed`) for months and years
- `Enter (in the field)`: Commits the typed date and submits the form.
- `Arrow keys`: Move a day (a week up or down); in the month and year grids, one cell (three up or down). Mirrored in RTL.
- `PageUp / PageDown`: Previous or next month; with Shift, year. In the month and year grids, the previous or next page.
- `Home / End`: Start or end of the week (the row).
- `Enter / Space`: Picks the focused cell and closes the calendar.
- `Escape`: Closes the calendar without picking.
- Opening moves focus to the selected date (or today, kept inside `min` and `max`); the grid is one tab stop.
- Closing, by picking, Escape or a click outside, returns focus to the field.
- Below 48rem the calendar is a bottom sheet.
- The field is named from the host’s `<label for>` (or a wrapping `<label>`, or `aria-label`), copied into the shadow root.
- The month or year heading is a polite live region, so paging is announced.
- `aria-required` and `aria-invalid` follow the field; a typed date that can’t be read stays as typed and is invalid, with a message that shows the expected format.
- The value is a plain string, never a `Date`, so it never moves a day across time zones.
- Shadow DOM: page CSS can’t break the inside. Style it with the theme variables, or `::part(field)`, `::part(input)`, `::part(button)` and `::part(calendar)`.
- Motion only under `prefers-reduced-motion: no-preference`; forced colours redraw it with system colours.

Related: [date-picker](date-picker.md), [number-input-element](number-input-element.md), [form](form.md)
