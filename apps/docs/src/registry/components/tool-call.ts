import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'tool-call',
    title: 'Tool Call',
    description: 'One tool call: its name and status, expandable to input and output.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.8.0',
    related: ['message-bubble', 'thinking-indicator'],
  },
  props: [
    { name: 'name', type: 'string', required: true, description: 'Tool name.' },
    { name: 'status', type: "'running' | 'done' | 'failed'", required: true, description: 'Shown as a badge.' },
    { name: 'input', type: 'unknown', required: false, description: 'Arguments, shown as JSON.' },
    { name: 'output', type: 'unknown', required: false, description: 'Result, as text or JSON.' },
  ],
  examples: [{ title: 'Tool call' }],
  a11y: { screenReader: ['A native `<details>` disclosure: opens with Enter or Space.'] },
};

export default entry;
