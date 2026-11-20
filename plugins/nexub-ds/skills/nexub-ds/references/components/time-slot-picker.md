# Time Slot Picker

Pick one time from a list of slots, for booking flows.

- Package: `@nexub/react` · Category: Form Controls · Status: alpha
- Import: `import { TimeSlotPicker } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/time-slot-picker

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `slots` (required) | `{ value: string; label?: string; disabled?: boolean; hint?: string }[]` |  | The times. `value` is `HH:mm` or an ISO date-time; the label defaults to the time in the provider locale. |
| `value / defaultValue / onValueChange` | `string` |  | The selected slot value. |
| `groupBy` | `'none' \| 'period'` | `'none'` | `period` adds Morning, Afternoon and Evening headings. |
| `columns` | `2 \| 3 \| 4 \| 'auto'` | `'auto'` | Slots per row. `auto` fits as many as the width allows; 3 and 4 drop to fewer where the picker is narrow. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Slot height. `md` and `lg` are at least 44px tall. |
| `invalid / disabled / readOnly / required` | `boolean` |  | Group states. Inside `FormField.Control` they come from the field. |
| `name` | `string` |  | Submits the selected value with a form. |
| `emptyState` | `ReactNode` | `'No times available'` | Shown when `slots` is empty. |

## Example: Default

```tsx
import * as React from 'react';
import { TimeSlotPicker } from '@nexub/react';

const slots = [
  { value: '09:00' },
  { value: '09:30' },
  { value: '10:00', disabled: true },
  { value: '10:30' },
  { value: '11:00', hint: 'Last one' },
  { value: '11:30' },
];

export default function Example() {
  const [time, setTime] = React.useState('09:30');
  return (
    <div className="flex w-96 max-w-full flex-col gap-3">
      <TimeSlotPicker aria-label="Start time" slots={slots} value={time} onValueChange={setTime} />
      <p aria-live="polite" className="text-body-sm text-on-surface-muted">
        Selected: {time}
      </p>
    </div>
  );
}
```

## Example: Grouped by time of day

```tsx
import * as React from 'react';
import { FormField, TimeSlotPicker } from '@nexub/react';

const slots = ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'].map((value) => ({
  value,
  disabled: value === '13:00',
}));

export default function Example() {
  return (
    <FormField.Root name="time" className="w-96 max-w-full">
      <FormField.Control>
        <TimeSlotPicker aria-label="Appointment time" slots={slots} groupBy="period" columns={3} />
      </FormField.Control>
      <FormField.Description>Times are shown in the venue’s time zone.</FormField.Description>
    </FormField.Root>
  );
}
```

## Accessibility

- `Tab`: Moves into the group, to the selected slot.
- `Arrow keys`: Move to and select the next available slot.
- A radio group: give it an `aria-label` or `aria-labelledby` (it defaults to "Choose a time").
- Unavailable slots are struck through and read as "9:30 AM, unavailable".
- A slot is named by its time; `hint` is its description.

Related: [radio-card](radio-card.md), [date-picker](date-picker.md), [segmented-control](segmented-control.md)
