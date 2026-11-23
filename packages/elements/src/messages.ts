export type ValidityKind = 'valueMissing' | 'rangeUnderflow' | 'rangeOverflow' | 'badInput' | 'typeMismatch';

/**
 * A validation message in the browser's own language where it has one: a detached native input
 * set up to fail the same way reports it. Falls back to English (and for `badInput`, which a
 * script can't produce on a native input, and `typeMismatch`, whose native wording names another type).
 */
export function validationMessage(kind: ValidityKind, type: 'number' | 'date' | 'month', bound: string, fallback: string): string {
  if (kind !== 'badInput' && kind !== 'typeMismatch' && typeof document !== 'undefined') {
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

/** `valueMissing`'s message, in the browser's language where it has one. */
export const missingMessage = (): string => validationMessage('valueMissing', 'number', '', 'Fill out this field.');
