import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'money-input',
    title: 'Money Input',
    description: 'An amount field: locale-aware parsing as you type, grouped on blur, the currency symbol leading.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.5.0',
    related: ['amount', 'number-input', 'input'],
  },
  props: [
    { name: 'currency', type: 'string', required: true, description: 'ISO 4217 code, e.g. "EUR".' },
    { name: 'locale', type: 'string', required: false, description: "BCP 47 locale for separators. Defaults to the user's." },
    { name: 'value / defaultValue', type: 'number | null', required: false, description: 'The amount, or null when empty.' },
    { name: 'onValueChange', type: '(value: number | null) => void', required: false, description: 'Parsed amount, rounded to the minor unit, as the person types.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'German separators',
    },
  ],
};

export default entry;
