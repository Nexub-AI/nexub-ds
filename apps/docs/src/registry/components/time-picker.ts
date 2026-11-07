import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'time-picker',
    title: 'Time Picker',
    description: 'A time field on the native time input: 12 or 24 hours from the reader’s locale, and the platform picker on phones.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.2.0',
    related: ['date-time-picker', 'date-picker'],
  },
  props: [
    { name: 'value / defaultValue / onValueChange', type: 'string', required: false, description: '24-hour `"HH:mm"`, whatever the display format.' },
    { name: 'minuteStep', type: 'number', default: '1', required: false, description: 'Minutes per step for the arrow keys and the picker.' },
    { name: 'min / max / required / name', type: 'string | boolean', required: false, description: 'Native attributes; Form validates them.' },
  ],
  examples: [{ title: 'Reminder time' }],
  a11y: {
    keyboard: [
      { key: 'ArrowUp / ArrowDown', description: 'Changes the focused segment (hour, minute, AM/PM).' },
      { key: 'ArrowLeft / ArrowRight', description: 'Moves between segments.' },
    ],
    notes: ['Native `<input type="time">`: screen readers announce each segment, and phones open their own time picker.'],
  },
};

export default entry;
