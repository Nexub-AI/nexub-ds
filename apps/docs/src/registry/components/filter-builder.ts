import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'filter-builder',
    title: 'Filter Builder',
    description: 'Build AND/OR filter queries with nested groups. The output is plain JSON your app runs.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '5.5.0',
    related: ['filter-bar', 'saved-views', 'data-table'],
  },
  props: [
    { name: 'fields', type: '{ id; label; type: "text" | "number" | "select" | "date"; options? }[]', required: true, description: 'What can be filtered. The type picks the operators and the value input.' },
    { name: 'value / defaultValue', type: 'FilterGroup', required: false, description: '`{ id, combinator: "and" | "or", rules: (FilterRule | FilterGroup)[] }`; a rule is `{ id, field, operator, value: string }`.' },
    { name: 'onValueChange', type: '(value: FilterGroup) => void', required: false, description: 'Called with the whole query on every change.' },
    { name: 'maxDepth', type: 'number', default: '1', required: false, description: 'Levels of nested groups "Add group" may create; 0 hides it.' },
  ],
  examples: [{ title: 'Deals filter' }],
  a11y: {
    roles: ['Each group is a `group` named "Filters, match all/any".'],
    screenReader: ['Field, condition and value controls are labelled; remove buttons say what they remove.'],
    notes: ['Helpers: `emptyFilter()`, `countFilters(group)`, `isFilterGroup(rule)`, `filterOperators`.'],
  },
};

export default entry;
