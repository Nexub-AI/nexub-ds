import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'date-picker',
    title: 'Date Picker',
    description: 'Calendar date picker with text input.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'value', type: 'Date | undefined', required: false, description: 'Controlled selected date value.' },
    { name: 'onChange', type: '(date: Date | undefined) => void', required: false, description: 'Callback invoked when the selected date changes.' },
    { name: 'placeholder', type: 'string', default: "'Pick a date'", required: false, description: 'Placeholder text displayed in the input when no date is selected.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the date picker input and calendar.' },
    { name: 'minDate', type: 'Date', required: false, description: 'Earliest selectable date. Dates before this are greyed out.' },
    { name: 'maxDate', type: 'Date', required: false, description: 'Latest selectable date. Dates after this are greyed out.' },
    { name: 'format', type: 'string', default: "'dd/MM/yyyy'", required: false, description: 'Date format string for the text input display.' },
    { name: 'aria-label', type: 'string', required: false, description: 'Field name for screen readers; the selected value is appended.' },
    { name: 'id', type: 'string', required: false, description: 'Id for the trigger button, e.g. to pair with a <label htmlFor>.' },
    { name: 'error', type: 'string', required: false, description: 'Error message displayed below the input.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<DatePicker placeholder="Select a date…" />`,
    },
    {
      title: 'With value',
      code: `function ControlledDatePicker() {
  const [date, setDate] = React.useState(new Date('2026-01-15'));
  return (
    <DatePicker
      aria-label="Appointment date"
      value={date}
      onChange={setDate}
      placeholder="Select a date…"
    />
  );
}`,
    },
    {
      title: 'With constraints',
      code: `<DatePicker
  aria-label="Schedule for"
  placeholder="Select a future date…"
  minDate={new Date()}
  maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
/>`,
    },
  ],
};

export default entry;
