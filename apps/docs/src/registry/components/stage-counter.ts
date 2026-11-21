import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'stage-counter',
    title: 'Stage Counter',
    description: 'A row of selectable stat cards, each with a count and a failed count, that filters a list.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.3.0',
    related: ['stat-card', 'segmented-control', 'filter-bar', 'toggle-group'],
  },
  usage: {
    whenToUse: ['Counts per stage above a list of jobs, imports or orders, where pressing a stage filters the list.'],
    whenNotToUse: ['Counts that do not filter anything: use StatCard.', 'Switching between views: use Tabs or SegmentedControl.'],
  },
  props: [
    { name: 'stages', type: 'StageCounterStage[]', required: true, description: '`{ value, label, count, failed?, tone? }`. `failed` shows "3 failed" in the danger tone; `tone` colours the count.' },
    { name: 'value / defaultValue', type: 'string | null', description: 'The selected stage, `null` for all. Pressing the selected stage again clears it.' },
    { name: 'onValueChange', type: '(value: string | null) => void', description: 'Called with the new stage, or `null`.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Several stages at once: `value` is a `string[]`, an empty array means all.' },
    { name: 'aria-label', type: 'string', description: 'Names the group, e.g. "Filter by stage".' },
  ],
  examples: [{ title: 'Filters a list' }, { title: 'Several stages' }],
  a11y: {
    roles: ['`group` named by `aria-label`; each card is a toggle `button` with `aria-pressed`.'],
    keyboard: [
      { key: 'Tab', description: 'Moves between the stages.' },
      { key: 'Enter / Space', description: 'Selects or clears the stage.' },
    ],
    notes: ['The failed count is written out ("3 failed"), not shown by colour alone. Cards wrap on small screens.'],
  },
};

export default entry;
