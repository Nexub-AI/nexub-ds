import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'date-time-picker',
    title: 'Date Time Picker',
    description: 'A DatePicker and a TimePicker that edit one Date, with an optional time-zone label.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.2.0',
    related: ['date-picker', 'time-picker'],
  },
  props: [
    { name: 'value / onValueChange', type: 'Date | undefined', required: false, description: 'Date and time in the reader’s local time.' },
    { name: 'defaultTime', type: 'string', default: "'09:00'", required: false, description: 'Time used when the date is picked first.' },
    { name: 'minuteStep', type: 'number', required: false, description: 'Passed to the TimePicker.' },
    { name: 'minDate / maxDate', type: 'Date', required: false, description: 'Limits the calendar.' },
    { name: 'timeZone', type: 'string', required: false, description: 'IANA zone named next to the fields, e.g. "Time zone: GMT+8 (Asia/Singapore)". Label only.' },
    { name: 'aria-label', type: 'string', required: false, description: 'Names the group; the parts read "Date" and "Time".' },
  ],
  examples: [{ title: 'Meeting start' }],
  a11y: { notes: ['A labelled group holding the DatePicker button and the native time input.'] },
};

export default entry;
