/**
 * Registers `<nx-phone-input>` only (11.9): a page that uses one element loads just its code.
 * `@nexub/elements/define` registers every element.
 *
 * @alpha
 */
import { NxPhoneInput } from '../phone-input.js';
import { register } from './register.js';

register('nx-phone-input', NxPhoneInput);

declare global {
  interface HTMLElementTagNameMap {
    'nx-phone-input': NxPhoneInput;
  }
}

export { NxPhoneInput };
// The types its declarations name, so this file's .d.ts stands alone.
export type { NxFieldElement, FieldError } from '../field.js';
export type { CountryCode } from '@nexub/core';
