import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'amount',
    title: 'Amount',
    description: 'Honest money: Intl formatting, tabular numerals, the currency’s minor unit and a true minus sign.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.5.0',
    updatedIn: '1.6.0',
    related: ['money-input', 'number-ticker'],
  },
  props: [
    { name: 'value', type: 'number', required: true, description: 'The amount.' },
    { name: 'currency', type: 'string', required: true, description: 'ISO 4217 code, e.g. "USD".' },
    { name: 'locale', type: 'string', required: false, description: "BCP 47 locale. Defaults to the user's." },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'display'", default: "'md'", required: false, description: '`display` is a hero figure with a quieter symbol and minor units.' },
    { name: 'tone', type: "'neutral' | 'auto'", default: "'neutral'", required: false, description: '`auto` colours gains success and losses error.' },
    { name: 'signDisplay', type: 'Intl signDisplay', required: false, description: "e.g. 'exceptZero' to show + on gains." },
    { name: 'animate', type: 'boolean', default: 'false', required: false, description: 'Roll the digits to new values (NumberTicker). The first render never animates.' },
  ],
  examples: [
    {
      title: 'Display',
      code: `<Amount value={128450.75} currency="USD" size="display" />`,
    },
    {
      title: 'Gains and losses',
      code: `<Amount value={312.4} currency="USD" tone="auto" signDisplay="exceptZero" />
<Amount value={-89.99} currency="USD" tone="auto" />`,
    },
  ],
};

export default entry;
