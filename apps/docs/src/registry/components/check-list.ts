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
    { name: 'items', type: '(string | { label: ReactNode; status?: CheckListStatus })[]', description: 'Plain-text items. Shorthand for one `CheckListItem` each. 11.3: an object entry sets a status.' },
    { name: 'children', type: 'ReactNode', description: '`CheckListItem`s, for items with markup. Rendered after `items`.' },
    { name: 'CheckListItem children', type: 'ReactNode', required: true, description: 'The item text. The tick is decorative (hidden from screen readers).' },
    { name: 'CheckListItem status', type: "'done' | 'pending'", required: false, description: '11.3: `done` draws the tick, `pending` an empty ring with muted text. Either is read after the text ("Done" / "Pending"). Unset draws the tick with nothing read, as before.' },
    { name: 'CheckListItem statusLabel', type: 'string', required: false, description: '11.3: the words read for `status`, for other languages.' },
  ],
  examples: [{ title: 'From items' }, { title: 'With CheckListItem' }, { title: 'Done and pending', description: 'Setup steps with a status each.' }],
  usage: {
    whenToUse: ['Listing what a plan or feature includes', 'Confirming requirements that are already met'],
    whenNotToUse: ['Tasks the user can tick off: use `Checkbox`', 'Steps with progress or failures: use `PlanTracker` or `Stepper`'],
  },
};

export default entry;
