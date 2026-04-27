import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'date-range-picker',
    title: 'Date Range Picker',
    description: 'Dual-calendar date range selector.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'value', type: '{ from: Date | undefined; to: Date | undefined }', required: false, description: 'Controlled date range value.' },
    { name: 'onChange', type: '(range: { from: Date | undefined; to: Date | undefined }) => void', required: false, description: 'Callback invoked when the selected range changes.' },
    { name: 'placeholder', type: 'string', default: "'Select date range'", required: false, description: 'Placeholder text shown in the trigger input when no range is selected.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the trigger input and calendar popover.' },
    { name: 'minDate', type: 'Date', required: false, description: 'Earliest selectable date. Dates before this are greyed out.' },
    { name: 'maxDate', type: 'Date', required: false, description: 'Latest selectable date. Dates after this are greyed out.' },
    { name: 'numberOfMonths', type: 'number', default: '2', required: false, description: 'Number of months to display in the calendar popover.' },
    { name: 'label', type: 'string', required: false, description: 'Visible label rendered above the input.' },
    { name: 'error', type: 'string', required: false, description: 'Error message displayed below the input.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<DateRangePicker placeholder="Select date range…" />`,
    },
    {
      title: 'Controlled',
      code: `function ControlledDateRangePicker() {
  const [range, setRange] = React.useState({
    from: new Date('2026-04-01'),
    to: new Date('2026-04-14'),
  });
  return (
    <DateRangePicker
      label="Booking period"
      value={range}
      onChange={setRange}
      placeholder="Select date range…"
    />
  );
}`,
    },
  ],
};

export default entry;
