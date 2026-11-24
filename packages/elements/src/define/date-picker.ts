/**
 * Registers `<nx-date-picker>` only (11.9): a page that uses one element loads just its code.
 * `@nexub/elements/define` registers every element.
 *
 * @alpha
 */
import { NxDatePicker } from '../date-picker.js';
import { register } from './register.js';

register('nx-date-picker', NxDatePicker);

declare global {
  interface HTMLElementTagNameMap {
    'nx-date-picker': NxDatePicker;
  }
}

export { NxDatePicker };
// The types its declarations name, so this file's .d.ts stands alone.
export type { NxFieldElement, FieldError } from '../field.js';
export type { DateGranularity } from '@nexub/core';
