import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'time-slot-picker',
    title: 'Time Slot Picker',
    description: 'Pick one time from a list of slots, for booking flows.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '10.8.0',
    related: ['radio-card', 'date-picker', 'segmented-control'],
  },
  props: [
    { name: 'slots', type: '{ value: string; label?: string; disabled?: boolean; hint?: string }[]', required: true, description: 'The times. `value` is `HH:mm` or an ISO date-time; the label defaults to the time in the provider locale.' },
    { name: 'value / defaultValue / onValueChange', type: 'string', description: 'The selected slot value.' },
    { name: 'groupBy', type: "'none' | 'period'", default: "'none'", description: '`period` adds Morning, Afternoon and Evening headings.' },
    { name: 'columns', type: "2 | 3 | 4 | 'auto'", default: "'auto'", description: 'Slots per row. `auto` fits as many as the width allows; 3 and 4 drop to fewer where the picker is narrow.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Slot height. `md` and `lg` are at least 44px tall.' },
    { name: 'invalid / disabled / readOnly / required', type: 'boolean', description: 'Group states. Inside `FormField.Control` they come from the field.' },
    { name: 'name', type: 'string', description: 'Submits the selected value with a form.' },
    { name: 'emptyState', type: 'ReactNode', default: "'No times available'", description: 'Shown when `slots` is empty.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Grouped by time of day' }],
  a11y: {
    keyboard: [
      { key: 'Tab', description: 'Moves into the group, to the selected slot.' },
      { key: 'Arrow keys', description: 'Move to and select the next available slot.' },
    ],
    notes: [
      'A radio group: give it an `aria-label` or `aria-labelledby` (it defaults to "Choose a time").',
      'Unavailable slots are struck through and read as "9:30 AM, unavailable".',
      'A slot is named by its time; `hint` is its description.',
    ],
  },
};

export default entry;
