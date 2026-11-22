/**
 * The few UI strings the elements show, in English. They are the same strings as
 * `defaultMessages` in `@nexub/core` (a test checks), copied rather than imported: the whole
 * message table would add several kB to a page that needs ten strings.
 */
export const labels = {
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
};

export type ValidityKind = 'valueMissing' | 'rangeUnderflow' | 'rangeOverflow' | 'badInput';

/**
 * A validation message in the browser's own language where it has one: a detached native input
 * set up to fail the same way reports it. Falls back to English (and for `badInput`, which a
 * script can't produce on a native input).
 */
export function validationMessage(kind: ValidityKind, type: 'number' | 'date' | 'month', bound: string, fallback: string): string {
  if (kind !== 'badInput' && typeof document !== 'undefined') {
    const probe = document.createElement('input');
    if (kind === 'valueMissing') probe.required = true;
    else {
      probe.type = type;
      probe[kind === 'rangeUnderflow' ? 'min' : 'max'] = bound;
      // One step past the bound, in the input's own value format.
      probe.value = type === 'number' ? String(Number(bound) + (kind === 'rangeUnderflow' ? -1 : 1)) : kind === 'rangeUnderflow' ? '0001-01-01'.slice(0, bound.length) : '9999-12-31'.slice(0, bound.length);
    }
    if (probe.validationMessage) return probe.validationMessage;
  }
  return fallback;
}
