/**
 * Registers `<nx-number-input>` and `<nx-date-picker>` (skipped for a tag that is already
 * defined, so loading this twice is safe).
 *
 * @alpha
 */
import { NxDatePicker, NxNumberInput } from './index.js';

const tags: [string, CustomElementConstructor][] = [
  ['nx-number-input', NxNumberInput],
  ['nx-date-picker', NxDatePicker],
];
if (typeof customElements !== 'undefined') {
  for (const [tag, ctor] of tags) if (!customElements.get(tag)) customElements.define(tag, ctor);
}

declare global {
  interface HTMLElementTagNameMap {
    'nx-number-input': NxNumberInput;
    'nx-date-picker': NxDatePicker;
  }
}

export { NxDatePicker, NxNumberInput };
