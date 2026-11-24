/**
 * Registers `<nx-select>` only (11.9): a page that uses one element loads just its code.
 * `@nexub/elements/define` registers every element.
 *
 * @alpha
 */
import { NxSelect } from '../select.js';
import { register } from './register.js';

register('nx-select', NxSelect);

declare global {
  interface HTMLElementTagNameMap {
    'nx-select': NxSelect;
  }
}

export { NxSelect };
// The types its declarations name, so this file's .d.ts stands alone.
export type { NxFieldElement, FieldError } from '../field.js';
export type { ListPopup, NxChoiceElement, NxOption } from '../choice.js';
