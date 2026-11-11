import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'check-list',
    title: 'Check List',
    description: 'A list with a success tick before each item, for features, plan inclusions and requirements met.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['plan-tracker'],
  },
  props: [
    { name: 'items', type: 'string[]', description: 'Plain-text items. Shorthand for one `CheckListItem` each.' },
    { name: 'children', type: 'ReactNode', description: '`CheckListItem`s, for items with markup. Rendered after `items`.' },
    { name: 'CheckListItem children', type: 'ReactNode', required: true, description: 'The item text. The tick is decorative (hidden from screen readers).' },
  ],
  examples: [{ title: 'From items' }, { title: 'With CheckListItem' }],
  usage: {
    whenToUse: ['Listing what a plan or feature includes', 'Confirming requirements that are already met'],
    whenNotToUse: ['Tasks the user can tick off: use `Checkbox`', 'Steps with progress or failures: use `PlanTracker` or `Stepper`'],
  },
};

export default entry;
