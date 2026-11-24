import type { NexubMessages } from './messages.js';

/**
 * 11.7: the date field strings on their own, so `@nexub/elements` (which bundles a few kB of
 * core, not the whole table) reads the same source as `defaultMessages`.
 */
export const dateFieldMessages = {
  pickDate: 'Pick a date',
  pickMonth: 'Pick a month',
  pickYear: 'Pick a year',
  previousMonth: 'Go to previous month',
  nextMonth: 'Go to next month',
  previousYear: 'Go to previous year',
  nextYear: 'Go to next year',
  previousYears: 'Go to previous years',
  nextYears: 'Go to next years',
  todayDate: (date: string) => `Today, ${date}`,
  selectedDate: (label: string) => `${label}, selected`,
} satisfies Partial<NexubMessages>;
