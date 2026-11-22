import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'date-picker-element',
    title: 'Date Picker Element',
    description: '`<nx-date-picker>`: a typed date field and a calendar as a form-associated web component, for server-rendered pages without React. The value is `YYYY-MM-DD`.',
    category: 'Web Components',
    package: '@nexub/elements',
    element: 'nx-date-picker',
    status: 'alpha',
    addedIn: '11.6.0',
    related: ['date-picker', 'number-input-element', 'form'],
    webOnly: 'It is a web component for HTML pages; native apps use DatePicker’s twin in `@nexub/react-native`, `DateTimeField` (the platform picker).',
  },
  usage: {
    whenToUse: [
      'A date, month or year on a page with no React: server-rendered HTML, a plain `<form method="post">`.',
      'Where `<input type="date">` would do, but the calendar must match Nexub in every browser and the value must never shift across time zones.',
    ],
    whenNotToUse: [
      'In a React app: use DatePicker from `@nexub/react`.',
      'A range (from and to): use DateRangePicker in React, or two fields.',
      'A date and a time: use DateTimePicker in React.',
    ],
  },
  props: [
    { name: 'name', type: 'string', description: 'The form field name: a `<form>` posts the value under it.' },
    { name: 'value', type: 'string', description: 'The starting value: `YYYY-MM-DD`, `YYYY-MM` or `YYYY` by `granularity`; what `form.reset()` goes back to. The `value` property is the current value. In React, server rendering writes `value` as this attribute; in a client-only render pass `defaultValue`.' },
    { name: 'granularity', type: "'day' | 'month' | 'year'", description: '`day` (default), `month` or `year`: the calendar shows days, months or years, and the value has that precision.' },
    { name: 'min', type: 'string', description: 'Earliest value, same format. Earlier cells are disabled; a typed earlier date is invalid (`rangeUnderflow`).' },
    { name: 'max', type: 'string', description: 'Latest value (`rangeOverflow`).' },
    { name: 'required', type: 'boolean', description: 'Empty is invalid (`valueMissing`).' },
    { name: 'disabled', type: 'boolean', description: 'Not editable, not posted; the calendar button is disabled.' },
    { name: 'readonly', type: 'boolean', description: 'Posted but not editable; the calendar doesn’t open.' },
    { name: 'locale', type: 'string', description: 'BCP 47 locale for month and weekday names, the week start and the typed format. Defaults to the nearest `lang`.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", description: '`sm`, `md` (default) or `lg`: the control heights of `@nexub/react`.' },
    { name: 'aria-label', type: 'string', description: 'Names the field when it has no `<label for>`.' },
    { name: 'change event', type: 'Event', description: 'When the value changes: a day picked, or a typed date committed on blur or Enter.' },
    { name: 'show() / close()', type: '() => void', description: 'Open the calendar (focused on the selected date, or today) and close it; `open` is true while it is.' },
  ],
  examples: [
    { title: 'Default', description: 'Type a date or open the calendar. Rendered here in React 19; on a server-rendered page it is the same tag.' },
    { title: 'Months, in a form', description: '`granularity="month"` posts `YYYY-MM`; `required` and `min` block the submit until the value is valid.' },
  ],
  a11y: {
    roles: [
      'textbox (the typed field) and a button with `aria-haspopup="dialog"` and `aria-expanded`',
      'dialog (modal), named "Pick a date", "Pick a month" or "Pick a year"',
      'grid with gridcell buttons for days (`aria-selected`, `aria-current="date"` on today); a group of toggle buttons (`aria-pressed`) for months and years',
    ],
    keyboard: [
      { key: 'Enter (in the field)', description: 'Commits the typed date and submits the form.' },
      { key: 'Arrow keys', description: 'Move a day (a week up or down); in the month and year grids, one cell (three up or down). Mirrored in RTL.' },
      { key: 'PageUp / PageDown', description: 'Previous or next month; with Shift, year. In the month and year grids, the previous or next page.' },
      { key: 'Home / End', description: 'Start or end of the week (the row).' },
      { key: 'Enter / Space', description: 'Picks the focused cell and closes the calendar.' },
      { key: 'Escape', description: 'Closes the calendar without picking.' },
    ],
    focus: [
      'Opening moves focus to the selected date (or today, kept inside `min` and `max`); the grid is one tab stop.',
      'Closing, by picking, Escape or a click outside, returns focus to the field.',
      'Below 48rem the calendar is a bottom sheet.',
    ],
    screenReader: [
      'The field is named from the host’s `<label for>` (or a wrapping `<label>`, or `aria-label`), copied into the shadow root.',
      'The month or year heading is a polite live region, so paging is announced.',
      '`aria-required` and `aria-invalid` follow the field; a typed date that can’t be read stays as typed and is invalid, with a message that shows the expected format.',
    ],
    notes: [
      'The value is a plain string, never a `Date`, so it never moves a day across time zones.',
      'Shadow DOM: page CSS can’t break the inside. Style it with the theme variables, or `::part(field)`, `::part(input)`, `::part(button)` and `::part(calendar)`.',
      'Motion only under `prefers-reduced-motion: no-preference`; forced colours redraw it with system colours.',
    ],
  },
};

export default entry;
