import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'usage-tile',
    title: 'Usage Tile',
    description: 'Used of limit: the value, the limit and a bar that warns near and at the limit.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.3.0',
    related: ['usage-bar', 'kpi-tile', 'progress', 'stat-card'],
  },
  usage: {
    whenToUse: ['Plan limits on a billing or settings page: seats, storage, API calls.', 'A dashboard tile where the limit matters as much as the number.'],
    whenNotToUse: ['A table cell or fact grid: use UsageBar.', 'A task moving toward done: use Progress.', 'A number with its change over time: use KpiTile or StatCard.'],
  },
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'What is being used, e.g. "Seats". Also names the meter.' },
    { name: 'used', type: 'number | null', required: true, description: 'The amount used. `null` or undefined shows the empty state.' },
    { name: 'limit', type: 'number | null', required: true, description: 'The limit. `null` or `Infinity` shows "Unlimited" and no bar.' },
    { name: 'warnAt', type: 'number', default: '0.8', description: 'Share of the limit that turns the bar to the warning tone. At or over the limit it is the danger tone.' },
    { name: 'valueFormat', type: '(value: number) => string', default: 'toLocaleString', description: 'Formats the value and the limit, e.g. `(n) => `${n} GB``.' },
    { name: 'note', type: 'ReactNode', description: 'An extra line under the bar, e.g. "Resets on 1 May".' },
    { name: 'action', type: 'ReactNode', description: 'A control beside the label, e.g. an Upgrade link.' },
    { name: 'loading / emptyState / errorState', type: 'boolean / ReactNode / ReactNode', description: 'The data states, same as KpiTile: a skeleton, the empty content, or the error content in place of the value.' },
  ],
  examples: [{ title: 'Under, near and at the limit' }, { title: 'Unlimited, note and action' }],
  a11y: {
    roles: ['The bar is a `meter` named by the label, with `aria-valuetext` such as "42 of 50, 84% used".'],
    notes: ['The level is written out ("80% used", "Limit reached"), so colour is never the only signal.'],
  },
};

export default entry;
