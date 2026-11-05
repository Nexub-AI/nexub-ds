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
    { name: 'countOnView', type: 'boolean', default: 'false', required: false, description: 'Count up from zeros when the ticker first scrolls into view (3.1). Only for a ticker that starts below the fold; the server HTML and screen readers always get the real value. Off under reduced motion.' },
  ],
  examples: [
    {
      title: 'Formatted number',
      description: 'Each digit is a 0–9 strip; separators and symbols stay still.',
    },
    {
      title: 'Amount',
      description: '`Amount animate` uses the ticker and keeps the quieter symbol and minor units.',
    },
    {
      title: 'Count on view',
      description: 'Scroll the preview so the number enters the view; it counts up once.',
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
