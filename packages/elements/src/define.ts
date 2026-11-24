/**
 * Registers `<nx-number-input>`, `<nx-date-picker>`, `<nx-select>`, `<nx-combobox>` and
 * `<nx-phone-input>` (skipped for a tag that is already defined, so loading this twice is safe).
 * A page that uses only some of them can load `@nexub/elements/define/<name>` for each instead
 * (`define/number-input`, `define/date-picker`, `define/select`, `define/combobox`,
 * `define/phone-input`).
 *
 * @alpha
 */
export { NxNumberInput } from './define/number-input.js';
export { NxDatePicker } from './define/date-picker.js';
export { NxSelect } from './define/select.js';
export { NxCombobox } from './define/combobox.js';
export { NxPhoneInput } from './define/phone-input.js';
