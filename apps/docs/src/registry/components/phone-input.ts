import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'phone-input',
    title: 'Phone Input',
    description: 'A phone field with a country picker. Groups the number as you type and reports it in E.164.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '10.8.0',
    related: ['input', 'select', 'otp-input', 'form-field'],
  },
  props: [
    { name: 'value / defaultValue', type: 'string', description: 'The number in E.164 ("+919847012345"), or an empty string.' },
    { name: 'onValueChange', type: '(e164: string, details: { country: string; national: string; valid: boolean }) => void', description: 'Called on every change. `valid` is a length check for the country, not proof the number exists.' },
    { name: 'defaultCountry', type: 'string', description: 'ISO 3166-1 alpha-2 code to start on. Defaults to the region of the provider locale, else `US`.' },
    { name: 'country / onCountryChange', type: 'string', description: 'Controls the selected country.' },
    { name: 'countries', type: 'string[]', description: 'Limits the picker to these countries, in this order. With one entry the picker becomes text.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the field.' },
    { name: 'invalid / disabled', type: 'boolean', description: 'Field states, with `readOnly` and `required`. Inside `FormField.Control` they come from the field.' },
    { name: 'name', type: 'string', description: 'Submits the E.164 value with a form.' },
    { name: 'sheet', type: "boolean | 'auto'", default: "'auto'", description: "Shows the country list as a bottom sheet; `'auto'` only on phones." },
  ],
  examples: [{ title: 'Default' }, { title: 'Restricted countries in a form field' }],
  a11y: {
    keyboard: [
      { key: 'Tab', description: 'Moves from the country picker to the number.' },
      { key: 'Enter / Space', description: 'Opens the country list; type to filter it.' },
    ],
    notes: [
      'The picker reads "Country code, India +91". The number field takes its name from the label or `aria-label`.',
      'Pasting a full international number picks its country and fills the rest.',
      'Validation is plausibility only: confirm the number on the server.',
    ],
  },
};

export default entry;
