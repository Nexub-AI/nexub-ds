import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'number-ticker',
    title: 'Number Ticker',
    description: 'A number whose digits roll to new values on the spatial spring. The first render never animates.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.6.0',
    related: ['amount', 'stat-card'],
  },
  props: [
    { name: 'value', type: 'number | string | NumberTickerPart[]', required: true, description: 'A number (formatted with `format` and `locale`), an already-formatted string, or styled parts.' },
    { name: 'format', type: 'Intl.NumberFormatOptions', required: false, description: 'Formatting for a number `value`.' },
    { name: 'locale', type: 'string', required: false, description: "BCP 47 locale. Defaults to the user's." },
    { name: 'aria-live', type: "'off' | 'polite'", default: "'off'", required: false, description: 'Announce changes to screen readers. Use `polite` only for values the user is waiting on.' },
  ],
  examples: [
    {
      title: 'Formatted number',
      description: 'Each digit is a 0–9 strip; separators and symbols stay still.',
      code: `const [n, setN] = React.useState(12480);

<NumberTicker value={n} format={{ maximumFractionDigits: 0 }} className="text-title-lg" />
<Button size="sm" variant="outlined" onClick={() => setN(Math.round(Math.random() * 100000))}>
  Change
</Button>`,
    },
    {
      title: 'Amount',
      description: '`Amount animate` uses the ticker and keeps the quieter symbol and minor units.',
      code: `<Amount value={balance} currency="USD" size="display" animate />`,
    },
  ],
  a11y: {
    screenReader: [
      'The full value is read as one string; the rolling digits are hidden from assistive tech.',
      'Under reduced motion digits change instantly.',
    ],
  },
};

export default entry;
