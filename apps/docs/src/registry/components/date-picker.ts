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
    { name: 'onValueChange', type: '(date: Date | undefined) => void', required: false, description: 'Called with the picked date.' },
    { name: 'locale', type: 'Locale (date-fns)', required: false, description: 'Month and weekday names, week start and the trigger format. Defaults to the NexubProvider `dateLocale`; the calendar also follows the provider `dir`, so arrows flip in RTL.' },
    { name: 'placeholder', type: 'string', default: "'Pick a date'", required: false, description: 'Placeholder text displayed in the input when no date is selected.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the date picker input and calendar.' },
    { name: 'minDate', type: 'Date', required: false, description: 'Earliest selectable date. Dates before this are greyed out.' },
    { name: 'maxDate', type: 'Date', required: false, description: 'Latest selectable date. Dates after this are greyed out.' },
    { name: 'aria-label', type: 'string', required: false, description: 'Field name for screen readers; the selected value is appended.' },
    { name: 'id', type: 'string', required: false, description: 'Id for the trigger button, e.g. to pair with a <label htmlFor>.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With value',
    },
    {
      title: 'With constraints',
    },
  ],
};

export default entry;
