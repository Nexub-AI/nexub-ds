import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'diff-view',
    title: 'Diff View',
    description: 'A unified diff with added and removed lines, for agent changes.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.8.0',
    related: ['message-bubble', 'thinking-indicator'],
  },
  props: [
    { name: 'diff', type: 'string', required: true, description: 'Unified diff text.' },
    { name: 'file', type: 'string', required: false, description: 'File name above the diff.' },
  ],
  examples: [{ title: 'Proposed change' }],
  a11y: { screenReader: ['Added and removed lines are spelled out for screen readers; colour is not the only cue.'] },
};

export default entry;
