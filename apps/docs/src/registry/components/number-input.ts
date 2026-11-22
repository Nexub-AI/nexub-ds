import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'number-input',
    title: 'Number Input',
    description: 'A numeric input with optional steppers. Limits apply when the field loses focus; `nullable` lets it be empty.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    updatedIn: '11.1.0',
    related: ['number-input-element', 'money-input', 'slider'],
  },
  usage: {
    whenToUse: ['A quantity people type or step: seats, limits, percentages.', 'A value that may be empty (`nullable`) and must stay inside `min` and `max`.'],
    whenNotToUse: [
      'On a page without React (server-rendered HTML, a plain `<form>`): use `<nx-number-input>` from `@nexub/elements`, the same rules as a web component.',
      'Money: use MoneyInput. Phone numbers and codes: use a text input.',
    ],
  },
  props: [
    { name: 'value', type: 'number | null', required: false, description: 'Controlled value. `null` (with `nullable`) shows an empty field.' },
    { name: 'nullable', type: 'boolean', default: 'false', required: false, description: 'The field can be empty: clearing it reports `null`, not 0, and a half-typed `2.` or `-` stays while focused.' },
    { name: 'onValueChange', type: '(value: number) => void | (value: number | null) => void', required: false, description: 'Called while typing (not yet clamped) and with the clamped value on blur, steppers and arrow keys. With `nullable`, `null` when cleared.' },
    { name: 'min', type: 'number', required: false, description: 'Lowest value, applied on blur, steppers and arrow keys (never mid-typing, so 30 can be typed with a minimum of 15).' },
    { name: 'max', type: 'number', required: false, description: 'Highest value, applied the same way.' },
    { name: 'step', type: "number | 'any'", default: '1', required: false, description: "Increment for steppers and arrow keys. `'any'` allows any decimal (steppers then move by 1)." },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables the input and its controls.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, description: 'Controls font size and padding.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With range',
    },
    {
      title: 'Can be empty',
      description: '`nullable`: cleared means null. The limits apply on blur.',
    },
  ],
};

export default entry;
