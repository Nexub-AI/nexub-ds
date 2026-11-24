/**
 * Registers `<nx-number-input>` only (11.9): a page that uses one element loads just its code.
 * `@nexub/elements/define` registers every element.
 *
 * @alpha
 */
import { NxNumberInput } from '../number-input.js';
import { register } from './register.js';

register('nx-number-input', NxNumberInput);

declare global {
  interface HTMLElementTagNameMap {
    'nx-number-input': NxNumberInput;
  }
}

export { NxNumberInput };
// The types its declarations name, so this file's .d.ts stands alone.
export type { NxFieldElement, FieldError } from '../field.js';
