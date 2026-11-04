import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'date-range-picker',
    title: 'Date Range Picker',
    description: 'Dual-calendar date range selector.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'value', type: '{ from: Date | undefined; to: Date | undefined }', required: false, description: 'Controlled date range value.' },
    { name: 'onChange', type: '(range: { from: Date | undefined; to: Date | undefined }) => void', required: false, description: 'Callback invoked when the selected range changes.' },
    { name: 'locale', type: 'Locale (date-fns)', required: false, description: 'Month and weekday names, week start and the trigger format. Defaults to the NexubProvider `dateLocale`; the calendar also follows the provider `dir`, so arrows flip in RTL.' },
    { name: 'placeholder', type: 'string', default: "'Select date range'", required: false, description: 'Placeholder text shown in the trigger input when no range is selected.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the trigger input and calendar popover.' },
    { name: 'minDate', type: 'Date', required: false, description: 'Earliest selectable date. Dates before this are greyed out.' },
    { name: 'maxDate', type: 'Date', required: false, description: 'Latest selectable date. Dates after this are greyed out.' },
    { name: 'numberOfMonths', type: 'number', default: '2', required: false, description: 'Number of months to display in the calendar popover.' },
    { name: 'aria-label', type: 'string', required: false, description: 'Field name for screen readers; the selected value is appended.' },
    { name: 'id', type: 'string', required: false, description: 'Id for the trigger button, e.g. to pair with a <label htmlFor>.' },
    { name: 'error', type: 'string', required: false, description: 'Error message displayed below the input.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Controlled',
    },
  ],
};

export default entry;
