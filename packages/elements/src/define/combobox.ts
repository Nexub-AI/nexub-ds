/**
 * Registers `<nx-combobox>` only (11.9): a page that uses one element loads just its code.
 * `@nexub/elements/define` registers every element.
 *
 * @alpha
 */
import { NxCombobox } from '../combobox.js';
import { register } from './register.js';

register('nx-combobox', NxCombobox);

declare global {
  interface HTMLElementTagNameMap {
    'nx-combobox': NxCombobox;
  }
}

export { NxCombobox };
// The types its declarations name, so this file's .d.ts stands alone.
export type { NxFieldElement, FieldError } from '../field.js';
export type { ListPopup, NxChoiceElement, NxOption } from '../choice.js';
export type { NxSearch } from '../combobox.js';
